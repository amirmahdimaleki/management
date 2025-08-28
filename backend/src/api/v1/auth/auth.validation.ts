import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, "Email is required") // Direct message string is also cleaner here
      .email("Not a valid email")
      .refine((e) => e === "abcd@fg.com", "This email is not in our database"),

    name: z.string().min(2, "Name must be at least 2 characters long"),

    // Updated .regex() calls with direct string messages
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, "Email is required").email("Not a valid email"),
    password: z.string().min(1, "Password is required"),
  }),
});
