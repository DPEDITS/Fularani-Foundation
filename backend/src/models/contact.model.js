import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
        minlength: [10, "Phone number must be at least 10 digits"]
    },
    subject: {
        type: String,
        required: [true, "Subject is required"],
        trim: true,
        minlength: [4, "Subject must be at least 4 characters long"]
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        trim: true,
        minlength: [10, "Message must be at least 10 characters long"]
    },
    status: {
        type: String,
        enum: ["pending", "responded", "archived"],
        default: "pending"
    }
}, {
    timestamps: true
});

// Index for faster queries
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ status: 1 });

export const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);
