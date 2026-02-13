import { Router } from "express";
import {
  createGalleryItem,
  deleteGalleryItem,
  getAllGalleryItems,
  getGalleryItemById,
  updateGalleryItem,
} from "../controllers/gallery.controller.js";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const galleryRouter = Router();

galleryRouter.route("/upload").post(
  verifyJWT,
  upload.fields([
    {
      name: "imageUrl",
    },
  ]),
  createGalleryItem,
);

galleryRouter.route("/").get(getAllGalleryItems);

galleryRouter.route("/:id").get(getGalleryItemById);

galleryRouter.route("/delete/:id").delete(verifyJWT, deleteGalleryItem);

galleryRouter.route("/update/:id").put(
  verifyJWT,
  upload.fields([
    {
      name: "imageUrl",
    },
  ]),
  updateGalleryItem,
);

//edit , delete , get all , get by id

export default galleryRouter;
