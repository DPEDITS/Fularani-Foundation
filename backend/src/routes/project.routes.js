import { Router } from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
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
router.route("/create").post(verifyJWT, verifyAdmin, createProject);
router.route("/assign").post(verifyJWT, verifyAdmin, assignProject);
router.route("/all").get(verifyJWT, verifyAdmin, getAllProjects); // Admin sees all
router.route("/link-donation").post(verifyJWT, verifyAdmin, linkDonationToProject);

// Volunteer routes
router.route("/my-projects").get(verifyJWT, getVolunteerProjects);
router.route("/submit-proof").post(
    verifyJWT,
    upload.array("images", 5), // Allow up to 5 images
    submitProofOfWork
);

router.route("/:id").get(verifyJWT, getProjectById);

export default router;
