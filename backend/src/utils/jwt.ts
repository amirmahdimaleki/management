import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import type { Secret, SignOptions } from "jsonwebtoken";

// Locally re-declare StringValue type (matches jsonwebtoken's internal one)
type StringValue = `${number}s` | `${number}m` | `${number}h` | `${number}d` | `${number}w`;

// Load environment variables with type safety
const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN ?? "1h";

// Validate environment variables
if (!JWT_SECRET) {
  throw new Error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
}

// Validate and convert JWT_EXPIRES_IN to match number | StringValue for expiresIn
const getValidatedExpiresIn = (value: string): number | StringValue => {
  // Check if the value is a number (e.g., '3600' for seconds)
  const numericValue = Number(value);
  if (!isNaN(numericValue)) {
    return numericValue; // Return as number for expiresIn
  }

  // Check for valid time string format (e.g., '1h', '2d', '30m')
  const timePattern = /^\d+(s|m|h|d|w)$/; // Matches '30s', '1h', '2d', etc.
  if (timePattern.test(value)) {
    return value as StringValue; // Narrow type to StringValue
  }

  throw new Error('FATAL ERROR: JWT_EXPIRES_IN is invalid. Use a number (seconds) or format like "1h", "2d", "30m".');
};

// Get validated expiresIn value
const validatedExpiresIn: number | StringValue = getValidatedExpiresIn(JWT_EXPIRES_IN);

/**
 * Generates a JWT for a given user.
 * @param user - The user object, containing id and email.
 * @returns A signed JWT string.
 */
export const generateToken = (user: Pick<User, "id" | "email">): string => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  const options: SignOptions = {
    expiresIn: validatedExpiresIn, // Correctly typed now
  };

  return jwt.sign(payload, JWT_SECRET, options);
};
