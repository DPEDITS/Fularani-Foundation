import mongoose, { Schema } from "mongoose";

const documentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Document = mongoose.model("Document", documentSchema);
