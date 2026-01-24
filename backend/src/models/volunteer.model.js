import mongoose, { Schema } from "mongoose";

const volunteerSchema = new Schema(
  {
    ssoProvider: {
      type: String,
    },
    ssoId: {
      type: String,
      unique: true,
      sparse: true, // Allow null values to not conflict
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
    },
    password: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    gender: {
      type: String,
    },
    phone: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      type: String,
    },
    idType: {
      type: String,
    },
    idNumberEncrypted: {
      type: String,
    },
    idDocumentUrl: {
      type: String,
    },
    motivation: {
      type: String,
    },
    skills: {
      type: [String],
    },
    availabilityHours: {
      type: Number,
    },
    preferredAreas: {
      type: [String],
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    aiScore: {
      type: Number,
    },
    aiRecommendation: {
      type: String,
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Volunteer = mongoose.model("Volunteer", volunteerSchema);
