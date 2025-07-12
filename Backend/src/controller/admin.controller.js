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
}; import User from '../models/user.model.js';
import Profile from '../models/profile.model.js';

const getAllUsers = async (req, res) => {
  try {
    // Extract query parameters for pagination and filtering
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      status,
      role 
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (role) filter.role = role;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get users with pagination and sorting
    const users = await User.find(filter)
      .select('-password -__v') // Exclude sensitive fields
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('profile', 'firstName lastName avatar') // Populate related profile data
      .lean();

    // Get total count for pagination metadata
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching users',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, duration, banType = 'temporary' } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Ban reason is required'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent banning admin users (optional security check)
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot ban admin users'
      });
    }

    // Check if user is already banned
    if (user.status === 'banned') {
      return res.status(400).json({
        success: false,
        message: 'User is already banned'
      });
    }

    // Calculate ban expiration date
    let banExpiresAt = null;
    if (banType === 'temporary' && duration) {
      banExpiresAt = new Date();
      banExpiresAt.setTime(banExpiresAt.getTime() + (duration * 24 * 60 * 60 * 1000)); // duration in days
    }

    // Update user with ban information
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        status: 'banned',
        banInfo: {
          reason,
          bannedBy: req.user.id, // Assuming req.user contains the admin's info
          bannedAt: new Date(),
          banType,
          expiresAt: banExpiresAt
        }
      },
      { new: true, select: '-password -__v' }
    );

    // Log the ban action (optional)
    console.log(`User ${userId} banned by ${req.user.id} for: ${reason}`);

    res.status(200).json({
      success: true,
      message: 'User banned successfully',
      data: {
        user: updatedUser,
        banInfo: updatedUser.banInfo
      }
    });

  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while banning user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const banProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { reason, hideContent = true } = req.body;

    // Validate required fields
    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Profile ID is required'
      });
    }

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Ban reason is required'
      });
    }

    // Check if profile exists
    const profile = await Profile.findById(profileId).populate('user', 'status role');
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Check if profile is already banned
    if (profile.status === 'banned') {
      return res.status(400).json({
        success: false,
        message: 'Profile is already banned'
      });
    }

    // Prevent banning admin profiles (optional security check)
    if (profile.user && profile.user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot ban admin profiles'
      });
    }

    // Update profile with ban information
    const updatedProfile = await Profile.findByIdAndUpdate(
      profileId,
      {
        status: 'banned',
        banInfo: {
          reason,
          bannedBy: req.user.id,
          bannedAt: new Date(),
          hideContent
        },
        // Hide profile content if requested
        ...(hideContent && {
          isVisible: false,
          posts: [], // Clear posts if needed
          bio: '[Content hidden due to policy violation]'
        })
      },
      { new: true }
    );

    // Optionally also update the associated user status
    if (profile.user) {
      await User.findByIdAndUpdate(profile.user._id, {
        status: 'restricted' // or 'banned' depending on your policy
      });
    }

    // Log the profile ban action
    console.log(`Profile ${profileId} banned by ${req.user.id} for: ${reason}`);

    res.status(200).json({
      success: true,
      message: 'Profile banned successfully',
      data: {
        profile: updatedProfile,
        banInfo: updatedProfile.banInfo
      }
    });

  } catch (error) {
    console.error('Error banning profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while banning profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export { getAllUsers, banUser, banProfile };