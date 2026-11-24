import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../models/products.Model.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// التاجر بيعدّل منتجاته بس، والأدمن بيعدّل أي منتج
const checkOwnership = async (req) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    throw new AppError("product not found", 404);
  }
  if (req.user.role !== "admin" && product.created_by !== req.user.id) {
    throw new AppError("you can only modify your own products", 403);
  }
};

// CREATE: created_by بنقرأه من الـ token مش من الـ body
export const createProductController = asyncHandler(async (req, res) => {
  const newProduct = await createProduct({ ...req.body, created_by: req.user.id });
  res.status(201).json({ message: "product added successfully", product: newProduct });
});

// READ: الكل
export const getAllProductsController = asyncHandler(async (req, res) => {
  const products = await getAllProducts();
  res.status(200).json({ products });
});

// READ: حسب id
export const getProductByIdController = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    throw new AppError("product not found", 404);
  }
  res.status(200).json({ product });
});

// UPDATE
export const updateProductController = asyncHandler(async (req, res) => {
  await checkOwnership(req);
  const product = await updateProduct(req.params.id, req.body);
  res.status(200).json({ message: "product updated successfully", product });
});

// DELETE
export const deleteProductController = asyncHandler(async (req, res) => {
  await checkOwnership(req);
  const product = await deleteProduct(req.params.id);
  res.status(200).json({ message: "product deleted successfully", product });
});