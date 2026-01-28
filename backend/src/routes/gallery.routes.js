import {Router} from 'express';
import { createGalleryItem } from '../controllers/gallery.controller.js';
import multer from 'multer';
import { upload } from '../middlewares/multer.middleware.js';

const galleryRouter = Router();

galleryRouter.route("/upload").post(
    upload.fields([
        {
            name: "imageUrl",
        }
    ]),
    createGalleryItem
)

//edit , delete , get all , get by id

export default galleryRouter; 