import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    skillsOffered: {
        type: [String],
        required: true
    },
    skillsRequested: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "cancelled"],
        default: "pending"
    },
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: {
            type: String
        }
    }
}, { timestamps: true });

// Index for better query performance
swapRequestSchema.index({ fromUser: 1, toUser: 1 });
swapRequestSchema.index({ status: 1 });

const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);

export default SwapRequest; 