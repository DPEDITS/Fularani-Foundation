import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["PROJECT", "EVENT"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
    },
    fullDescription: {
      type: String,
    },
    images: {
      type: [String], // Array of Cloudinary URLs
    },
    coverImage: {
      type: String,
    },
    category: {
      type: String,
    },
    location: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    eventDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Planning", "Active", "Completed", "OnHold", "Upcoming", "Past"],
      default: "Planning",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export const Content = mongoose.model("Content", contentSchema);
