import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Donation } from "../models/donation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Donor } from "../models/donor.model.js";
import { Subscription } from "../models/subscription.model.js";
import logger from "../utils/logger.js";

/**
 * Generate a secure, unique receipt number.
 * Format: FF-<timestamp>-<random 6 chars>
 */
const generateReceiptNumber = () => {
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `FF-${Date.now()}-${rand}`;
};

/**
 * Verify that a Razorpay payment is authentic using HMAC signature.
 * This is the same check as payment.controller.js but used here to
 * ensure the donation record is only created for verified payments.
 */
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
};

const createDonation = asyncHandler(async (req, res) => {
  const {
    amount,
    currency,
    paymentGateway,
    paymentId,
    razorpay_order_id,
    razorpay_signature,
    isRecurring,
    recurringInterval,
  } = req.body;

  // Use authenticated user's ID — never trust client-supplied donorId
  const donorId = req.user._id;

  // --- Input validation ---
  if (!amount || !paymentId || !paymentGateway) {
    throw new ApiError(400, "amount, paymentId, and paymentGateway are required");
  }

  if (!razorpay_order_id || !razorpay_signature) {
    throw new ApiError(400, "Razorpay order ID and signature are required for verification");
  }

  // --- Server-side payment signature verification ---
  const isAuthentic = verifyPaymentSignature(razorpay_order_id, paymentId, razorpay_signature);
  if (!isAuthentic) {
    logger.warn("Donation rejected — invalid Razorpay signature for paymentId:", paymentId);
    throw new ApiError(400, "Payment verification failed — invalid signature");
  }

  // --- Idempotency: check if this paymentId was already recorded ---
  const existingDonation = await Donation.findOne({ paymentId });
  if (existingDonation) {
    logger.info("Duplicate donation attempt for paymentId:", paymentId);
    return res.status(200).json(
      new ApiResponse(200, existingDonation, "Donation already recorded for this payment")
    );
  }

  // --- Server-generated receipt ---
  const receiptNumber = generateReceiptNumber();

  const donation = await Donation.create({
    donorId,
    amount,
    currency: currency || "INR",
    paymentGateway,
    paymentId,
    isRecurring: isRecurring || false,
    recurringInterval: (recurringInterval || "once").toLowerCase(),
    recurringId: isRecurring ? `rec_${crypto.randomBytes(5).toString("hex")}` : "na",
    receiptNumber,
    receiptUrl: "",
    receiptGeneratedAt: new Date(),
    donatedAt: new Date(),
  });

  // Manage Subscription Entry
  if (isRecurring) {
    const nextPaymentDate = new Date();
    const interval = (recurringInterval || "monthly").toLowerCase();
    if (interval === "monthly") nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    else if (interval === "quarterly") nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
    else if (interval === "yearly") nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);

    await Subscription.findOneAndUpdate(
      { donorId, status: "active", interval },
      {
        donorId,
        amount,
        interval,
        status: "active",
        lastPaymentDate: new Date(),
        nextPaymentDate,
      },
      { upsert: true, new: true }
    );
  }

  await Donor.findByIdAndUpdate(donorId, {
    $inc: {
      totalDonatedAmount: amount,
      donationCount: 1,
    }
  });

  logger.info(`Donation ₹${amount} recorded for donor ${donorId}, receipt: ${receiptNumber}`);

  return res
    .status(201)
    .json(new ApiResponse(201, donation, "Donation created successfully"));
});

const getActiveSubscriptions = asyncHandler(async (req, res) => {
  const donorId = req.user._id;
  const subscriptions = await Subscription.find({ donorId, status: "active" });
  return res.status(200).json(new ApiResponse(200, subscriptions, "Active subscriptions fetched successfully"));
});

const cancelSubscription = asyncHandler(async (req, res) => {
  const { subscriptionId } = req.params;
  const donorId = req.user._id;

  // Ownership check: only the subscription owner can cancel
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new ApiError(404, "Subscription not found");

  if (subscription.donorId.toString() !== donorId.toString()) {
    logger.warn(`Unauthorized subscription cancellation attempt: donor ${donorId} tried to cancel subscription ${subscriptionId}`);
    throw new ApiError(403, "You are not authorized to cancel this subscription");
  }

  subscription.status = "cancelled";
  await subscription.save();

  return res.status(200).json(new ApiResponse(200, subscription, "Subscription cancelled successfully"));
});

export { createDonation, getActiveSubscriptions, cancelSubscription };

