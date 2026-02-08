import { asyncHandler } from "../utils/asyncHandler.js";
import { Volunteer } from "../models/volunteer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
    skills,
    availabilityHours,
    preferredAreas,
    motivation,
  } = req.body;

  // Debug logs to see what's arriving
  console.log("Registration Request Body:", req.body);
  console.log("Registration Request Files:", req.files);

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
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.file?.path;
  console.log("Avatar local path:", avatarLocalPath);

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

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginVolunteer = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await Volunteer.findOne({
    $or: [{ username }, { email }],
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

export {
  registerVolunteer,
  loginVolunteer,
  getVolunteerProfile,
  getVolunteerStats,
  refreshAccessToken,
};
