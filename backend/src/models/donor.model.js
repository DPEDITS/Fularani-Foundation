import mongoose, { Schema } from "mongoose";

const donorSchema = new Schema(
  {
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
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
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    totalDonatedAmount: {
      type: Number,
      default: 0,
      required : [true, "Total donated amount is required"]
    },
    donationCount: {
      type: Number,
      default: 0,
    },
    panNumber: {
      type: String,
      required : [true, "Pan number is required"]
    },
    wants80GReceipt: {
      type: Boolean,
      default: false,
    },
    hasActiveRecurringDonation: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export const Donor = mongoose.model("Donor", donorSchema);
