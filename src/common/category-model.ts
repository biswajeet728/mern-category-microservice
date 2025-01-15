import mongoose from "mongoose";
import { ICategory } from "./category-types";

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
});

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
