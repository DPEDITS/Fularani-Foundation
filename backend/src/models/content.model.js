import mongoose, { Schema } from "mongoose";

const contentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
    },
    images: {
      type: [String], 
    },
    coverImage: {
      type: String,
    },
    markdownFile: {
      type: String,
      required: true,
    },
    category: {
      type: String,
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
