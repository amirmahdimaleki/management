import { Router } from "express";
import type { Router as RouterType } from "express";
import authRoutes from "./auth/auth.routes.js";
import userRoutes from "./user/user.routes.js"; // <-- Import user routes

const router: RouterType = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes); // <-- Use user routes

export default router;
