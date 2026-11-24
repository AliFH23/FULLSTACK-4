import rateLimit from "express-rate-limit";

// عام: 100 طلب كل 15 دقيقة لكل IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "too many requests, please try again later" },
});

// للـ login و register: 5 محاولات فاشلة كل 15 دقيقة
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true, // المحاولات الناجحة ما بتنحسب
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "too many attempts, please try again after 15 minutes" },
});