import { ContactMessage } from "../models/contact.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";

// Create new contact message
const createContact = asyncHandler(async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    // Validation
    if (!name || !email) {
        throw new ApiError(400, "Name and Email are required");
    }

    // Create contact message
    const contactMessage = await ContactMessage.create({
        name,
        email,
        phone,
        subject: subject || "No Subject",
        message: message || "No Message"
    });

    if (!contactMessage) {
        throw new ApiError(500, "Failed to save contact message");
    }

    // Send email notification to Admin
    try {
        await sendEmail({
            email: process.env.EMAIL_USERNAME, // Admin email
            subject: `New Inquiry: ${subject || "Contact Form"} from ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #0071e3;">New Contact Form Submission</h2>
                    <p><strong>From:</strong> ${name} (${email})</p>
                    <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
                    <p><strong>Subject:</strong> ${subject || "N/A"}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p><strong>Message:</strong></p>
                    <p style="background: #f5f5f7; padding: 15px; rounded: 10px;">${message || "N/A"}</p>
                </div>
            `,
        });
    } catch (error) {
        console.error("Email notification failed:", error);
        // We don't throw error here to not block the response since message is saved in DB
    }

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
