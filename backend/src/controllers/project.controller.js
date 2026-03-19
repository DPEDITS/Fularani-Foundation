import { Project } from "../models/project.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Volunteer } from "../models/volunteer.model.js";

// Create a new project (Admin Only)
const createProject = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, mission } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description is required");
    }

    const project = await Project.create({
        title,
        description,
        assignedTo: assignedTo || null,
        assignedBy: req.user._id, // Auto-set from authenticated admin
        mission: mission || null,
        status: "Pending",
    });

    return res
        .status(201)
        .json(new ApiResponse(201, project, "Project created successfully"));
});

// Assign a project to a volunteer (Admin Only)
const assignProject = asyncHandler(async (req, res) => {
    const { projectId, volunteerId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Verify volunteer exists
    const volunteer = await Volunteer.findById(volunteerId); // Adjust model if different
    if (!volunteer) {
        throw new ApiError(404, "Volunteer not found");
    }

    project.assignedTo = volunteerId;
    project.status = "In Progress";
    await project.save();

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project assigned successfully"));
});

// Volunteer submits proof of work
const submitProofOfWork = asyncHandler(async (req, res) => {
    const { projectId, description } = req.body;
    const files = req.files; // Assuming multer handles file uploads

    if (!files || files.length === 0) {
        throw new ApiError(400, "Please upload at least one image");
    }

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    // Ensure project is assigned and volunteer is the assigned person
    if (!project.assignedTo) {
        throw new ApiError(400, "This project has not been assigned to any volunteer yet");
    }

    if (project.assignedTo.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to submit work for this project");
    }

    const uploadedImages = [];
    for (const file of files) {
        const result = await uploadOnCloudinary(file.path);
        if (result?.secure_url) {
            uploadedImages.push({ url: result.secure_url });
        }
    }

    project.proofOfWork = {
        images: uploadedImages,
        description: description || "",
    };
    project.status = "Completed";
    await project.save();

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Proof of work submitted successfully"));
});

// Link a donation to a project (Admin Only)
const linkDonationToProject = asyncHandler(async (req, res) => {
    const { projectId, donationId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const { Donation } = await import("../models/donation.model.js");
    const donation = await Donation.findById(donationId);
    if (!donation) {
        throw new ApiError(404, "Donation not found");
    }

    project.relatedDonation = donationId;
    await project.save();

    donation.project = projectId;
    await donation.save();

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Donation linked to project successfully"));
});

// Get all projects (Admin view)
const getAllProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find()
        .populate("assignedTo", "username email")
        .populate("relatedDonation")
        .populate("mission", "title type");

    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Projects fetched successfully"));
});

// Get projects assigned to the logged-in volunteer
const getVolunteerProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ assignedTo: req.user._id });
    return res
        .status(200)
        .json(new ApiResponse(200, projects, "Your projects fetched successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id).populate("assignedTo", "username email");

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, project, "Project fetched successfully"));
})

export {
    createProject,
    assignProject,
    submitProofOfWork,
    getAllProjects,
    getVolunteerProjects,
    getProjectById,
    linkDonationToProject
};
