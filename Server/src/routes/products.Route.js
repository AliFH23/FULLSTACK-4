import express from "express";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "../controller/products.Controller.js";
import { validate } from "../middleware/validate.Middleware.js";
import { createProductSchema, updateProductSchema } from "../validation/products.Validation.js";
import { protect, authorize } from "../middleware/auth.Middleware.js";

const router = express.Router();

// عامة: أي حدا بيقدر يشوف المنتجات
router.get("/products", getAllProductsController);
router.get("/products/:id", getProductByIdController);

// محمية: التاجر أو الأدمن بس
router.post("/products", protect, authorize("trader", "admin"), validate(createProductSchema), createProductController);
router.put("/products/:id", protect, authorize("trader", "admin"), validate(updateProductSchema), updateProductController);
router.delete("/products/:id", protect, authorize("trader", "admin"), deleteProductController);

export default router;