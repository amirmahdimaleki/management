import type { Request, Response } from "express";
// Correct: Import specific functions using destructuring
import { registerUser, loginUser } from "../../../services/auth.service.js";
import { generateToken } from "../../../utils/jwt.js";

/**
 * Controller for user registration.
 */
export const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  // Now you can call registerUser directly
  const newUser = await registerUser({ email, name, password });

  const token = generateToken(newUser);

  res.status(201).json({
    message: "User registered successfully!",
    user: newUser,
    token,
  });
};

/**
 * Controller for user login.
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Call loginUser directly
  const user = await loginUser({ email, password });

  const token = generateToken(user);

  res.status(200).json({
    message: "Login successful!",
    user,
    token,
  });
};
