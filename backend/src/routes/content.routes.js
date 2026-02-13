import { Router } from "express";
import { createContent } from "../controllers/content.controller.js";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
} from "../controllers/content.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const contentRouter = Router();
contentRouter.route("/create").post(
  verifyJWT,
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  createContent,
);
contentRouter.route("/").get(getAllContent);
contentRouter.route("/:id").get(getContentById);
contentRouter.route("/update/:id").put(
  verifyJWT,
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  updateContent,
);
contentRouter.route("/:id").delete(verifyJWT, deleteContent);

export default contentRouter;
