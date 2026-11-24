import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

// protect: لازم يكون في access token صالح
export const protect = (req, res, next) => {
  const header = req.headers.authorization;

  // الشكل المتوقع: "Bearer eyJhbGc..."
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("not authorized, no token", 401));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = { id: decoded.id, role: decoded.role }; // بيصير متاح لكل اللي بعده
    next();
  } catch (error) {
    next(error); // TokenExpiredError أو JsonWebTokenError، والـ error handler بيترجمهم
  }
};

// authorize: لازم يكون الدور من الأدوار المسموحة
// الاستخدام: authorize("admin") أو authorize("trader", "admin")
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("forbidden: you don't have permission", 403));
    }
    next();
  };
};