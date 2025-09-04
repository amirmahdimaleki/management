import { Router } from "express";
import type { Router as RouterType } from "express";
import {
  getMe,
  updateMe,
  changePassword,
  startEmailChange,
  verifyEmailChange,
  startPhoneChange,
  verifyPhoneChange,
  recordTermsConsent,
} from "./user.controller.js";
import { validate } from "../../../middlewares/validate.js";
import { updateUserSchema, changePasswordSchema } from "./user.validation.js";
import { protect } from "../../../middlewares/auth.middleware.js";
import { rateLimiterMiddleware } from "../../../middlewares/rateLimiter.middleware.js";

const router: RouterType = Router();

// All routes in this file are protected
router.use(protect);

router.route("/me").get(getMe).put(validate(updateUserSchema), updateMe);

router.post("/me/change-password", validate(changePasswordSchema), changePassword);

// Email change routes
router.post("/me/email/change/start", rateLimiterMiddleware, startEmailChange);
router.post("/me/email/change/verify", verifyEmailChange);

// Phone change routes
router.post("/me/phone/change/start", rateLimiterMiddleware, startPhoneChange);
router.post("/me/phone/change/verify", verifyPhoneChange);

// Terms consent route
router.post("/me/terms/consent", recordTermsConsent);

// **The Fix:** Add this line at the end of the file.
export default router;
