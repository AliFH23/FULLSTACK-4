import express from "express";
import { createCategoryController } from "../controller/categories.Controller.js";

const router = express.Router();

router.post("/categories", createCategoryController);

export default router;