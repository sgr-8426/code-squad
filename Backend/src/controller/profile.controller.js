import  Profile  from "../models/profile.model.js";
import User from "../models/user.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { validateProfileData, validateBase64Image } from "../utils/profilevalidation.js";
import ApiResponse from "../utils/ApiResponse.js";

// Create Profile
const createProfile = async (req, res) => {
  try {
    const { name, bio, location, skillsOffered, availability, skillsWanted, profilePhoto, socialLinks } = req.body;
    const userId = req.user._id;

    // Check if user already has a profile
    const existingProfile = await Profile.findOne({ user: userId });
    if (existingProfile) {
      return res.status(400).json({
        statusCode: 400,
        message: "User already has a profile"
      });
    }

    // Validate profile photo
    if (!profilePhoto) {
      return res.status(400).json({
        statusCode: 400,
        message: "Profile photo is required"
      });
    }

    const imageValidationError = validateBase64Image(profilePhoto);
    if (imageValidationError) {
      return res.status(400).json({
        statusCode: 400,
        message: imageValidationError
      });
    }

    // Process skills arrays
    const processedSkillsOffered = skillsOffered 
      ? (Array.isArray(skillsOffered) ? skillsOffered : skillsOffered.split(',').map(skill => skill.trim()))
      : [];
    
    const processedSkillsWanted = skillsWanted 
      ? (Array.isArray(skillsWanted) ? skillsWanted : skillsWanted.split(',').map(skill => skill.trim()))
      : [];

    // Validate profile data
    const profileData = {
      name,
      bio,
      location,
      skillsOffered: processedSkillsOffered,
      availability,
      skillsWanted: processedSkillsWanted,
      socialLinks
    };

    const validationErrors = validateProfileData(profileData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(profilePhoto);
    if (!cloudinaryResult) {
      return res.status(500).json({
        statusCode: 500,
        message: "Failed to upload profile photo"
      });
    }

    // Create profile
    const profile = await Profile.create({
      user: userId,
      name: name.trim(),
      bio: bio?.trim(),
      location: location?.trim(),
      skillsOffered: processedSkillsOffered,
      availability: availability || "flexible",
      skillsWanted: processedSkillsWanted,
      profilePhoto: {
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url
      },
      socialLinks: socialLinks || {}
    });

    // Populate user data
    await profile.populate('user', 'username email');

    return res.status(201).json(
      new ApiResponse(201, profile, "Profile created successfully")
    );

  } catch (error) {
    console.error("Error creating profile:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        statusCode: 400,
        message: "Validation failed",
        errors: messages
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong while updating profile"
    });
  }
};

// Delete Profile
const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid profile ID format"
      });
    }

    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({
        statusCode: 404,
        message: "Profile not found"
      });
    }

    // Verify ownership
    if (profile.user.toString() !== userId.toString()) {
      return res.status(403).json({
        statusCode: 403,
        message: "Unauthorized to delete this profile"
      });
    }

    // Delete photo from Cloudinary
    if (profile.profilePhoto?.public_id) {
      await deleteFromCloudinary(profile.profilePhoto.public_id);
    }

    await Profile.findByIdAndDelete(id);

    return res.status(200).json(
      new ApiResponse(200, null, "Profile deleted successfully")
    );

  } catch (error) {
    console.error("Error deleting profile:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong while deleting profile"
    });
  }
};

export { 
  createProfile, 
  getPublicProfiles, 
  getProfileById, 
  getCurrentUserProfile,
  updateProfile, 
  deleteProfile 
};

const getPublicProfiles = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      skills, 
      location, 
      availability,
      search 
    } = req.query;
    
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { 
      profileVisibility: 'public',
      isBanned: false
    };

    // Add skill filter
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      filter.skillsOffered = { $in: skillsArray };
    }

    // Add location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Add availability filter
    if (availability && ['weekdays', 'weekends', 'flexible'].includes(availability)) {
      filter.availability = availability;
    }

    // Add search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { skillsOffered: { $in: [new RegExp(search, 'i')] } },
        { skillsWanted: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const profiles = await Profile.find(filter)
      .select('-__v')
      .populate('user', 'username email')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalProfiles = await Profile.countDocuments(filter);

    return res.status(200).json(
      new ApiResponse(200, {
        profiles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalProfiles / limit),
          totalProfiles,
          hasNext: page * limit < totalProfiles,
          hasPrev: page > 1
        }
      }, "Public profiles fetched successfully")
    );

  } catch (error) {
    console.error("Error fetching public profiles:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong while fetching profiles"
    });
  }
};

