import mongoose, { Schema } from "mongoose";

const contactMessageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const ContactMessage = mongoose.model(
  "ContactMessage",
  contactMessageSchema,
);
