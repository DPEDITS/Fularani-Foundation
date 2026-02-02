import { Router } from "express";
import { registerAdmin, loginAdmin } from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const adminRouter = Router();

adminRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerAdmin,
);

adminRouter.route("/login").post(loginAdmin);

export default adminRouter;
