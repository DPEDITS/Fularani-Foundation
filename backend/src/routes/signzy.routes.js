import { Router } from "express";
import rateLimit from "express-rate-limit";
import { verifyPANLite } from "../controllers/signzy.controller.js";

// Rate limiter for PAN verification (prevent abuse)
// NOTE: Set to 50 for dev/testing, reduce to 10-15 for production
const panVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50,                   // 50 verification attempts per 15 min per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many verification attempts — please try again later" },
});

const signzyRouter = Router();

// POST /api/signzy/verify-pan
// Public route — no auth required (used during registration & forgot password)
signzyRouter.route("/verify-pan").post(panVerifyLimiter, verifyPANLite);

export default signzyRouter;
