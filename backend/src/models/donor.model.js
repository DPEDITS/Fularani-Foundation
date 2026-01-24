import mongoose, { Schema } from "mongoose";

const donorSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
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
    },
    donationCount: {
      type: Number,
      default: 0,
    },
    panNumber: {
      type: String,
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
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Donor = mongoose.model("Donor", donorSchema);
