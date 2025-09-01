import type { Response } from "express";
import { updateUserProfile, changeUserPassword } from "../../../services/user.services.ts";
import type { AuthRequest } from "../../../middlewares/auth.middleware.js";

/**
 * Gets the currently logged-in user's profile.
 */
export const getMe = (req: AuthRequest, res: Response) => {
  // The user object is attached to the request by the 'protect' middleware
  res.status(200).json({ user: req.user });
};

/**
 * Updates the currently logged-in user's profile.
 */
export const updateMe = async (req: AuthRequest, res: Response) => {
  const updatedUser = await updateUserProfile(req.user!.id, req.body);
  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
};

/**
 * Changes the currently logged-in user's password.
 */
export const changePassword = async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  await changeUserPassword(req.user!.id, oldPassword, newPassword);
  res.status(200).json({ message: "Password changed successfully" });
};
