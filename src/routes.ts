import express from "express";
import { validate } from "./middlewares/validator.middleware";
import { categorySchema } from "./validator";
import {
  create,
  deleteCategory,
  list,
  single,
} from "./common/category-controller";
import { adminOnly, authenticate } from "./middlewares/authenticate";

const router = express.Router();

router.post("/new", authenticate, adminOnly, validate(categorySchema), create);
router.get("/list", list);
router.get("/single", single);
router.delete("/delete", authenticate, adminOnly, deleteCategory);

export default router;
