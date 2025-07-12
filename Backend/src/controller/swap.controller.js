import SwapRequest from "../models/swapRequest.model.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

// Create a new swap request
const createSwapRequest = async (req, res) => {
    try {
        const { toUser, skillsOffered, skillsRequested } = req.body;
        const fromUser = req.user._id; // From auth middleware

        // Validate required fields
        if (!toUser || !skillsOffered || !skillsRequested) {
            return res.status(400).json({
                statusCode: 400,
                message: "toUser, skillsOffered, and skillsRequested are required"
            });
        }

        // Validate arrays are not empty
        if (!Array.isArray(skillsOffered) || skillsOffered.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: "skillsOffered must be a non-empty array"
            });
        }

        if (!Array.isArray(skillsRequested) || skillsRequested.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                message: "skillsRequested must be a non-empty array"
            });
        }

        // Check if toUser exists and is not the same as fromUser
        if (fromUser.toString() === toUser) {
            return res.status(400).json({
                statusCode: 400,
                message: "Cannot send swap request to yourself"
            });
        }

        const targetUser = await User.findById(toUser);
        if (!targetUser) {
            return res.status(404).json({
                statusCode: 404,
                message: "Target user not found"
            });
        }

        // Check if user is banned
        if (targetUser.isBanned) {
            return res.status(403).json({
                statusCode: 403,
                message: "Cannot send swap request to banned user"
            });
        }

        // Check if there's already a pending swap request between these users
        const existingSwap = await SwapRequest.findOne({
            $or: [
                { fromUser, toUser, status: "pending" },
                { fromUser: toUser, toUser: fromUser, status: "pending" }
            ]
        });

        if (existingSwap) {
            return res.status(409).json({
                statusCode: 409,
                message: "A pending swap request already exists between these users"
            });
        }

        // Create the swap request
        const swapRequest = await SwapRequest.create({
            fromUser,
            toUser,
            skillsOffered,
            skillsRequested,
            status: "pending"
        });

        // Populate user details for response
        const populatedSwapRequest = await SwapRequest.findById(swapRequest._id)
            .populate("fromUser", "username email")
            .populate("toUser", "username email");

        return res.status(201).json(
            new ApiResponse(201, populatedSwapRequest, "Swap request created successfully")
        );

    } catch (error) {
        console.error("Error creating swap request:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while creating swap request"
        });
    }
};

// Get current user's swap requests
const getSwapRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status } = req.query;

        let query = {
            $or: [
                { fromUser: userId },
                { toUser: userId }
            ]
        };

        // Filter by status if provided
        if (status && ["pending", "accepted", "rejected", "cancelled"].includes(status)) {
            query.status = status;
        }

        const swapRequests = await SwapRequest.find(query)
            .populate("fromUser", "username email")
            .populate("toUser", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, swapRequests, "Swap requests retrieved successfully")
        );

    } catch (error) {
        console.error("Error getting swap requests:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while retrieving swap requests"
        });
    }
};

// Accept a swap request
const acceptSwapRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const swapRequest = await SwapRequest.findById(id);

        if (!swapRequest) {
            return res.status(404).json({
                statusCode: 404,
                message: "Swap request not found"
            });
        }

        // Check if user is the recipient of the swap request
        if (swapRequest.toUser.toString() !== userId.toString()) {
            return res.status(403).json({
                statusCode: 403,
                message: "You can only accept swap requests sent to you"
            });
        }

        if (swapRequest.status !== "pending") {
            return res.status(400).json({
                statusCode: 400,
                message: "Can only accept pending swap requests"
            });
        }

        swapRequest.status = "accepted";
        await swapRequest.save();

        const populatedSwapRequest = await SwapRequest.findById(id)
            .populate("fromUser", "username email")
            .populate("toUser", "username email");

        return res.status(200).json(
            new ApiResponse(200, populatedSwapRequest, "Swap request accepted successfully")
        );

    } catch (error) {
        console.error("Error accepting swap request:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while accepting swap request"
        });
    }
};

// Reject a swap request
const rejectSwapRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const swapRequest = await SwapRequest.findById(id);

        if (!swapRequest) {
            return res.status(404).json({
                statusCode: 404,
                message: "Swap request not found"
            });
        }

        // Check if user is the recipient of the swap request
        if (swapRequest.toUser.toString() !== userId.toString()) {
            return res.status(403).json({
                statusCode: 403,
                message: "You can only reject swap requests sent to you"
            });
        }

        if (swapRequest.status !== "pending") {
            return res.status(400).json({
                statusCode: 400,
                message: "Can only reject pending swap requests"
            });
        }

        swapRequest.status = "rejected";
        await swapRequest.save();

        const populatedSwapRequest = await SwapRequest.findById(id)
            .populate("fromUser", "username email")
            .populate("toUser", "username email");

        return res.status(200).json(
            new ApiResponse(200, populatedSwapRequest, "Swap request rejected successfully")
        );

    } catch (error) {
        console.error("Error rejecting swap request:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while rejecting swap request"
        });
    }
};

// Cancel/delete a swap request
const cancelSwapRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const swapRequest = await SwapRequest.findById(id);

        if (!swapRequest) {
            return res.status(404).json({
                statusCode: 404,
                message: "Swap request not found"
            });
        }

        // Check if user is the sender of the swap request
        if (swapRequest.fromUser.toString() !== userId.toString()) {
            return res.status(403).json({
                statusCode: 403,
                message: "You can only cancel swap requests you sent"
            });
        }

        if (swapRequest.status !== "pending") {
            return res.status(400).json({
                statusCode: 400,
                message: "Can only cancel pending swap requests"
            });
        }

        await SwapRequest.findByIdAndDelete(id);

        return res.status(200).json(
            new ApiResponse(200, null, "Swap request cancelled successfully")
        );

    } catch (error) {
        console.error("Error cancelling swap request:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while cancelling swap request"
        });
    }
};

// Submit feedback after swap accepted
const submitFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        const swapRequest = await SwapRequest.findById(id);

        if (!swapRequest) {
            return res.status(404).json({
                statusCode: 404,
                message: "Swap request not found"
            });
        }

        // Check if user is part of the swap
        if (swapRequest.fromUser.toString() !== userId.toString() && 
            swapRequest.toUser.toString() !== userId.toString()) {
            return res.status(403).json({
                statusCode: 403,
                message: "You can only submit feedback for swaps you're involved in"
            });
        }

        if (swapRequest.status !== "accepted") {
            return res.status(400).json({
                statusCode: 400,
                message: "Can only submit feedback for accepted swaps"
            });
        }

        // Validate rating
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                statusCode: 400,
                message: "Rating must be between 1 and 5"
            });
        }

        swapRequest.feedback = {
            rating: rating || swapRequest.feedback?.rating,
            comment: comment || swapRequest.feedback?.comment
        };

        await swapRequest.save();

        const populatedSwapRequest = await SwapRequest.findById(id)
            .populate("fromUser", "username email")
            .populate("toUser", "username email");

        return res.status(200).json(
            new ApiResponse(200, populatedSwapRequest, "Feedback submitted successfully")
        );

    } catch (error) {
        console.error("Error submitting feedback:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while submitting feedback"
        });
    }
};

export {
    createSwapRequest,
    getSwapRequests,
    acceptSwapRequest,
    rejectSwapRequest,
    cancelSwapRequest,
    submitFeedback
}; 