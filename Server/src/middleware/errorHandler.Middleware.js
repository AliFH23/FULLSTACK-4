import { AppError } from "../utils/AppError.js";

// 404 لأي route مش موجود
export const notFound = (req, res, next) => {
  next(new AppError(`route not found: ${req.method} ${req.originalUrl}`, 404));
};

// المكان الوحيد اللي بيرد على الأخطاء
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "internal server error";

  // ===== أخطاء PostgreSQL =====
  if (err.code === "23505") {
    // قيمة مكررة بعمود UNIQUE
    statusCode = 409;
    message = "duplicate value: this record already exists";
  } else if (err.code === "23503") {
    // مشكلة foreign key
    if (err.detail && err.detail.includes("still referenced")) {
      statusCode = 409; // بتحذف إشي مستخدم، مثل category فيها منتجات
      message = "cannot delete: this record is used by other records";
    } else {
      statusCode = 400; // بتربط بإشي مش موجود، مثل category_id = 99
      message = "related record does not exist";
    }
  } else if (err.code === "22P02") {
    // نوع غلط، مثل /products/abc بدل رقم
    statusCode = 400;
    message = "invalid input format (id must be a number)";
  }

  // ===== أخطاء JWT =====
  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "token expired";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "invalid token";
  }

  // ===== JSON خربان بالـ body =====
  else if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "invalid JSON body";
  }

  // أخطاء الـ 500: بنطبعها عندنا، وما بنكشف تفاصيلها للمستخدم
  if (statusCode === 500) {
    console.error(err);
    message = "internal server error";
  }

  res.status(statusCode).json({ success: false, message });
};