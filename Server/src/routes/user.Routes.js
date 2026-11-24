import express from "express";
import {
  getAllUsersController,
  getUserByIdController,
  getUserByEmailController,
  deleteUserController,
  updateUserStatusController,
} from "../controller/user.Controller.js";
import { validate } from "../middleware/validate.Middleware.js";
import { updateUserStatusSchema } from "../validation/user.Validation.js";
import { protect, authorize } from "../middleware/auth.Middleware.js";

const router = express.Router();

// كل الـ routes هون للأدمن بس
router.use("/users", protect, authorize("admin"));

router.get("/users", getAllUsersController);
router.get("/users/email/:email", getUserByEmailController);
router.get("/users/:id", getUserByIdController);
router.patch("/users/:id/status", validate(updateUserStatusSchema), updateUserStatusController);
router.delete("/users/:id", deleteUserController);

export default router;