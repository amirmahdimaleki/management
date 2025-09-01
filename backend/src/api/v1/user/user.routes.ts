import { Router } from "express";
import type { Router as RouterType } from "express";
import { getMe, updateMe, changePassword } from "./user.controller.js";
import { validate } from "../../../middlewares/validate.js";
import { updateUserSchema, changePasswordSchema } from "./user.validation.js";
import { protect } from "../../../middlewares/auth.middleware.js";

const router: RouterType = Router();

// All routes in this file are protected and require a logged-in user
router.use(protect);

router.route("/me").get(getMe).put(validate(updateUserSchema), updateMe);

router.post("/me/change-password", validate(changePasswordSchema), changePassword);

export default router;
