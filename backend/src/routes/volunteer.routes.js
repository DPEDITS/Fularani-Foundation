import {Router} from 'express';
import { registerVolunteer } from '../controllers/volunteer.controller.js';
import multer from 'multer';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerVolunteer
)


export default router; 