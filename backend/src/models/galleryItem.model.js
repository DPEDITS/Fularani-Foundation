import mongoose, { Schema } from "mongoose";

const galleryItemSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

export const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
