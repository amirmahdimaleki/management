import { RateLimiterRedis } from "rate-limiter-flexible";
import { createClient } from "redis";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import { logger } from "../config/logger.js";

// 1. Ensure environment variables are defined
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

if (!redisHost || !redisPort) {
  throw new Error("Redis host or port is not defined in environment variables.");
}

// 2. Create the Redis client
const redisClient = createClient({
  url: `redis://${redisHost}:${redisPort}`,
  disableOfflineQueue: true,
});

redisClient.on("error", (err) => logger.error("Redis Client Error", err));
redisClient.connect();

// 3. Configure and create the rate limiter instance
const opts = {
  storeClient: redisClient,
  keyPrefix: "rate-limit",
  points: 10, // 10 requests
  duration: 60, // per 60 seconds by IP
};

const rateLimiter = new RateLimiterRedis(opts);

// 4. Export the middleware function that uses the rateLimiter
export const rateLimiterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const key = req.ip || req.socket.remoteAddress;

  if (!key) {
    return next(new ApiError(400, "Could not identify request source."));
  }

  rateLimiter
    .consume(key)
    .then(() => {
      next();
    })
    .catch(() => {
      next(new ApiError(429, "Too Many Requests"));
    });
};
