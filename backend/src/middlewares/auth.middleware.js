import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Volunteer } from "../models/volunteer.model.js";
import { Donor } from "../models/donor.model.js";
import { Admin } from "../models/admin.model.js";
import logger from "../utils/logger.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");


    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }


    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    let user = await Volunteer.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      user = await Donor.findById(decodedToken?._id).select(
        "-password -refreshToken",
      );
    }

    if (!user) {
      user = await Admin.findById(decodedToken?._id).select(
        "-password -refreshToken",
      );
    }

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error("JWT Verification Error:", error);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const verifyAdmin = asyncHandler(async (req, _, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
    throw new ApiError(403, "Forbidden: Admin access required");
  }

  next();
});

export const verifySuperAdmin = asyncHandler(async (req, _, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized: User not found");
  }

  if (req.user.role !== "SUPER_ADMIN") {
    throw new ApiError(403, "Forbidden: Super Admin access required");
  }

  next();
});
