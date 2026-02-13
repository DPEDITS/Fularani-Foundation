import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Donation } from "../models/donation.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Donor } from "../models/donor.model.js";
import { Subscription } from "../models/subscription.model.js";

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
    isRecurring === undefined ||
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

  // Manage Subscription Entry
  if (isRecurring) {
    const nextPaymentDate = new Date(donatedAt);
    if (recurringInterval.toLowerCase() === "monthly") nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    else if (recurringInterval.toLowerCase() === "quarterly") nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
    else if (recurringInterval.toLowerCase() === "yearly") nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);

    await Subscription.findOneAndUpdate(
      { donorId, status: "active", interval: recurringInterval.toLowerCase() },
      {
        donorId,
        amount,
        interval: recurringInterval.toLowerCase(),
        status: "active",
        lastPaymentDate: donatedAt,
        nextPaymentDate: nextPaymentDate,
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
  const subscription = await Subscription.findByIdAndUpdate(
    subscriptionId,
    { status: "cancelled" },
    { new: true }
  );
  if (!subscription) throw new ApiError(404, "Subscription not found");
  return res.status(200).json(new ApiResponse(200, subscription, "Subscription cancelled successfully"));
});

const getDonorDonationsWithProjects = asyncHandler(async (req, res) => {
  const donorId = req.user._id;
  const donations = await Donation.find({ donorId })
    .populate({
      path: "project",
      populate: {
        path: "assignedTo",
        select: "username email"
      }
    })
    .sort({ donatedAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, donations, "Donations with projects fetched successfully"));
});

export { createDonation, getActiveSubscriptions, cancelSubscription, getDonorDonationsWithProjects };
