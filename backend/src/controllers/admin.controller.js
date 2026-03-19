import { asyncHandler } from "../utils/asyncHandler.js";
import { OAuth2Client } from "google-auth-library";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.model.js";
import { Donor } from "../models/donor.model.js";
import { Volunteer } from "../models/volunteer.model.js";
import { Donation } from "../models/donation.model.js";
import { Content } from "../models/content.model.js";
import { Assignment } from "../models/assignment.model.js";

const registerAdmin = asyncHandler(async (req, res) => {
  const { username, password, email, role, phone } = req.body;
  const avatar = req.files?.avatar?.[0]?.path;

  if (!username || !password || !email || !role || !phone) {
    throw new ApiError(400, "All fields are required");
  }

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  if (role !== "ADMIN") {
    throw new ApiError(400, "Only ADMIN role can be registered. SUPER_ADMIN is reserved.");
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
        avatar: avatar
    });

    const createdAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering the admin");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdAdmin, "Admin registered successfully"));
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
    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { admin: loggedInAdmin, accessToken, refreshToken }, "Admin logged in successfully"));
});

const getAdminStats = asyncHandler(async (req, res) => {
  const totalDonors = await Donor.countDocuments();
  const totalVolunteers = await Volunteer.countDocuments();

  const donationsResult = await Donation.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const totalFunds = donationsResult[0]?.total || 0;

  const activeMissions = await Content.countDocuments({
    type: "MISSION",
    status: "active",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalDonors,
        totalVolunteers,
        totalFunds,
        activeMissions,
      },
      "Admin stats fetched successfully",
    ),
  );
});

const getAllVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await Volunteer.find()
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, volunteers, "Volunteers fetched successfully"));
});

const getAllDonors = asyncHandler(async (req, res) => {
  const donors = await Donor.find()
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, donors, "Donors fetched successfully"));
});

const getAllMissions = asyncHandler(async (req, res) => {
  const missions = await Content.find({ type: "MISSION" }).sort({ title: 1 });
  return res
    .status(200)
    .json(new ApiResponse(200, missions, "Missions fetched successfully"));
});

const updateVolunteerStatus = asyncHandler(async (req, res) => {
  const { volunteerId, status } = req.body;

  if (!volunteerId || !status) {
    throw new ApiError(400, "Volunteer ID and status are required");
  }

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const volunteer = await Volunteer.findById(volunteerId);
  if (!volunteer) {
    throw new ApiError(404, "Volunteer not found");
  }

  volunteer.status = status;
  if (status === "Approved") {
    volunteer.approvedAt = new Date();
  }

  await volunteer.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, volunteer, `Volunteer status updated to ${status}`),
    );
});

const assignTask = asyncHandler(async (req, res) => {
  const { volunteerId, missionId, taskTitle, taskDescription } = req.body;

  if (!volunteerId || !missionId || !taskTitle || !taskDescription) {
    throw new ApiError(400, "All fields are required for assignment");
  }

  const volunteer = await Volunteer.findById(volunteerId);
  if (!volunteer) throw new ApiError(404, "Volunteer not found");

  const mission = await Content.findById(missionId);
  if (!mission || mission.type !== "MISSION") {
    throw new ApiError(404, "Mission not found");
  }

  const assignment = await Assignment.create({
    volunteerId,
    missionId,
    taskTitle,
    taskDescription,
    status: "assigned",
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        assignment,
        "Task assigned successfully to volunteer",
      ),
    );
});

const getAllDonations = asyncHandler(async (req, res) => {
    const donations = await Donation.find()
        .populate("donorId", "username email fullName")
        .sort({ donatedAt: -1 });
    return res.status(200).json(new ApiResponse(200, donations, "Donations fetched successfully"));
});

const googleAuthAdmin = asyncHandler(async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        throw new ApiError(400, "Google credential is required");
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let payload;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
    } catch (error) {
        throw new ApiError(401, "Invalid Google credential: " + error.message);
    }

    const { email } = payload;

    if (!email) {
        throw new ApiError(400, "Google account does not have an email");
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
        throw new ApiError(404, "Admin account not found for this email address. Please contact the super admin.");
    }

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { admin: loggedInAdmin, accessToken, refreshToken }, "Admin logged in with Google successfully"));
});

export { 
    registerAdmin, 
    loginAdmin, 
    googleAuthAdmin,
    getAdminStats, 
    getAllVolunteers, 
    getAllDonors, 
    getAllMissions, 
    updateVolunteerStatus, 
    assignTask, 
    getAllDonations 
};
