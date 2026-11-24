import express from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  updateCategoryController,
  deleteCategoryController,
} from "../controller/categories.Controller.js";
import { validate } from "../middleware/validate.Middleware.js";
import { createCategorySchema, updateCategorySchema } from "../validation/categories.Validation.js";
import { protect, authorize } from "../middleware/auth.Middleware.js";

const router = express.Router();

// عامة
router.get("/categories", getAllCategoriesController);
router.get("/categories/:id", getCategoryByIdController);

// للأدمن بس
router.post("/categories", protect, authorize("admin"), validate(createCategorySchema), createCategoryController);
router.put("/categories/:id", protect, authorize("admin"), validate(updateCategorySchema), updateCategoryController);
router.delete("/categories/:id", protect, authorize("admin"), deleteCategoryController);

export default router;