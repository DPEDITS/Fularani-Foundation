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
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
    },
    coverImage: {
      type: String,
      required: true,
    },
    markdownFile: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["planning", "active", "completed", "onhold", "upcoming", "past"],
      default: "planning",
      required: true,
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
