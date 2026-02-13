import { Router } from "express";
import { registerAdmin, loginAdmin, getAdminStats, getAllVolunteers, getAllDonors, getAllMissions, updateVolunteerStatus, assignTask, getAllDonations } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
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
adminRouter.route("/stats").get(verifyJWT, getAdminStats);
adminRouter.route("/volunteers").get(verifyJWT, getAllVolunteers);
adminRouter.route("/donors").get(verifyJWT, getAllDonors);
adminRouter.route("/donations").get(verifyJWT, getAllDonations);
adminRouter.route("/missions").get(verifyJWT, getAllMissions);
adminRouter.route("/update-volunteer-status").post(verifyJWT, updateVolunteerStatus);
adminRouter.route("/assign-task").post(verifyJWT, assignTask);

export default adminRouter;
