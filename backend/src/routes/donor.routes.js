import { Router } from "express";
import {
  loginDonor,
  registerDonor,
  logoutDonor,
  getCurrentDonor,
  getDonorProfile,
  getDonorDonations,
  getDonorStats,
  updateDonorProfile,
  updateDonorAvatar,
  forgotPasswordDonor,
  getRecentDonors,
} from "../controllers/donor.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const donorRouter = Router();

// Public routes
donorRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerDonor,
);

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

donorRouter.route("/login").post(loginDonor);
donorRouter
  .route("/forgot-password")
  .post(forgotPasswordLimiter, forgotPasswordDonor);
donorRouter.route("/recent-donors").get(getRecentDonors);

// Protected routes (require authentication)
donorRouter.route("/logout").post(verifyJWT, logoutDonor);
donorRouter.route("/current-user").get(verifyJWT, getCurrentDonor);
donorRouter.route("/profile").get(verifyJWT, getDonorProfile);
donorRouter.route("/donations").get(verifyJWT, getDonorDonations);
donorRouter.route("/stats").get(verifyJWT, getDonorStats);
donorRouter.route("/update-profile").patch(verifyJWT, updateDonorProfile);
donorRouter
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateDonorAvatar);

export default donorRouter;
