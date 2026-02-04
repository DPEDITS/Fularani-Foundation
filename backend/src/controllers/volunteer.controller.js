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

  if (
    [username, email, password, gender, phone, address, idType, panNumber].some(
      (field) => field?.trim() === "",
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!skills || !availabilityHours || !dateOfBirth) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await Volunteer.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  let avatar;

  if (avatarLocalPath) {
    avatar = await uploadOnCloudinary(avatarLocalPath);
  }
  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  

  const user = await Volunteer.create({
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar?.url,
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
