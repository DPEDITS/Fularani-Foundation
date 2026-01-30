import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["MISSION", "EVENT"],
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
      type: [String], 
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
      enum: ["planning", "active", "completed", "onhold", "upcoming", "past"],
      default: "planning",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Volunteer",
    },
  },
  { timestamps: true },
);

export const Content = mongoose.model("Content", contentSchema);
