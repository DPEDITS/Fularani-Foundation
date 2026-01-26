import { asyncHandler } from "../utils/asyncHandler.js";
import { Volunteer } from "../models/volunteer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
    skills,
    availabilityHours,
    preferredAreas,
    motivation,
  } = req.body;

  if (
    [username, email, password, gender, phone, address, idType].some(
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

  let parsedDateOfBirth = dateOfBirth;
  const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  if (typeof dateOfBirth === "string") {
    const match = dateOfBirth.match(ddmmyyyyRegex);
    if (match) {
      const [_, day, month, year] = match;
      parsedDateOfBirth = new Date(year, month - 1, day);
    }
  }
  //?.url || ""
  const user = await Volunteer.create({
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar?.url,
    gender,
    phone,
    dateOfBirth: parsedDateOfBirth,
    address,
    idType,
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

export { registerVolunteer };
