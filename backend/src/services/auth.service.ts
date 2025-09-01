import argon2 from "argon2";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import type { User } from "@prisma/client";

/**
 * Creates a new user in the database.
 * @param userData - The user's email, name, and password.
 * @returns The newly created user object, without the password.
 * @throws {ApiError} If the email is already taken.
 */
export const registerUser = async (userData: Pick<User, "email" | "name" | "password">) => {
  const { email, name, password } = userData;

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  // 2. Hash the password
  const hashedPassword = await argon2.hash(password);

  // 3. Create the user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  // 4. Return user data without the password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Authenticates a user.
 * @param credentials - The user's email and password.
 * @returns The user object without the password if successful.
 * @throws {ApiError} If credentials are invalid.
 */
export const loginUser = async (credentials: Pick<User, "email" | "password">) => {
  const { email, password } = credentials;

  // 1. Find the user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 2. Verify the password
  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  // 3. Update lastLogin timestamp
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // 4. Return user data without the password
  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};
