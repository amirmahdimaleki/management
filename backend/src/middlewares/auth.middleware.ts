import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";
import ApiError from "../utils/ApiError.js";
import type { Request, Response, NextFunction } from "express";
import type { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;

// Extend the Express Request type to include the user property
export interface AuthRequest extends Request {
  user?: Omit<User, "password">;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(new ApiError(401, "Not authorized, no token"));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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

    if (!user) {
      return next(new ApiError(401, "Not authorized, user not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, "Not authorized, token failed"));
  }
};
