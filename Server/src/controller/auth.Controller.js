import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createUser,
  getUserForLogin,
  getUserByEmail,
  getUserById,
} from "../models/user.Model.js";
import {
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from "../models/token.Model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} from "../utils/tokens.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// إعدادات الـ cookie تبعت الـ refresh token
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true, // الـ JavaScript بالمتصفح ما بيقدر يقرأها، وهاد بيحمي من XSS
  secure: process.env.NODE_ENV === "production", // https بس بالـ production
  sameSite: "strict", // ما بتنبعث من مواقع ثانية، وهاد بيحمي من CSRF
  path: "/api/auth", // بتنبعث بس لـ routes الـ auth
};
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 أيام بالـ ms

// بيعمل التوكنين، بيخزن الـ refresh بالداتابيس وبالـ cookie، وبيرجّع الـ access
const issueTokens = async (res, user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const { exp } = jwt.decode(refreshToken); // وقت الانتهاء بالثواني
  await saveRefreshToken(user.id, hashToken(refreshToken), new Date(exp * 1000));

  res.cookie("refreshToken", refreshToken, {
    ...REFRESH_COOKIE_OPTIONS,
    maxAge: REFRESH_COOKIE_MAX_AGE,
  });

  return accessToken;
};

// POST /api/auth/register
export const registerController = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await getUserByEmail(email);
  if (exists) {
    throw new AppError("email already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // التاجر لازم الأدمن يوافق عليه
  const status = role === "trader" ? "pending" : "approved";

  const user = await createUser({ name, email, hashedPassword, role, status });

  res.status(201).json({
    message:
      status === "pending"
        ? "account created, waiting for admin approval"
        : "account created successfully",
    user,
  });
});

// POST /api/auth/login
export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserForLogin(email);

  // نفس الرسالة للحالتين، عشان المهاجم ما يعرف إذا الإيميل موجود أو لا
  if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
    throw new AppError("invalid email or password", 401);
  }

  if (user.status === "pending") {
    throw new AppError("your account is waiting for admin approval", 403);
  }
  if (user.status === "rejected") {
    throw new AppError("your account has been rejected", 403);
  }

  const accessToken = await issueTokens(res, user);

  // بنشيل hashed_password قبل ما نرجّع المستخدم
  const { hashed_password, ...safeUser } = user;

  res.status(200).json({
    message: "logged in successfully",
    accessToken,
    user: safeUser,
  });
});

// POST /api/auth/refresh
export const refreshController = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new AppError("no refresh token", 401);
  }

  // 1) نتأكد إن التوقيع صح ولسا ما انتهى (إذا لا، بيرمي خطأ والـ error handler بيمسكه)
  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  // 2) نتأكد إنه موجود بالداتابيس، يعني ما انعمله logout ولا انستخدم قبل
  const tokenHash = hashToken(token);
  const stored = await findRefreshToken(tokenHash);
  if (!stored) {
    throw new AppError("refresh token is invalid or revoked", 401);
  }

  // 3) Rotation: نحذف القديم
  await deleteRefreshToken(tokenHash);

  // 4) نتأكد إن المستخدم لسا موجود ومقبول
  const user = await getUserById(decoded.id);
  if (!user || user.status !== "approved") {
    throw new AppError("user not allowed", 401);
  }

  // 5) نعطيه توكنات جديدة
  const accessToken = await issueTokens(res, user);
  res.status(200).json({ accessToken });
});

// POST /api/auth/logout
export const logoutController = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    await deleteRefreshToken(hashToken(token));
  }
  res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
  res.status(200).json({ message: "logged out successfully" });
});

// GET /api/auth/me: مين أنا؟ (محمي)
export const meController = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);
  if (!user) {
    throw new AppError("user not found", 404);
  }
  res.status(200).json({ user });
});