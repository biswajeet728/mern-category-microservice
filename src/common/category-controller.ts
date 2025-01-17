import { NextFunction, Request, Response } from "express";
import Category from "./category-model";
import logger from "../config/logger";
import { isValidCategoryId } from "../services/id-validator";
import { ErrorHandler } from "../services/ErrorService";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    // create category
    const category = new Category({
      name,
      slug: `category-${name.toLowerCase().replace(" ", "-")}`,
    });

    // save category
    await category.save();

    // log
    logger.info("Category created successfully");

    // return response
    res.status(201).json({
      message: "Category created successfully",
      category: category._id,
    });
  } catch (error) {
    next(error);
    return;
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await Category.find({});
    logger.info("Category list fetched successfully");
    res.status(200).json(list);
  } catch (error) {
    next(error);
    return;
  }
};

export const single = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query;

  try {
    const isValidId = await isValidCategoryId(String(id));
    if (!isValidId) {
      return next(new ErrorHandler("Invalid category ID", 400));
    }

    const category = await Category.findById(id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    logger.info("Category fetched successfully");

    res.status(200).json(category);
  } catch (error) {
    next(error);
    return;
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.query;
  try {
    const isValidId = await isValidCategoryId(String(id));
    if (!isValidId) {
      return next(new ErrorHandler("Invalid category ID", 400));
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }

    logger.info("Category deleted successfully");

    res.status(200).json({
      message: "Category deleted successfully",
      category: category._id,
    });
  } catch (error) {
    next(error);
    return;
  }
};
