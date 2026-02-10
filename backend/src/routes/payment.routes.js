import { Router } from "express";
import { checkout, paymentVerification, getKey } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/checkout").post(checkout);
router.route("/paymentverification").post(paymentVerification);
router.route("/getkey").get(getKey);

export default router;
