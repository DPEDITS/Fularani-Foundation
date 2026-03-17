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
        trim: true,
    },
    subject: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        trim: true,
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
