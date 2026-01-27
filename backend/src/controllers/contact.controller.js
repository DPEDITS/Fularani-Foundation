import { ContactMessage } from "../models/contact.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create new contact message
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email || !phone || !subject || !message) {
        throw new ApiError(400, "All fields are required");
    }

    // Create contact message
    const contactMessage = await ContactMessage.create({
        name,
        email,
        phone,
        subject,
        message
    });

    if (!contactMessage) {
        throw new ApiError(500, "Failed to save contact message");
    }

    // TODO: Send email notification here
    // You can use nodemailer or similar service
    // await sendEmailNotification(contactMessage);

    return res
        .status(201)
        .json(new ApiResponse(201, contactMessage, "Message sent successfully"));
});

// Get all contact messages (Admin only)
const getAllContacts = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    const query = status ? { status } : {};

    const contacts = await ContactMessage.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const count = await ContactMessage.countDocuments(query);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            contacts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        }, "Contacts retrieved successfully"));
});

// Update contact status (Admin only)
const updateContactStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "responded", "archived"].includes(status)) {
        throw new ApiError(400, "Invalid status value");
    }

    const contact = await ContactMessage.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    if (!contact) {
        throw new ApiError(404, "Contact message not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, contact, "Status updated successfully"));
});

// Get single contact by ID (Admin only)
const getContactById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const contact = await ContactMessage.findById(id);

    if (!contact) {
        throw new ApiError(404, "Contact message not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, contact, "Contact retrieved successfully"));
});

// Delete contact message (Admin only)
const deleteContact = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const contact = await ContactMessage.findByIdAndDelete(id);

    if (!contact) {
        throw new ApiError(404, "Contact message not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Contact message deleted successfully"));
});

export {
    createContact,
    getAllContacts,
    updateContactStatus,
    getContactById,
    deleteContact
};