// Get Profile by ID
const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid profile ID format"
      });
    }

    const profile = await Profile.findById(id)
      .select('-__v')
      .populate('user', 'username email');

    if (!profile) {
      return res.status(404).json({
        statusCode: 404,
        message: "Profile not found"
      });
    }

    if (profile.isBanned) {
      return res.status(403).json({
        statusCode: 403,
        message: "Profile is banned"
      });
    }

    return res.status(200).json(
      new ApiResponse(200, profile, "Profile fetched successfully")
    );

  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong while fetching profile"
    });
  }
};

// Get Current User Profile
const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await Profile.findOne({ user: userId })
      .select('-__v')
      .populate('user', 'username email');

    if (!profile) {
      return res.status(404).json({
        statusCode: 404,
        message: "Profile not found"
      });
    }

    return res.status(200).json(
      new ApiResponse(200, profile, "Profile fetched successfully")
    );

  } catch (error) {
    console.error("Error fetching current user profile:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong while fetching profile"
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { name, bio, location, skillsOffered, availability, skillsWanted, profilePhoto, socialLinks, profileVisibility } = req.body;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid profile ID format"
      });
    }

    // Find the profile
    const profile = await Profile.findById(id);
    if (!profile) {
      return res.status(404).json({
        statusCode: 404,
        message: "Profile not found"
      });
    }

    // Verify ownership
    if (profile.user.toString() !== userId.toString()) {
      return res.status(403).json({
        statusCode: 403,
        message: "Unauthorized to update this profile"
      });
    }

    // Process update data
    const updateData = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (bio !== undefined) updateData.bio = bio?.trim();
    if (location !== undefined) updateData.location = location?.trim();
    if (availability !== undefined) updateData.availability = availability;
    if (profileVisibility !== undefined) updateData.profileVisibility = profileVisibility;
    if (socialLinks !== undefined) updateData.socialLinks = socialLinks;
    
    if (skillsOffered !== undefined) {
      updateData.skillsOffered = Array.isArray(skillsOffered) 
        ? skillsOffered 
        : skillsOffered.split(',').map(skill => skill.trim());
    }
    
    if (skillsWanted !== undefined) {
      updateData.skillsWanted = Array.isArray(skillsWanted) 
        ? skillsWanted 
        : skillsWanted.split(',').map(skill => skill.trim());
    }

    // Validate update data
    const validationErrors = validateProfileData(updateData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    // Handle new photo upload if provided
    if (profilePhoto) {
      const imageValidationError = validateBase64Image(profilePhoto);
      if (imageValidationError) {
        return res.status(400).json({
          statusCode: 400,
          message: imageValidationError
        });
      }

      // Delete old photo from Cloudinary
      if (profile.profilePhoto?.public_id) {
        await deleteFromCloudinary(profile.profilePhoto.public_id);
      }

      // Upload new photo
      const cloudinaryResult = await uploadToCloudinary(profilePhoto);
      if (!cloudinaryResult) {
        return res.status(500).json({
          statusCode: 500,
          message: "Failed to upload new profile photo"
        });
      }

      updateData.profilePhoto = {
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.secure_url
      };
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      id, 
      updateData, 
      { 
        new: true,
        runValidators: true 
      }
    ).populate('user', 'username email');

    return res.status(200).json(
      new ApiResponse(200, updatedProfile, "Profile updated successfully")
    );

  } catch (error) {
    console.error("Error updating profile:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        statusCode: 400,
        message: "Validation failed",
        errors: messages
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong while updating profile"
    });
  }
}