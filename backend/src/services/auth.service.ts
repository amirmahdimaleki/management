import argon2 from "argon2";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import type { User } from "@prisma/client";

export const registerUser = async (userData: Pick<User, "email" | "name" | "password">) => {
  const { email, name, password } = userData;
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }
  const hashedPassword = await argon2.hash(password);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginUser = async (credentials: Pick<User, "email" | "password">) => {
  const { email, password } = credentials;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const LATEST_TERMS_VERSION = "2.0";
  const hasConsented = await prisma.termsConsent.findFirst({
    where: {
      userId: user.id,
      version: LATEST_TERMS_VERSION,
    },
  });

  const needsConsent = !hasConsented;

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  return { ...userWithoutPassword, needsConsent };
};
