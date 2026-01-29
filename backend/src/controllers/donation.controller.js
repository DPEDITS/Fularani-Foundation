import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Donation } from "../models/donation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createDonation = asyncHandler(async (req, res) => {
  const {
    donorId,
    amount,
    currency,
    paymentGateway,
    paymentId,
    isRecurring,
    recurringInterval,
    recurringId,
    receiptNumber,
    receiptUrl,
    receiptGeneratedAt,
    donatedAt,
  } = req.body;

  if (
    !donorId ||
    !amount ||
    !currency ||
    !paymentGateway ||
    !paymentId ||
    !isRecurring ||
    !recurringInterval ||
    !recurringId ||
    !receiptNumber ||
    !receiptUrl ||
    !receiptGeneratedAt ||
    !donatedAt
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const donation = await Donation.create({
    donorId,
    amount,
    currency,
    paymentGateway,
    paymentId,
    isRecurring,
    recurringInterval: recurringInterval.toLowerCase(),
    recurringId,
    receiptNumber,
    receiptUrl,
    receiptGeneratedAt,
    donatedAt,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, donation, "Donation created successfully"));
});

export { createDonation };
