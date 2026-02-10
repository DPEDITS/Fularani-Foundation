import Razorpay from "razorpay";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const checkout = asyncHandler(async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

  if (!process.env.RAZORPAY_API_KEY || process.env.RAZORPAY_API_KEY === "YOUR_RAZORPAY_KEY_ID") {
      throw new ApiError(500, "Razorpay API Keys are not configured");
  }

  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json(new ApiResponse(200, order, "Order created successfully"));
});

const paymentVerification = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  console.log("Payment Verification Request:", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature: razorpay_signature ? "received" : "missing",
  });

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    console.log("Missing required fields for verification");
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

  console.log("Signature comparison:", {
    expectedLength: expectedSignature.length,
    receivedLength: razorpay_signature.length,
    match: expectedSignature === razorpay_signature
  });

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    console.log("Payment verification successful for:", razorpay_payment_id);
      
    res.status(200).json(new ApiResponse(200, {
        reference: razorpay_payment_id
    }, "Payment verified successfully"));

  } else {
    console.log("Payment verification failed - signature mismatch");
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
