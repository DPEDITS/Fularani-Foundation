import Razorpay from "razorpay";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";

const MIN_AMOUNT = 1;        // ₹1
const MAX_AMOUNT = 1000000;   // ₹10,00,000

const checkout = asyncHandler(async (req, res) => {
  if (!process.env.RAZORPAY_API_KEY || process.env.RAZORPAY_API_KEY === "YOUR_RAZORPAY_KEY_ID") {
    logger.error("RAZORPAY_API_KEY is missing from environment variables");
    throw new ApiError(500, "Razorpay API Keys are not configured properly in the backend .env file");
  }

  // Server-side amount validation
  const amount = Number(req.body.amount);
  if (!amount || !Number.isFinite(amount) || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
    logger.warn("Invalid checkout amount attempted:", req.body.amount);
    throw new ApiError(400, `Amount must be between ₹${MIN_AMOUNT} and ₹${MAX_AMOUNT.toLocaleString("en-IN")}`);
  }

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

  const options = {
    amount: Math.round(amount * 100), // Convert to paise, use Math.round to avoid float issues
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json(new ApiResponse(200, order, "Order created successfully"));
});

const paymentVerification = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  logger.debug("Payment Verification Request:", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature: razorpay_signature ? "received" : "missing",
  });

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    logger.warn("Missing required fields for payment verification");
    return res.status(400).json({
      success: false,
      message: "Missing required payment verification fields"
    });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  logger.debug("Signature comparison:", {
    expectedLength: expectedSignature.length,
    receivedLength: razorpay_signature.length,
    match: expectedSignature === razorpay_signature
  });

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    logger.info("Payment verification successful for:", razorpay_payment_id);

    res.status(200).json(new ApiResponse(200, {
      reference: razorpay_payment_id
    }, "Payment verified successfully"));

  } else {
    logger.warn("Payment verification failed - signature mismatch");
    res.status(400).json({
      success: false,
      message: "Invalid payment signature"
    });
  }
});

const getKey = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { key: process.env.RAZORPAY_API_KEY }, "Key fetched successfully"));
});

export { checkout, paymentVerification, getKey };

