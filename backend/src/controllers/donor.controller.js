import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Donor } from "../models/donor.model.js";
import { Volunteer } from "../models/volunteer.model.js";
import { Donation } from "../models/donation.model.js";
import { Subscription } from "../models/subscription.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";

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
    panVerified,
    panHolderName,
    wants80GReceipt,
  } = req.body;

  if (!username?.trim()) throw new ApiError(400, "Username is required");
  if (!email?.trim()) throw new ApiError(400, "Email is required");
  if (!password?.trim()) throw new ApiError(400, "Password is required");
  if (!panNumber?.trim()) throw new ApiError(400, "PAN Number is required");

  const existedDonor = await Donor.findOne({
    $or: [
      { username },
      { email },
      { panNumber: new RegExp(`^${panNumber}$`, 'i') }
    ],
  });

  if (existedDonor) {
    if (existedDonor.panNumber && existedDonor.panNumber.toLowerCase() === panNumber.toLowerCase()) {
      throw new ApiError(409, "PAN Number is already registered with another donor account");
    }
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
    avatar: avatar?.secure_url || "",
    phone,
    address,
    panNumber,
    panVerified: panVerified === true || panVerified === "true",
    panHolderName: panHolderName || "",
    wants80GReceipt: wants80GReceipt !== undefined ? wants80GReceipt === true || wants80GReceipt === "true" : true,
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

  if (!username && !email) {
    throw new ApiError(400, "username or email is required")
  }

  const queryIdentifier = (email || username).trim();

  const user = await Donor.findOne({
    $or: [
      { username: queryIdentifier.toLowerCase() },
      { email: queryIdentifier.toLowerCase() }
    ]
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

  // Allow updating panNumber ONLY if it's currently PENDING or missing
  if (panNumber && (!req.user.panNumber || req.user.panNumber === "PENDING")) {
    const trimmedPan = panNumber.trim().toUpperCase();

    // Basic PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(trimmedPan)) {
      throw new ApiError(400, "Invalid PAN format. Expected: ABCDE1234F");
    }

    // Uniqueness check
    const existingPanDonor = await Donor.findOne({
      panNumber: new RegExp(`^${trimmedPan}$`, 'i'),
      _id: { $ne: req.user._id }
    });
    if (existingPanDonor) {
      throw new ApiError(409, "PAN Number is already registered with another donor account");
    }

    const existingPanVolunteer = await Volunteer.findOne({ panNumber: new RegExp(`^${trimmedPan}$`, 'i') });
    if (existingPanVolunteer) {
      throw new ApiError(409, "PAN Number is already registered to a volunteer account");
    }

    updateFields.panNumber = trimmedPan;
    updateFields.panVerified = true;
  }

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

  if (!avatar.secure_url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const donor = await Donor.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.secure_url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, donor, "Avatar image updated successfully"));
});

const forgotPasswordDonor = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Please provide your email address");
  }

  const user = await Donor.findOne({ email });

  if (!user) {
    // Return generic success to prevent email enumeration
    return res.status(200).json(
      new ApiResponse(200, {}, "If an account with that email exists, we have sent a password reset link.")
    );
  }

  // Get reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset url based on where the request came from
  const frontendUrl = req.headers.origin || process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}?role=donor`;

  const message = `
    <h1>Password Reset Requested</h1>
    <p>Hi ${user.username || 'User'},</p>
    <p>We received a request to reset your password for your Fularani Foundation donor account.</p>
    <p>Please click on the link below to set a new password. This link is only valid for 15 minutes.</p>
    <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;margin:20px 0;">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Fularani Foundation - Password Reset",
      html: message,
    });

    res.status(200).json(
      new ApiResponse(200, {}, "If an account with that email exists, we have sent a password reset link.")
    );
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    console.error("Email send error:", error);
    throw new ApiError(500, `Email send error: ${error.message}`);
  }
});

