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
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "unsafe-none" }, // Change to unsafe-none for debugging COOP issues
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'", "https://accounts.google.com", "https://pagead2.googlesyndication.com"],
        "frame-src": ["'self'", "https://accounts.google.com"],
        "connect-src": ["'self'", "https://api.fularanifoundation.org", "https://accounts.google.com"],
      },
    },
  })
);

// --- Specific route limiters only ---

// --- CORS setup ---
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://fularanifoundation.org",
  "https://kb.fularanifoundation.org",
  "https://fularanikb-c7hhn0k6i-fularanifoundation-7390s-projects.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      // Normalize origin for comparison (remove trailing slashes)
      const normalizedOrigin = origin.replace(/\/$/, "");
      const isAllowed = allowedOrigins.some(ao => ao?.replace(/\/$/, "") === normalizedOrigin);
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn("CORS Rejection - Origin:", origin, "Allowed:", allowedOrigins);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    preflightContinue: false,
    optionsSuccessStatus: 204
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