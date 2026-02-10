import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
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
        console.log("Origin not allowed by CORS:", origin);
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

//routes declaration
app.use("/api/volunteers", volunteerRouter)
app.use("/api/donor", donorRouter)
app.use("/api/v1/contact", contactRouter)
app.use("/api/gallery", galleryRouter)
app.use("/api/donations", donationRouter)
app.use("/api/content", contentRouter)
app.use("/api/admin", adminRouter)
app.use("/api/payment", paymentRouter)

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
