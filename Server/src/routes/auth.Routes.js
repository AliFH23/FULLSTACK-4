import express from "express";
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  meController,
} from "../controller/auth.Controller.js";
import { validate } from "../middleware/validate.Middleware.js";
import { registerSchema, loginSchema } from "../validation/auth.Validation.js";
import { protect } from "../middleware/auth.Middleware.js";
import { authLimiter } from "../middleware/rateLimit.Middleware.js";

const router = express.Router();

router.post("/register", authLimiter, validate(registerSchema), registerController);
router.post("/login", authLimiter, validate(loginSchema), loginController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);
router.get("/me", protect, meController);

export default router;