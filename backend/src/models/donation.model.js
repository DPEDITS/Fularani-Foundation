import mongoose, { Schema } from "mongoose";

const donationSchema = new Schema(
  {
    donorId: {
      type: Schema.Types.ObjectId,
      ref: "Donor",
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    anonymousName: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentGateway: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Refunded"],
      default: "Pending",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringInterval: {
      type: String,
      enum: ["Monthly", "Quarterly", "Yearly"],
    },
    recurringId: {
      type: String,
    },
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    receiptUrl: {
      type: String,
    },
    receiptGeneratedAt: {
      type: Date,
    },
    donatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Donation = mongoose.model("Donation", donationSchema);
