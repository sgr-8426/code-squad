import User from '../models/user.model.js';
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