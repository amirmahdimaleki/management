import type { Response } from "express";
import * as userService from "../../../services/user.services.ts";
import type { AuthRequest } from "../../../middlewares/auth.middleware.js";

export const getMe = (req: AuthRequest, res: Response) => {
  res.status(200).json({ user: req.user });
};

export const updateMe = async (req: AuthRequest, res: Response) => {
  const updatedUser = await userService.updateUserProfile(req.user!.id, req.body);
  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  await userService.changeUserPassword(req.user!.id, oldPassword, newPassword);
  res.status(200).json({ message: "Password changed successfully" });
};

export const startEmailChange = async (req: AuthRequest, res: Response) => {
  const { newEmail } = req.body;
  const result = await userService.startEmailChange(req.user!.id, newEmail);
  res.status(200).json(result);
};

export const verifyEmailChange = async (req: AuthRequest, res: Response) => {
  const { otp } = req.body;
  const result = await userService.verifyEmailChange(req.user!.id, otp);
  res.status(200).json(result);
};

export const startPhoneChange = async (req: AuthRequest, res: Response) => {
  const { newPhone } = req.body;
  const result = await userService.startPhoneChange(req.user!.id, newPhone);
  res.status(200).json(result);
};

export const verifyPhoneChange = async (req: AuthRequest, res: Response) => {
  const { otp } = req.body;
  const result = await userService.verifyPhoneChange(req.user!.id, otp);
  res.status(200).json(result);
};

export const recordTermsConsent = async (req: AuthRequest, res: Response) => {
  const { version } = req.body;
  const result = await userService.recordTermsConsent(req.user!.id, version);
  res.status(200).json(result);
};
