import { Router } from 'express';
import { createGalleryItem, deleteGalleryItem, getAllGalleryItems, getGalleryItemById, updateGalleryItem } from '../controllers/gallery.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJWT, verifyAdmin } from '../middlewares/auth.middleware.js';

const galleryRouter = Router();

galleryRouter.route("/upload").post(
    verifyJWT,
    verifyAdmin,
    upload.fields([
        {
            name: "imageUrl",
        }
    ]),
    createGalleryItem
)

galleryRouter.route("/").get(getAllGalleryItems)

galleryRouter.route("/:id").get(getGalleryItemById)

galleryRouter.route("/delete/:id").delete(verifyJWT, verifyAdmin, deleteGalleryItem)

galleryRouter.route("/update/:id").put(
    verifyJWT,
    verifyAdmin,
    upload.fields([
        {
            name: "imageUrl",
        }
    ]),
    updateGalleryItem
)

//edit , delete , get all , get by id

export default galleryRouter;
