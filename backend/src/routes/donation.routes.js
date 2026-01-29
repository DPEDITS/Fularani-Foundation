import { Router } from "express";
import { createDonation } from "../controllers/donation.controller.js";
import multer from "multer";
import { upload } from "../middlewares/multer.middleware.js";

const donationRouter = Router();

donationRouter.route("/create").post(createDonation);

export default donationRouter;
