import mongoose from "mongoose";

const broadcastMessageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

// Index for better query performance
broadcastMessageSchema.index({ sentBy: 1 });
broadcastMessageSchema.index({ createdAt: -1 });

const BroadcastMessage = mongoose.model("BroadcastMessage", broadcastMessageSchema);

export default BroadcastMessage; 