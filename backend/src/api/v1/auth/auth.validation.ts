import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().min(1, "ایمیل الزامی است").email("ایمیل معتبر نیست"), // This is correct, it just checks format.

    name: z.string().min(2, "نام باید حداقل ۲ کاراکتر باشد"),

    password: z
      .string()
      .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
      .regex(/[A-Z]/, "رمز عبور باید شامل حداقل یک حرف بزرگ باشد")
      .regex(/[a-z]/, "رمز عبور باید شامل حداقل یک حرف کوچک باشد")
      .regex(/[0-9]/, "رمز عبور باید شامل حداقل یک عدد باشد")
      .regex(/[^A-Za-z0-9]/, "رمز عبور باید شامل حداقل یک کاراکتر خاص باشد"),
  }),
});

// The login schema is where you might check if a user exists later on.
export const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, "ایمیل الزامی است").email("ایمیل معتبر نیست"),
    password: z.string().min(1, "رمز عبور الزامی است"),
  }),
});
