import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";
import ApiError from "../utils/ApiError.js";
import { ZodError } from "zod";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    logger.error(`[API Error] ${err.statusCode} - ${err.message}`);
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof ZodError) {
    logger.warn(`[Validation Error] - ${err.message}`);
    return res.status(400).json({
      message: "Invalid request data",
      errors: err.flatten().fieldErrors,
    });
  }

  logger.error(err.stack);

  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
