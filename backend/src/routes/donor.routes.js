import {Router} from 'express';
import { loginDonor, registerDonor } from '../controllers/donor.controller.js';
import multer from 'multer';
import { upload } from '../middlewares/multer.middleware.js';

const donorRouter = Router();

donorRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerDonor
)

donorRouter.route("/login").post(loginDonor)


export default donorRouter; 