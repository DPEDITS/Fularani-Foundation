import { Router } from "express";
import { registerAdmin, loginAdmin, googleAuthAdmin, getAdminStats, getAllVolunteers, getAllDonors, getAllMissions, updateVolunteerStatus, assignTask, getAllDonations, updateAdminAvatar } from "../controllers/admin.controller.js";
import { verifyJWT, verifyAdmin, verifySuperAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const adminRouter = Router();

adminRouter.route("/register").post(
  verifyJWT,
  verifySuperAdmin,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerAdmin,
);

adminRouter.route("/login").post(loginAdmin);
adminRouter.route("/google-auth").post(googleAuthAdmin);
adminRouter.route("/stats").get(verifyJWT, verifyAdmin, getAdminStats);
adminRouter.route("/volunteers").get(verifyJWT, verifyAdmin, getAllVolunteers);
adminRouter.route("/donors").get(verifyJWT, verifyAdmin, getAllDonors);
adminRouter.route("/donations").get(verifyJWT, verifyAdmin, getAllDonations);
adminRouter.route("/missions").get(verifyJWT, verifyAdmin, getAllMissions);
adminRouter.route("/update-volunteer-status").post(verifyJWT, verifyAdmin, updateVolunteerStatus);
adminRouter.route("/assign-task").post(verifyJWT, verifyAdmin, assignTask);
adminRouter.route("/update-avatar").patch(verifyJWT, verifyAdmin, upload.single("avatar"), updateAdminAvatar);

export default adminRouter;
