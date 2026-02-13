import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: "Volunteer",
            default: null,
        },
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin", // Assuming you have an Admin model, otherwise adjust as needed
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed"],
            default: "Pending",
        },
        proofOfWork: {
            images: [
                {
                    url: { type: String, required: true },
                    uploadedAt: { type: Date, default: Date.now },
                },
            ],
            description: {
                type: String,
                trim: true,
            },
        },
        relatedDonation: {
            type: Schema.Types.ObjectId,
            ref: "Donation",
            default: null
        },
        mission: {
            type: Schema.Types.ObjectId,
            ref: "Content",
            default: null
        }
    },
    { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
