import { Router } from "express";
import {
    createContact,
    getAllContacts,
    updateContactStatus,
    getContactById,
    deleteContact
} from "../controllers/contact.controller.js";
// import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public route - anyone can submit a contact form
router.route("/").post(createContact);

// Admin routes - protected (uncomment verifyJWT when authentication is ready)
// router.route("/").get(verifyJWT, getAllContacts);
// router.route("/:id").get(verifyJWT, getContactById);
// router.route("/:id").patch(verifyJWT, updateContactStatus);
// router.route("/:id").delete(verifyJWT, deleteContact);

// Temporary routes for testing without authentication
router.route("/all").get(getAllContacts);
router.route("/:id").get(getContactById);
router.route("/:id").patch(updateContactStatus);
router.route("/:id").delete(deleteContact);

export default router;
