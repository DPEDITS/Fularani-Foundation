import {Router} from 'express';
import { 
    loginDonor, 
    registerDonor,
    logoutDonor,
    getCurrentDonor,
    getDonorProfile,
    getDonorDonations,
    getDonorStats
} from '../controllers/donor.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const donorRouter = Router();

// Public routes
donorRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerDonor
)

donorRouter.route("/login").post(loginDonor)

// Protected routes (require authentication)
donorRouter.route("/logout").post(verifyJWT, logoutDonor)
donorRouter.route("/current-user").get(verifyJWT, getCurrentDonor)
donorRouter.route("/profile").get(verifyJWT, getDonorProfile)
donorRouter.route("/donations").get(verifyJWT, getDonorDonations)
donorRouter.route("/stats").get(verifyJWT, getDonorStats)

export default donorRouter; 