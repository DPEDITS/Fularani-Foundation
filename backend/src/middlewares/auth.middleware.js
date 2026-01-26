import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Volunteer } from "../models/volunteer.model.js";
import { Donor } from "../models/donor.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Check both Volunteer and Donor models for the user
    let user = await Volunteer.findById(decodedToken?._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      user = await Donor.findById(decodedToken?._id).select(
        "-password -refreshToken",
      );
    }

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
