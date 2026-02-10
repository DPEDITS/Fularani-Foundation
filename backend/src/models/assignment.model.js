import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema(
    {
        volunteerId: {
            type: Schema.Types.ObjectId,
            ref: "Volunteer",
            required: true,
        },
        missionId: {
            type: Schema.Types.ObjectId,
            ref: "Content",
            required: true,
        },
        taskTitle: {
            type: String,
            required: true,
            trim: true,
        },
        taskDescription: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["assigned", "in-progress", "completed", "verified"],
            default: "assigned",
        },
        assignedAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
        feedback: {
            type: String,
        }
    },
    { timestamps: true }
);

export const Assignment = mongoose.model("Assignment", assignmentSchema);
