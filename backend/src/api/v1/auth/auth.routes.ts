import { Router } from "express";
import { register } from "./auth.controller.js";
import { validate } from "../../../middlewares/validate.js";
import { registerSchema } from "./auth.validation.js";
import type { Router as RouterType } from "express";
import { login } from "./auth.controller.js";
import { loginSchema } from "./auth.validation.js";

const router: RouterType = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

export default router;
