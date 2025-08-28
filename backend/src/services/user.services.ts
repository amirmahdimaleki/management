import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import argon2 from "argon2";
import type { User } from "@prisma/client";

/**
 * Updates a user's profile information.
 * @param userId - The ID of the user to update.
 * @param data - The data to update (e.g., name).
 * @returns The updated user object without the password.
 */
export const updateUserProfile = async (userId: string, data: Partial<Pick<User, "name">>) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      lastLogin: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedUser;
};

/**
 * Changes a user's password.
 * @param userId - The ID of the user.
 * @param oldPassword - The user's current password.
 * @param newPassword - The desired new password.
 * @throws {ApiError} If the old password is incorrect.
 */
export const changeUserPassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    // This case should be rare since the user is authenticated
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await argon2.verify(user.password, oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Incorrect old password");
  }

  const hashedNewPassword = await argon2.hash(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword },
  });
};
