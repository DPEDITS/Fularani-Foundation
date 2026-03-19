import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import logger from "./utils/logger.js";

const app = express();

// --- Trust proxy (for correct IP behind Nginx/Cloudflare) ---
app.set("trust proxy", 1);

// --- Security headers ---
app.use(helmet());

// --- Specific route limiters only ---

// --- CORS setup ---
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://kb.fularanifoundation.org",
  "https://fularanikb-c7hhn0k6i-fularanifoundation-7390s-projects.vercel.app",
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
  const adminEmails = [
    "debashishparida75@gmail.com",
    "abhijeetduttaam2222@gmail.com"
  ];
  const queryEmail = req.body?.email || req.query?.email;
  if (queryEmail && adminEmails.includes(queryEmail)) {
    logger.info(`Admin access for email: ${queryEmail}`);
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
import documentRouter from "./routes/document.routes.js";

// --- Routes declaration ---
app.use("/api/volunteers", volunteerRouter);
app.use("/api/donor", donorRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/gallery", galleryRouter);
app.use("/api/donations", donationRouter);
app.use("/api/content", contentRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/projects", projectRouter);
app.use("/api/signzy", signzyRouter);
app.use("/api/documents", documentRouter);


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