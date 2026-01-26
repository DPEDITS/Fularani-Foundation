import mongoose, { Schema } from "mongoose";

const contentPageSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    contentHtml: {
      type: String,
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "Volunteer",
    },
  },
  { timestamps: true },
);

export const ContentPage = mongoose.model("ContentPage", contentPageSchema);
