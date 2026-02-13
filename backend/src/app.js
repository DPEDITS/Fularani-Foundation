import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "./utils/logger.js";

const app = express();

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
  max: 10,                   // 10 payment attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Payment rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many payment attempts — please try again later" });
  },
});

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://fularani-foundation-1.onrender.com"
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
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import volunteerRouter from "./routes/volunteer.routes.js"
import donorRouter from "./routes/donor.routes.js"
import contactRouter from "./routes/contact.routes.js"
import galleryRouter from "./routes/gallery.routes.js";
import donationRouter from "./routes/donation.routes.js";
import contentRouter from "./routes/content.routes.js";
import adminRouter from "./routes/admin.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import projectRouter from "./routes/project.routes.js";

//routes declaration
app.use("/api/volunteers", volunteerRouter)
app.use("/api/donor", donorRouter)
app.use("/api/v1/contact", contactRouter)
app.use("/api/gallery", galleryRouter)
app.use("/api/donations", paymentLimiter, donationRouter)
app.use("/api/content", contentRouter)
app.use("/api/admin", adminRouter)
<<<<<<< HEAD
app.use("/api/payment", paymentRouter)
app.use("/api/projects", projectRouter)
=======
app.use("/api/payment", paymentLimiter, paymentRouter)
>>>>>>> origin/Dutta

// error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || [];

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    data: null,
  });
});

export { app };
