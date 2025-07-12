import User from "../models/user.model.js";
import SwapRequest from "../models/swapRequest.model.js";
import FlaggedSkill from "../models/flaggedSkill.model.js";
import BroadcastMessage from "../models/broadcastMessage.model.js";
import ApiResponse from "../utils/ApiResponse.js";

// Get all flagged skills
const getFlaggedSkills = async (req, res) => {
    try {
        const { status } = req.query;
        
        let query = {};
        if (status && ["pending", "approved", "rejected"].includes(status)) {
            query.status = status;
        }

        const flaggedSkills = await FlaggedSkill.find(query)
            .populate("userId", "username email")
            .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, flaggedSkills, "Flagged skills retrieved successfully")
        );

    } catch (error) {
        console.error("Error getting flagged skills:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while retrieving flagged skills"
        });
    }
};

// Approve or reject flagged skill
const updateFlaggedSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                statusCode: 400,
                message: "Status must be either 'approved' or 'rejected'"
            });
        }

        const flaggedSkill = await FlaggedSkill.findById(id);
        if (!flaggedSkill) {
            return res.status(404).json({
                statusCode: 404,
                message: "Flagged skill not found"
            });
        }

        flaggedSkill.status = status;
        await flaggedSkill.save();

        const populatedFlaggedSkill = await FlaggedSkill.findById(id)
            .populate("userId", "username email");

        return res.status(200).json(
            new ApiResponse(200, populatedFlaggedSkill, `Flagged skill ${status} successfully`)
        );

    } catch (error) {
        console.error("Error updating flagged skill:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while updating flagged skill"
        });
    }
};

// Ban/unban a user
const toggleUserBan = async (req, res) => {
    try {
        const { id } = req.params;
        const { isBanned } = req.body;

        if (typeof isBanned !== 'boolean') {
            return res.status(400).json({
                statusCode: 400,
                message: "isBanned must be a boolean value"
            });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "User not found"
            });
        }

        // Prevent banning admin users
        if (user.role === 'admin') {
            return res.status(403).json({
                statusCode: 403,
                message: "Cannot ban admin users"
            });
        }

        user.isBanned = isBanned;
        await user.save();

        const userResponse = await User.findById(id).select("-password -refreshToken");

        return res.status(200).json(
            new ApiResponse(200, userResponse, `User ${isBanned ? 'banned' : 'unbanned'} successfully`)
        );

    } catch (error) {
        console.error("Error toggling user ban:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while updating user ban status"
        });
    }
};

// Generate user activity report (CSV format)
const generateActivityReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const users = await User.find(query).select("username email role isBanned createdAt");
        
        // Convert to CSV format
        const csvHeader = "Username,Email,Role,Is Banned,Created At\n";
        const csvData = users.map(user => 
            `${user.username},${user.email},${user.role},${user.isBanned},${user.createdAt}`
        ).join('\n');
        
        const csvContent = csvHeader + csvData;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="user-activity-report.csv"');
        
        return res.status(200).send(csvContent);

    } catch (error) {
        console.error("Error generating activity report:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while generating activity report"
        });
    }
};

// Generate feedback report (CSV format)
const generateFeedbackReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let query = {
            status: "accepted",
            "feedback.rating": { $exists: true }
        };
        
        if (startDate && endDate) {
            query.updatedAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const swapRequests = await SwapRequest.find(query)
            .populate("fromUser", "username email")
            .populate("toUser", "username email");

        // Convert to CSV format
        const csvHeader = "From User,To User,Skills Offered,Skills Requested,Rating,Comment,Updated At\n";
        const csvData = swapRequests.map(swap => 
            `"${swap.fromUser.username}","${swap.toUser.username}","${swap.skillsOffered.join(';')}","${swap.skillsRequested.join(';')}",${swap.feedback.rating},"${swap.feedback.comment || ''}","${swap.updatedAt}"`
        ).join('\n');
        
        const csvContent = csvHeader + csvData;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="feedback-report.csv"');
        
        return res.status(200).send(csvContent);

    } catch (error) {
        console.error("Error generating feedback report:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while generating feedback report"
        });
    }
};

// Generate swap statistics report (CSV format)
const generateSwapReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const swapRequests = await SwapRequest.find(query)
            .populate("fromUser", "username")
            .populate("toUser", "username");

        // Aggregate statistics
        const totalSwaps = swapRequests.length;
        const pendingSwaps = swapRequests.filter(swap => swap.status === "pending").length;
        const acceptedSwaps = swapRequests.filter(swap => swap.status === "accepted").length;
        const rejectedSwaps = swapRequests.filter(swap => swap.status === "rejected").length;
        const cancelledSwaps = swapRequests.filter(swap => swap.status === "cancelled").length;
        const completedSwaps = swapRequests.filter(swap => swap.status === "completed").length;

        // Convert to CSV format
        const csvHeader = "Total Swaps,Pending,Accepted,Rejected,Cancelled,Completed\n";
        const csvData = `${totalSwaps},${pendingSwaps},${acceptedSwaps},${rejectedSwaps},${cancelledSwaps},${completedSwaps}`;
        
        const csvContent = csvHeader + csvData;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="swap-statistics-report.csv"');
        
        return res.status(200).send(csvContent);

    } catch (error) {
        console.error("Error generating swap report:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while generating swap report"
        });
    }
};

// Send platform-wide broadcast message
const sendBroadcastMessage = async (req, res) => {
    try {
        const { title, content } = req.body;
        const sentBy = req.user._id;

        if (!title || !content) {
            return res.status(400).json({
                statusCode: 400,
                message: "Title and content are required"
            });
        }

        const broadcastMessage = await BroadcastMessage.create({
            title,
            content,
            sentBy
        });

        const populatedMessage = await BroadcastMessage.findById(broadcastMessage._id)
            .populate("sentBy", "username");

        return res.status(201).json(
            new ApiResponse(201, populatedMessage, "Broadcast message sent successfully")
        );

    } catch (error) {
        console.error("Error sending broadcast message:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while sending broadcast message"
        });
    }
};

// Get all broadcast messages
const getBroadcastMessages = async (req, res) => {
    try {
        const broadcastMessages = await BroadcastMessage.find()
            .populate("sentBy", "username")
            .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(200, broadcastMessages, "Broadcast messages retrieved successfully")
        );

    } catch (error) {
        console.error("Error getting broadcast messages:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while retrieving broadcast messages"
        });
    }
};

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ role: "admin" });
        const bannedUsers = await User.countDocuments({ isBanned: true });
        const totalSwaps = await SwapRequest.countDocuments();
        const pendingSwaps = await SwapRequest.countDocuments({ status: "pending" });
        const acceptedSwaps = await SwapRequest.countDocuments({ status: "accepted" });
        const pendingFlaggedSkills = await FlaggedSkill.countDocuments({ status: "pending" });

        const stats = {
            totalUsers,
            totalAdmins,
            bannedUsers,
            totalSwaps,
            pendingSwaps,
            acceptedSwaps,
            pendingFlaggedSkills
        };

        return res.status(200).json(
            new ApiResponse(200, stats, "Dashboard statistics retrieved successfully")
        );

    } catch (error) {
        console.error("Error getting dashboard stats:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Something went wrong while retrieving dashboard statistics"
        });
    }
};

export {
    getFlaggedSkills,
    updateFlaggedSkill,
    toggleUserBan,
    generateActivityReport,
    generateFeedbackReport,
    generateSwapReport,
    sendBroadcastMessage,
    getBroadcastMessages,
    getDashboardStats
}; 