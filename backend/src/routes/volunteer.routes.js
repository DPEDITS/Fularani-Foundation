import { Router } from 'express';
import {
    registerVolunteer,
    loginVolunteer,
    getVolunteerProfile,
    getVolunteerStats,
    refreshAccessToken,
} from "../controllers/volunteer.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
    ]),
    registerVolunteer,
);

router.route("/login").post(loginVolunteer);

router.route("/profile").get(verifyJWT, getVolunteerProfile);
router.route("/stats").get(verifyJWT, getVolunteerStats);
router.route("/refresh-token").post(refreshAccessToken);

export default router;