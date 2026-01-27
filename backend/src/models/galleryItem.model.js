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
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "Volunteer",
      required: true,
    },
  },
  { timestamps: true },
);

export const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
