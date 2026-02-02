import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.model.js";

const registerAdmin = asyncHandler(async (req, res) => {
    const { username, password, email, role, phone } = req.body;
    const avatar = req.files?.avatar?.[0]?.path;

    if (!username || !password || !email || !role || !phone) {
        throw new ApiError(400, "All fields are required");
    }

    if (!avatar) {
        throw new ApiError(400, "Avatar is required");
    }

    if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
        throw new ApiError(400, "Invalid role");
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        throw new ApiError(400, "Admin already exists");
    }

    const admin = await Admin.create({
        username,
        password,
        email,
        role,
        phone,
        avatar: avatar?.url,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, admin, "Admin registered successfully"));
});


const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
        throw new ApiError(404, "Admin not found");
    }
    const isPasswordCorrect = await admin.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid password");
    }
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(new ApiResponse(200, { admin, accessToken, refreshToken }, "Admin logged in successfully"));
});

export { registerAdmin, loginAdmin };
