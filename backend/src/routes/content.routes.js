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

const contentRouter = Router();
contentRouter.route("/create").post(
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
contentRouter.route("/:id").put(updateContent);
contentRouter.route("/:id").delete(deleteContent);

export default contentRouter;
