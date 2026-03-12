import { asyncHandler } from "../utils/asyncHandler.js";
import { Volunteer } from "../models/volunteer.model.js";
import { Donor } from "../models/donor.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await Volunteer.findById(userId);
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
    const user = await Volunteer.findById(decodedToken?._id);
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

const registerVolunteer = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
    gender,
    phone,
    dateOfBirth,
    address,
    idType,
    panNumber,
    panVerified,
    panHolderName,
    skills,
    availabilityHours,
    preferredAreas,
    motivation,
  } = req.body;

  if (!username?.trim()) throw new ApiError(400, "Username is required");
  if (!email?.trim()) throw new ApiError(400, "Email is required");
  if (!password?.trim()) throw new ApiError(400, "Password is required");
  if (!gender?.trim()) throw new ApiError(400, "Gender is required");
  if (!phone?.trim()) throw new ApiError(400, "Phone number is required");
  if (!address?.trim()) throw new ApiError(400, "Address is required");
  if (!panNumber?.trim()) throw new ApiError(400, "PAN Number is required");

  // Normalize gender to lowercase for enum compatibility
  const normalizedGender = gender.toLowerCase();

  // Default idType to "PAN" if not provided
  const normalizedIdType = idType?.trim() || "PAN";

  // Improved skills validation and parsing
  let skillsArray = [];
  if (typeof req.body.skills === 'string') {
    skillsArray = req.body.skills.split(',').map(s => s.trim()).filter(Boolean);
  } else if (Array.isArray(req.body.skills)) {
    skillsArray = req.body.skills;
  }

  if (skillsArray.length === 0) {
    throw new ApiError(400, "Skills are required");
  }

  // Improved preferredAreas parsing
  let areasArray = [];
  if (typeof req.body.preferredAreas === 'string') {
    areasArray = req.body.preferredAreas.split(',').map(a => a.trim()).filter(Boolean);
  } else if (Array.isArray(req.body.preferredAreas)) {
    areasArray = req.body.preferredAreas;
  }

  if (!availabilityHours) throw new ApiError(400, "Availability hours are required");
  if (!dateOfBirth) throw new ApiError(400, "Date of birth is required");

  const existedUser = await Volunteer.findOne({
    $or: [
      { username }, 
      { email },
      { panNumber: new RegExp(`^${panNumber}$`, 'i') }
    ],
  });

  if (existedUser) {
    if (existedUser.panNumber && existedUser.panNumber.toLowerCase() === panNumber.toLowerCase()) {
      throw new ApiError(409, "PAN Number is already registered with another account");
    }
    throw new ApiError(409, "User with email or username already exists");
  }

  // Also prevent cross-role PAN sharing
  const existedDonor = await Donor.findOne({ panNumber: new RegExp(`^${panNumber}$`, 'i') });
  if (existedDonor) {
    throw new ApiError(409, "PAN Number is already registered to a donor account");
  }

  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required for volunteer registration");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar || !avatar.url) {
    throw new ApiError(400, "Error uploading avatar. Please try again.");
  }

  const avatarUrl = avatar.url;

  let parsedDateOfBirth = dateOfBirth;

  // Handle dd/mm/yyyy format from frontend
  const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  if (typeof dateOfBirth === "string") {
    const match = dateOfBirth.match(ddmmyyyyRegex);
    if (match) {
      const [_, day, month, year] = match;
      // Create date object: month is 0-indexed in JavaScript
      parsedDateOfBirth = new Date(year, month - 1, day);
    } else {
      // Try parsing as ISO format (fallback)
      parsedDateOfBirth = new Date(dateOfBirth);
    }
  }

  const user = await Volunteer.create({
    username: username.toLowerCase(),
    email,
    password: password, // Note: Schema handles hashing via pre-save hook
    avatar: avatarUrl,
    gender: normalizedGender,
    phone,
    dateOfBirth: parsedDateOfBirth,
    address,
    idType: normalizedIdType,
    panNumber,
    panVerified: panVerified === true || panVerified === "true",
    panHolderName: panHolderName || "",
    skills: skillsArray,
    availabilityHours,
    preferredAreas: areasArray,
    motivation,
  });
  const createdUser = await Volunteer.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

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
          user: createdUser,
          accessToken,
          refreshToken,
        },
        "User registered Successfully",
      ),
    );
});

