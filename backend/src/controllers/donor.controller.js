import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Donor } from "../models/donor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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

export { registerDonor, loginDonor };
