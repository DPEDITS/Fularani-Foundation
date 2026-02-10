import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        donorId: {
            type: Schema.Types.ObjectId,
            ref: "Donor",
            required: true,
        },
        razorpaySubscriptionId: {
            type: String, // Future use for real subscriptions
            required: false,
        },
        amount: {
            type: Number,
            required: true,
        },
        interval: {
            type: String,
            enum: ["monthly", "quarterly", "yearly"],
            default: "monthly",
        },
        status: {
            type: String,
            enum: ["active", "cancelled", "completed"],
            default: "active",
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        lastPaymentDate: {
            type: Date,
        },
        nextPaymentDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
