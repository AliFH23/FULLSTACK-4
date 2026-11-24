import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  deleteUser,
  updateUserStatus,
} from "../models/user.Model.js";
import { deleteUserRefreshTokens } from "../models/token.Model.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllUsersController = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  res.status(200).json({ message: "users found", users });
});

export const getUserByIdController = asyncHandler(async (req, res) => {
  const user = await getUserById(req.params.id);
  if (!user) {
    throw new AppError("user not found", 404);
  }
  res.status(200).json({ message: "user found", user });
});

export const getUserByEmailController = asyncHandler(async (req, res) => {
  const user = await getUserByEmail(req.params.email);
  if (!user) {
    throw new AppError("user not found", 404);
  }
  res.status(200).json({ message: "user found", user });
});

export const deleteUserController = asyncHandler(async (req, res) => {
  // الأدمن ما بيقدر يحذف حسابه بالغلط
  if (Number(req.params.id) === req.user.id) {
    throw new AppError("you cannot delete your own account", 400);
  }
  const user = await deleteUser(req.params.id); // منتجاته وتوكناته بينحذفوا (cascade)
  if (!user) {
    throw new AppError("user not found", 404);
  }
  res.status(200).json({ message: "user deleted", user });
});

export const updateUserStatusController = asyncHandler(async (req, res) => {
  const { newStatus } = req.body;
  const user = await updateUserStatus(req.params.id, newStatus);
  if (!user) {
    throw new AppError("user not found", 404);
  }
  // إذا انرفض أو تعلّق، بنطلّعه من كل الأجهزة
  if (newStatus !== "approved") {
    await deleteUserRefreshTokens(user.id);
  }
  res.status(200).json({ message: "user status updated", user });
});