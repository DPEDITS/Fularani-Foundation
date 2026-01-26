import mongoose, { Schema } from "mongoose";

const galleryItemSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "Volunteer",
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
