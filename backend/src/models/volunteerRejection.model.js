import mongoose, { Schema } from "mongoose";

const volunteerRejectionSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    ssoId: {
      type: String,
    },
    rejectionCount: {
      type: Number,
      default: 1,
    },
    lastRejectedAt: {
      type: Date,
      default: Date.now,
    },
    reapplyAllowedAfter: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const VolunteerRejection = mongoose.model(
  "VolunteerRejection",
  volunteerRejectionSchema,
);
