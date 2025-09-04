import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import argon2 from "argon2";
import type { User } from "@prisma/client";
import { createClient } from "redis";
import { logger } from "../config/logger.js";

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

if (!redisHost || !redisPort) {
  throw new Error("FATAL ERROR: Redis host or port is not defined in .env file.");
}

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.on("error", (err) => logger.error("Redis Client Error", err));
redisClient.connect();

const OTP_EXPIRATION_SECONDS = 600; // 10 minutes

// Helper function to generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

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

export const changeUserPassword = async (userId: string, oldPassword: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
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

export const startEmailChange = async (userId: string, newEmail: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email: newEmail } });
  if (existingUser) throw new ApiError(409, "This email is already in use.");

  const otp = generateOtp();
  const redisKey = `otp:email:${userId}`;

  await redisClient.set(redisKey, JSON.stringify({ otp, newEmail }), {
    EX: OTP_EXPIRATION_SECONDS,
  });

  logger.info(`OTP for user ${userId} to change email to ${newEmail}: ${otp}`);
  return { message: `An OTP has been sent to ${newEmail}.` };
};

export const verifyEmailChange = async (userId: string, otp: string) => {
  const redisKey = `otp:email:${userId}`;
  const data = await redisClient.get(redisKey);

  if (!data) throw new ApiError(400, "Invalid or expired OTP.");

  const { otp: storedOtp, newEmail } = JSON.parse(data);
  if (storedOtp !== otp) throw new ApiError(400, "Invalid OTP.");

  await prisma.user.update({
    where: { id: userId },
    data: { email: newEmail, isEmailVerified: true },
  });

  await redisClient.del(redisKey);
  return { message: "Email address updated successfully." };
};

export const startPhoneChange = async (userId: string, newPhone: string) => {
  const existingUser = await prisma.user.findUnique({ where: { phone: newPhone } });
  if (existingUser) throw new ApiError(409, "This phone number is already in use.");

  const otp = generateOtp();
  const redisKey = `otp:phone:${userId}`;

  await redisClient.set(redisKey, JSON.stringify({ otp, newPhone }), {
    EX: OTP_EXPIRATION_SECONDS,
  });

  logger.info(`OTP for user ${userId} to change phone to ${newPhone}: ${otp}`);
  return { message: `An OTP has been sent to ${newPhone}.` };
};

export const verifyPhoneChange = async (userId: string, otp: string) => {
  const redisKey = `otp:phone:${userId}`;
  const data = await redisClient.get(redisKey);

  if (!data) throw new ApiError(400, "Invalid or expired OTP.");

  const { otp: storedOtp, newPhone } = JSON.parse(data);
  if (storedOtp !== otp) throw new ApiError(400, "Invalid OTP.");

  await prisma.user.update({
    where: { id: userId },
    data: { phone: newPhone, isPhoneVerified: true },
  });

  await redisClient.del(redisKey);
  return { message: "Phone number updated successfully." };
};

export const recordTermsConsent = async (userId: string, version: string) => {
  await prisma.termsConsent.create({
    data: {
      userId,
      version,
    },
  });
  return { message: "Terms consent recorded." };
};
