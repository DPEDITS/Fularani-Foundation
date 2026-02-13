import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Donor } from "../models/donor.model.js";
import { Donation } from "../models/donation.model.js";
import { Subscription } from "../models/subscription.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await Donor.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token",
    );
  }
};

const registerDonor = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
    phone,
    address,
    panNumber,
    wants80GReceipt,
  } = req.body;

  if (!username?.trim()) throw new ApiError(400, "Username is required");
  if (!email?.trim()) throw new ApiError(400, "Email is required");
  if (!password?.trim()) throw new ApiError(400, "Password is required");
  if (!panNumber?.trim()) throw new ApiError(400, "PAN Number is required");

  const existedDonor = await Donor.findOne({
    $or: [{ username }, { email }],
  });

  if (existedDonor) {
    throw new ApiError(409, "Donor with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  let avatar;

  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  }

  const donor = await Donor.create({
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar?.url || "",
    phone,
    address,
    panNumber,
    wants80GReceipt: wants80GReceipt || false,
  });

  const createdDonor = await Donor.findById(donor._id).select(
    "-password -refreshToken",
  );

  if (!createdDonor) {
    throw new ApiError(500, "Something went wrong while registering the donor");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(donor._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: createdDonor,
          accessToken,
          refreshToken,
        },
        "Donor registered Successfully",
      ),
    );
});

const loginDonor = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body
  console.log(email);

  if (!username && !email) {
    throw new ApiError(400, "username or email is required")
  }

  const user = await Donor.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiError(404, "User does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id)

  const loggedInUser = await Donor.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser, accessToken, refreshToken
        },
        "User logged In Successfully"
      )
    )
})

const logoutDonor = asyncHandler(async (req, res) => {
  await Donor.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    const user = await Donor.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getCurrentDonor = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current donor fetched successfully"))
})

const getDonorProfile = asyncHandler(async (req, res) => {
  const donorId = req.user._id;

  const donor = await Donor.findById(donorId).select("-password -refreshToken");

  if (!donor) {
    throw new ApiError(404, "Donor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, donor, "Donor profile fetched successfully"));
});

const getDonorDonations = asyncHandler(async (req, res) => {
  const donorId = req.user._id;

  const donations = await Donation.find({ donorId })
    .sort({ donatedAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, donations, "Donations fetched successfully"));
});

const getDonorStats = asyncHandler(async (req, res) => {
  const donorId = req.user._id;

  const donor = await Donor.findById(donorId).select("totalDonatedAmount donationCount");

  const donations = await Donation.find({ donorId });

  // Calculate additional stats
  const thisYearDonations = donations.filter(d => {
    const donationDate = new Date(d.donatedAt);
    return donationDate.getFullYear() === new Date().getFullYear();
  });

  const thisYearTotal = thisYearDonations.reduce((sum, d) => sum + d.amount, 0);

  const activeSubscriptions = await Subscription.find({ donorId, status: "active" });

  const calculatedTotal = donations.reduce((sum, d) => sum + d.amount, 0);

  const stats = {
    totalDonatedAmount: calculatedTotal,
    donationCount: donations.length,
    thisYearTotal,
    thisYearCount: thisYearDonations.length,
    recurringCount: activeSubscriptions.length,
    averageDonation: donations.length > 0
      ? Math.round(calculatedTotal / donations.length)
      : 0
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Donor stats fetched successfully"));
});

const updateDonorProfile = asyncHandler(async (req, res) => {
  const { username, phone, address, panNumber, wants80GReceipt } = req.body;

  const updateFields = {};
  if (username) {
    const newUsername = username.toLowerCase();
    // Only check if username is actually changing
    if (newUsername !== req.user.username) {
      const existingUser = await Donor.findOne({ username: newUsername });
      if (existingUser) {
        throw new ApiError(400, "Username already exists");
      }
      updateFields.username = newUsername;
    }
  }

  if (phone) updateFields.phone = phone;
  if (address) updateFields.address = address;
  if (wants80GReceipt !== undefined) updateFields.wants80GReceipt = wants80GReceipt;
  // Note: panNumber is removed from here to make it immutable after registration.

  const donor = await Donor.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!donor) {
    throw new ApiError(404, "Donor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, donor, "Profile updated successfully"));
});

const updateDonorAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const donor = await Donor.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, donor, "Avatar image updated successfully"));
});

const forgotPasswordDonor = asyncHandler(async (req, res) => {
  const { email, panNumber, newPassword } = req.body;

  if (!email || !panNumber || !newPassword) {
    throw new ApiError(400, "Email, PAN Number and New Password are required");
  }

  const user = await Donor.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User with this email does not exist");
  }

  if (user.panNumber.toUpperCase() !== panNumber.toUpperCase()) {
    throw new ApiError(401, "Invalid PAN Number for this account");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const getRecentDonors = asyncHandler(async (req, res) => {
  // Fetch recent donations with donor details
  const recentDonations = await Donation.find()
    .sort({ donatedAt: -1 })
    .populate({
      path: "donorId",
      select: "username avatar"
    })
    .limit(50); // Fetch more to ensure we find enough unique donors

  const uniqueDonors = [];
  const seenDonorIds = new Set();

  for (const donation of recentDonations) {
    if (uniqueDonors.length >= 4) break;

    // Check if donor exists and hasn't been added yet
    // Also skip if donor was deleted (donorId would be null) or avatar is missing/empty if that's a requirement
    // The previous code required avatar, so let's keep that preference but maybe relax it if we want names
    if (donation.donorId && !seenDonorIds.has(donation.donorId._id.toString())) {
      // Optional: Filter out if no avatar, or keep?
      // The prompt wants specific usernames. Let's assume valid donors.
      // If we strictly follow "avatar: { $exists: true, $ne: "" }" from before:
      if (donation.donorId.avatar) {
        seenDonorIds.add(donation.donorId._id.toString());
        uniqueDonors.push({
          _id: donation.donorId._id,
          username: donation.donorId.username,
          avatar: donation.donorId.avatar
        });
      }
    }
  }

  const totalDonors = await Donor.countDocuments();

  return res
    .status(200)
    .json(new ApiResponse(200, { donors: uniqueDonors, totalDonors }, "Recent donors fetched successfully"));
});

export {
  registerDonor,
  loginDonor,
  logoutDonor,
  refreshAccessToken,
  getCurrentDonor,
  getDonorProfile,
  getDonorDonations,
  getDonorStats,
  updateDonorProfile,
  updateDonorAvatar,
  forgotPasswordDonor,
  getRecentDonors
};
