import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  updateCategory,
  deleteCategory,
} from "../models/categories.Model.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// CREATE
export const createCategoryController = asyncHandler(async (req, res) => {
  const { name, description, status } = req.body;

  const exists = await getCategoryByName(name);
  if (exists) {
    throw new AppError("category already exists", 409);
  }

  const newCategory = await createCategory({ name, description, status });
  res.status(201).json({ message: "category added successfully", category: newCategory });
});

// READ: الكل
export const getAllCategoriesController = asyncHandler(async (req, res) => {
  const categories = await getAllCategories();
  res.status(200).json({ categories });
});

// READ: حسب id
export const getCategoryByIdController = asyncHandler(async (req, res) => {
  const category = await getCategoryById(req.params.id);
  if (!category) {
    throw new AppError("category not found", 404);
  }
  res.status(200).json({ category });
});

// UPDATE: الاسم المكرر (23505) بيمسكه الـ error handler
export const updateCategoryController = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await updateCategory(req.params.id, name, description);
  if (!category) {
    throw new AppError("category not found", 404);
  }
  res.status(200).json({ message: "category updated successfully", category });
});

// DELETE: إذا فيها منتجات (23503) بيمسكه الـ error handler ← 409
export const deleteCategoryController = asyncHandler(async (req, res) => {
  const category = await deleteCategory(req.params.id);
  if (!category) {
    throw new AppError("category not found", 404);
  }
  res.status(200).json({ message: "category deleted successfully", category });
});