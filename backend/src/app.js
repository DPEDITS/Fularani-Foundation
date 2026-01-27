import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import volunteerRouter from "./routes/volunteer.routes.js"
import donorRouter from "./routes/donor.routes.js"
import contactRouter from "./routes/contact.routes.js"

//routes declaration
app.use("/api/volunteers", volunteerRouter)
app.use("/api/donor", donorRouter)
app.use("/api/v1/contact", contactRouter)

export { app };
