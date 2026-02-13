import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createProject,
    assignProject,
    submitProofOfWork,
    getAllProjects,
    getVolunteerProjects,
    getProjectById,
    linkDonationToProject
} from "../controllers/project.controller.js";

const router = Router();

// Admin routes (protected)
// Ideally, you should have an isAdmin middleware. For now, we'll assume verifyJWT + check in controller or separate middleware
router.route("/create").post(verifyJWT, createProject);
router.route("/assign").post(verifyJWT, assignProject);
router.route("/all").get(verifyJWT, getAllProjects); // Admin sees all
router.route("/link-donation").post(verifyJWT, linkDonationToProject);

// Volunteer routes
router.route("/my-projects").get(verifyJWT, getVolunteerProjects);
router.route("/submit-proof").post(
    verifyJWT,
    upload.array("images", 5), // Allow up to 5 images
    submitProofOfWork
);

router.route("/:id").get(verifyJWT, getProjectById);

export default router;
