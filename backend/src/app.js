import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import logger from "./utils/logger.js";

const app = express();

// --- Trust proxy (for correct IP behind Nginx/Cloudflare) ---
app.set("trust proxy", 1);

// --- Security headers ---
app.use(helmet());

// --- Rate limiting ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many requests — please try again later" });
  },
});
app.use(globalLimiter);

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Payment rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many payment attempts — please try again later" });
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many attempts — please try again later" });
  },
});

// --- CORS setup ---
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://kb.fularanifoundation.org",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn("Origin not allowed by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// --- Sanitization & Compression ---
app.use(mongoSanitize());
app.use(compression());

// --- Static Files & Cookies ---
app.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.includes("temp/")) {
        res.set("Cache-Control", "no-store");
      }
    },
  })
);
app.use(cookieParser());

// --- Admin redirect logic ---
app.use((req, res, next) => {
  const adminEmail = "debashishparida75@gmail.com";
  if (req.body?.email === adminEmail || req.query?.email === adminEmail) {
    logger.info(`Admin access for email: ${adminEmail}`);
    return res.redirect("/admin-dashboard");
  }
  next();
});

// --- Routes import ---
import volunteerRouter from "./routes/volunteer.routes.js";
import donorRouter from "./routes/donor.routes.js";
import contactRouter from "./routes/contact.routes.js";
import galleryRouter from "./routes/gallery.routes.js";
import donationRouter from "./routes/donation.routes.js";
import contentRouter from "./routes/content.routes.js";
import adminRouter from "./routes/admin.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import projectRouter from "./routes/project.routes.js";
import signzyRouter from "./routes/signzy.routes.js";

// --- Routes declaration ---
app.use("/api/volunteers", volunteerRouter);
app.use("/api/donor", donorRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/donations", paymentLimiter, donationRouter);
app.use("/api/content", contentRouter);
app.use("/api/admin", authLimiter, adminRouter);
app.use("/api/payment", paymentLimiter, paymentRouter);
app.use("/api/projects", projectRouter);
app.use("/api/signzy", signzyRouter);

// --- Error handler ---
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];
  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    data: null,
    stack: isProduction ? undefined : err.stack,
  });
});

export { app };