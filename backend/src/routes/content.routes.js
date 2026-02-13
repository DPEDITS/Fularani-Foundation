import { Router } from "express";
import {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
} from "../controllers/content.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const contentRouter = Router();

/*
    CREATE CONTENT
*/
contentRouter.route("/create").post(
  verifyJWT,
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

/*
    GET ALL CONTENT
*/
contentRouter.route("/").get(getAllContent);

/*
    GET CONTENT BY ID
*/
contentRouter.route("/:id").get(getContentById);

/*
    UPDATE CONTENT
*/
contentRouter.route("/update/:id").put(
  verifyJWT,
  upload.fields([
    {
      name: "markdownFile",   // <-- allow markdown update
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
contentRouter.route("/:id").delete(verifyJWT, deleteContent);

export default contentRouter;
