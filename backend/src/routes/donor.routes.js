import {Router} from 'express';
import { registerDonor } from '../controllers/donor.controller.js';
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


export default donorRouter; 