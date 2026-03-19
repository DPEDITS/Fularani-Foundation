import { Router } from "express";
import {
    createDocument,
    getAllDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
} from "../controllers/document.controller.js";

const router = Router();

// Routes for /api/documents
router.route("/").post(createDocument).get(getAllDocuments);
router.route("/:id").get(getDocumentById).put(updateDocument).delete(deleteDocument);

export default router;
