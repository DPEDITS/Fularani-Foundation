import { Router } from "express";
import {
  registerVolunteer,
  loginVolunteer,
  getVolunteerProfile,
  getVolunteerStats,
  refreshAccessToken,
  forgotPasswordVolunteer,
} from "../controllers/volunteer.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.single("avatar"), registerVolunteer);

import rateLimit from "express-rate-limit";

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message:
      "Too many password reset attempts, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.route("/login").post(loginVolunteer);
router
  .route("/forgot-password")
  .post(forgotPasswordLimiter, forgotPasswordVolunteer);

router.route("/profile").get(verifyJWT, getVolunteerProfile);
router.route("/stats").get(verifyJWT, getVolunteerStats);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