const loginVolunteer = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const queryIdentifier = (email || username).trim();

  const user = await Volunteer.findOne({
    $or: [
      { username: queryIdentifier.toLowerCase() }, 
      { email: queryIdentifier.toLowerCase() }
    ],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id,
  );

  const loggedInUser = await Volunteer.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully",
      ),
    );
});

const getVolunteerProfile = asyncHandler(async (req, res) => {
  const volunteerId = req.user._id;

  const volunteer = await Volunteer.findById(volunteerId).select(
    "-password -refreshToken",
  );

  if (!volunteer) {
    throw new ApiError(404, "Volunteer not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, volunteer, "Volunteer profile fetched successfully"),
    );
});

const getVolunteerStats = asyncHandler(async (req, res) => {
  const volunteerId = req.user._id;

  const volunteer = await Volunteer.findById(volunteerId).select(
    "skills availabilityHours preferredAreas",
  );

  if (!volunteer) {
    throw new ApiError(404, "Volunteer not found");
  }

  const stats = {
    totalHours: parseInt(volunteer.availabilityHours) || 0,
    activeMissions: 0,
    completedMissions: 0,
    skillCount: volunteer.skills?.length || 0,
    impactScore: 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Volunteer stats fetched successfully"));
});

const forgotPasswordVolunteer = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Please provide your email address");
  }

  const user = await Volunteer.findOne({ email });

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
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}?role=volunteer`;

  const message = `
    <h1>Password Reset Requested</h1>
    <p>Hi ${user.username || 'User'},</p>
    <p>We received a request to reset your password for your Fularani Foundation volunteer account.</p>
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
    throw new ApiError(500, "There was an error sending the reset email. Please try again later.");
  }
});

const resetPasswordVolunteer = asyncHandler(async (req, res) => {
  // Hash token to compare with database
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await Volunteer.findOne({
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

// Google OAuth Authentication for Volunteers
const googleAuthVolunteer = asyncHandler(async (req, res) => {
  const { credential } = req.body;

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
    throw new ApiError(401, "Invalid Google credential");
  }

  const { sub: googleId, email, name, picture, email_verified } = payload;

  if (!email) {
    throw new ApiError(400, "Google account does not have an email");
  }

  // Check if user already exists with this SSO ID
  let existingVolunteer = await Volunteer.findOne({ ssoId: googleId });

  if (existingVolunteer) {
    // Existing Google user - just login
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(existingVolunteer._id);
    const loggedInUser = await Volunteer.findById(existingVolunteer._id).select("-password -refreshToken");

    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json(
        new ApiResponse(200, {
          user: loggedInUser,
          accessToken,
          refreshToken,
        }, "Logged in with Google successfully")
      );
  }

  // Check if a user exists with this email
  existingVolunteer = await Volunteer.findOne({ email: email.toLowerCase() });

  if (existingVolunteer) {
    // Link Google account to existing user
    existingVolunteer.ssoId = googleId;
    existingVolunteer.ssoProvider = "google";
    existingVolunteer.emailVerified = email_verified || false;
    if (!existingVolunteer.avatar && picture) {
      existingVolunteer.avatar = picture;
    }
    await existingVolunteer.save({ validateBeforeSave: false });

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(existingVolunteer._id);
    const loggedInUser = await Volunteer.findById(existingVolunteer._id).select("-password -refreshToken");

    return res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
      .json(
        new ApiResponse(200, {
          user: loggedInUser,
          accessToken,
          refreshToken,
        }, "Google account linked and logged in successfully")
      );
  }

  // New user — volunteer registration requires many fields
  // Return the Google profile info so the frontend can pre-fill the registration form
  return res
    .status(200)
    .json(
      new ApiResponse(200, {
        isNewUser: true,
        googleProfile: {
          googleId,
          name,
          email,
          picture,
          emailVerified: email_verified,
        },
      }, "New user — please complete volunteer registration")
    );
});

export {
  registerVolunteer,
  loginVolunteer,
  getVolunteerProfile,
  getVolunteerStats,
  refreshAccessToken,
  forgotPasswordVolunteer,
  resetPasswordVolunteer,
  googleAuthVolunteer
};
