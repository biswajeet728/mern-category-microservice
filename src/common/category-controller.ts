import { NextFunction, Request, Response } from "express";
import Category from "./category-model";
import logger from "../config/logger";
import { isValidCategoryId } from "../services/id-validator";

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
      throw new Error("Invalid category ID");
    }

    const category = await Category.findById(id);

    if (!category) {
      throw new Error("Category not found");
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
      throw new Error("Invalid category ID");
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new Error("Category not found");
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
