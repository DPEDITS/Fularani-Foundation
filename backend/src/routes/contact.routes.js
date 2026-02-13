import { Router } from "express";
import {
    createContact,
    getAllContacts,
    updateContactStatus,
    getContactById,
    deleteContact
} from "../controllers/contact.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route - anyone can submit a contact form
router.route("/").post(createContact);

// Admin routes - protected
router.route("/all").get(verifyJWT, verifyAdmin, getAllContacts);
router.route("/:id").get(verifyJWT, verifyAdmin, getContactById);
router.route("/:id").patch(verifyJWT, verifyAdmin, updateContactStatus);
router.route("/:id").delete(verifyJWT, verifyAdmin, deleteContact);

export default router;
