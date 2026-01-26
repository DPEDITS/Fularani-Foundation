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
        trim: true
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    avatar: {
      type: String, // cloudinary url
    },
    password : {
        type : String,
        required : [true, "Password is required"]
    },
    refreshToken: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    idType: {
      type: String,
      required: true,
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
      required: true,
    },
    availabilityHours: {
      type: Number,
      required: true,
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
