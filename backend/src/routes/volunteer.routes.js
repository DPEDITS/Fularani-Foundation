import { Router } from 'express';
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

router.route("/register").post(
    upload.single("avatar"),
    registerVolunteer,
);

router.route("/login").post(loginVolunteer);
router.route("/forgot-password").post(forgotPasswordVolunteer);

router.route("/profile").get(verifyJWT, getVolunteerProfile);
router.route("/stats").get(verifyJWT, getVolunteerStats);
router.route("/refresh-token").post(refreshAccessToken);

export default router;