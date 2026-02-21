import { Router } from "express";
import {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
} from "../controllers/content.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const contentRouter = Router();

contentRouter.route("/create").post(
  verifyJWT,
  verifyAdmin,
  upload.fields([
    {
      name: "markdownFile",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  createContent
);

contentRouter.route("/").get(getAllContent);

contentRouter.route("/:id").get(getContentById);

contentRouter.route("/update/:id").put(
  verifyJWT,
  verifyAdmin,
  upload.fields([
    {
      name: "markdownFile",
      maxCount: 1,
    },
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  updateContent
);

contentRouter.route("/:id").delete(verifyJWT, verifyAdmin, deleteContent);

export default contentRouter;
