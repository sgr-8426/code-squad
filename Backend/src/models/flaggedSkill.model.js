import mongoose from "mongoose";

const flaggedSkillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

// Index for better query performance
flaggedSkillSchema.index({ userId: 1 });
flaggedSkillSchema.index({ status: 1 });
flaggedSkillSchema.index({ skill: 1 });

const FlaggedSkill = mongoose.model("FlaggedSkill", flaggedSkillSchema);

export default FlaggedSkill; 