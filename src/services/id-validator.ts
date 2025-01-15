import mongoose from "mongoose";

export const isValidCategoryId = async (
  categoryId: string
): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return false;
  }
  return true;
};