const resetPasswordDonor = asyncHandler(async (req, res) => {
  // Hash token to compare with database
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await Donor.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Password reset token is invalid or has expired");
  }

  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    throw new ApiError(400, "New Password is required and must be at least 6 characters");
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, {}, "Password reset successfully. You can now login."));
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

    if (donation.donorId && !seenDonorIds.has(donation.donorId._id.toString())) {
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

// Google OAuth Authentication for Donors
const googleAuthDonor = asyncHandler(async (req, res) => {
  const { credential, panNumber, panVerified, panHolderName } = req.body;

  if (!credential) {
    throw new ApiError(400, "Google credential is required");
  }

  // Verify Google token
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (error) {
    console.error("Google verifyIdToken error (Donor):", error);
    throw new ApiError(401, "Invalid Google credential: " + error.message);
  }

  const { sub: googleId, email, name, picture, email_verified } = payload;

  if (!email) {
    throw new ApiError(400, "Google account does not have an email");
  }

  // Check if user already exists with this Google ID
  let existingDonor = await Donor.findOne({ googleId });

  if (existingDonor) {
    // Existing Google user - just login
    console.log("Existing Google user found, logging in:", email);
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(existingDonor._id);
    const loggedInUser = await Donor.findById(existingDonor._id).select("-password -refreshToken");

    const needsPan = !existingDonor.panNumber || !existingDonor.panVerified;

    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json(
        new ApiResponse(200, {
          user: loggedInUser,
          accessToken,
          refreshToken,
          needsPanVerification: needsPan,
        }, "Logged in with Google successfully")
      );
  }

  // Check if a user exists with this email (regular signup)
  existingDonor = await Donor.findOne({ email: email.toLowerCase() });

  if (existingDonor) {
    // Link Google account to existing user
    console.log("Existing email found, linking Google account:", email);
    existingDonor.googleId = googleId;
    existingDonor.ssoProvider = "google";
    if (!existingDonor.avatar && picture) {
      existingDonor.avatar = picture;
    }
    await existingDonor.save({ validateBeforeSave: false });

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(existingDonor._id);
    const loggedInUser = await Donor.findById(existingDonor._id).select("-password -refreshToken");

    const needsPan = !existingDonor.panNumber || !existingDonor.panVerified;

    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json(
        new ApiResponse(200, {
          user: loggedInUser,
          accessToken,
          refreshToken,
          needsPanVerification: needsPan,
        }, "Google account linked and logged in successfully")
      );
  }

  // New user - Google Sign Up
  // Generate a unique username from Google name
  let baseUsername = (name || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9]/g, "");
  let username = baseUsername;
  let counter = 1;
  while (await Donor.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  // If PAN details are provided (completing registration), create full account
  if (panNumber && panVerified === true) {
    // Check if PAN already registered
    const existingPan = await Donor.findOne({ panNumber: new RegExp(`^${panNumber}$`, 'i') });
    if (existingPan) {
      throw new ApiError(409, "PAN Number is already registered with another donor account");
    }


    const newDonor = await Donor.create({
      username,
      email: email.toLowerCase(),
      avatar: picture || "",
      googleId,
      ssoProvider: "google",
      panNumber,
      panVerified: true,
      panHolderName: panHolderName || name || "",
    });

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(newDonor._id);
    const createdDonor = await Donor.findById(newDonor._id).select("-password -refreshToken");

    return res
      .status(201)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json(
        new ApiResponse(201, {
          user: createdDonor,
          accessToken,
          refreshToken,
          needsPanVerification: false,
        }, "Donor registered with Google successfully")
      );
  }

  // New user - Google Sign Up
  // Return the Google profile info so the frontend can pre-fill the registration form
  // We do NOT create any account here until PAN is verified and submitted
  console.log("New Google user detected (no tokens sent):", email);
  return res
    .status(200)
    .json(
      new ApiResponse(200, {
        isNewUser: true,
        googleProfile: {
          googleId,
          name,
          email: email.toLowerCase(),
          picture,
        },
      }, "New user — please complete registration including PAN verification")
    );
});

// Complete PAN verification for Google-signed-up donors
const completePanVerification = asyncHandler(async (req, res) => {
  const { panNumber, panVerified, panHolderName, username } = req.body;
  const userId = req.user._id;

  if (!panNumber?.trim()) {
    throw new ApiError(400, "PAN Number is required");
  }

  // Check if PAN already registered
  const existingPanDonor = await Donor.findOne({
    panNumber: new RegExp(`^${panNumber}$`, 'i'),
    _id: { $ne: userId },
  });
  if (existingPanDonor) {
    throw new ApiError(409, "PAN Number is already registered with another donor account");
  }



  const updateFields = {
    panNumber,
    panVerified: panVerified === true || panVerified === "true",
    panHolderName: panHolderName || "",
  };

  // Allow updating username if provided (from Google name validation)
  if (username?.trim()) {
    const newUsername = username.trim().toLowerCase();
    const existingUsername = await Donor.findOne({ username: newUsername, _id: { $ne: userId } });
    if (existingUsername) {
      throw new ApiError(409, "Username already taken");
    }
    updateFields.username = newUsername;
  }

  const donor = await Donor.findByIdAndUpdate(
    userId,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!donor) {
    throw new ApiError(404, "Donor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, donor, "PAN verification completed successfully"));
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
  resetPasswordDonor,
  getRecentDonors,
  googleAuthDonor,
  completePanVerification
};
