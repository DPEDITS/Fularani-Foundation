import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Donor } from "../models/donor.model.js";
import { Donation } from "../models/donation.model.js";
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

  if (
    [username, email, password, panNumber].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

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

  return res
    .status(201)
    .json(new ApiResponse(200, createdDonor, "Donor registered Successfully"));
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

  const recurringDonations = donations.filter(d => d.isRecurring);

  const stats = {
    totalDonatedAmount: donor?.totalDonatedAmount || 0,
    donationCount: donor?.donationCount || donations.length,
    thisYearTotal,
    thisYearCount: thisYearDonations.length,
    recurringCount: recurringDonations.length,
    averageDonation: donations.length > 0
      ? Math.round(donations.reduce((sum, d) => sum + d.amount, 0) / donations.length)
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
  updateDonorAvatar
};
