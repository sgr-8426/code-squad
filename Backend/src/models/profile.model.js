import mongoose from "mongoose";
import validator from "validator";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User reference is required"],
    unique: true
  },
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"]
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [500, "Bio cannot exceed 500 characters"]
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, "Location cannot exceed 100 characters"]
  },
  skillsOffered: [{
    type: String,
    trim: true,
    maxlength: [30, "Each skill cannot exceed 30 characters"]
  }],
  skillsWanted: [{
    type: String,
    trim: true,
    maxlength: [30, "Each skill cannot exceed 30 characters"]
  }],
  availability: {
    type: String,
    enum: {
      values: ["weekdays", "weekends", "flexible"],
      message: "Availability must be weekdays, weekends, or flexible"
    },
    default: "flexible"
  },
  profileVisibility: {
    type: String,
    enum: {
      values: ["public", "private"],
      message: "Profile visibility must be public or private"
    },
    default: "public"
  },
  profilePhoto: {
    public_id: {
      type: String,
      required: [true, "Profile photo public_id is required"]
    },
    url: {
      type: String,
      required: [true, "Profile photo URL is required"]
    }
  },
  socialLinks: {
    website: {
      type: String,
      trim: true,
      validate: {
        validator: (url) => !url || validator.isURL(url, { protocols: ['http','https'], require_protocol: true }),
        message: "Invalid website URL"
      }
    },
    github: String,
    twitter: String,
    linkedin: {
      type: String,
      validate: {
        validator: (url) => !url || validator.isURL(url, { protocols: ['http','https'], require_protocol: true }),
        message: "Invalid LinkedIn URL"
      }
    }
  },
  isBanned: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Validate skills array lengths
profileSchema.pre('validate', function(next) {
  if (this.skillsOffered && this.skillsOffered.length > 10) {
    this.invalidate('skillsOffered', 'Cannot have more than 10 skills offered');
  }
  if (this.skillsWanted && this.skillsWanted.length > 10) {
    this.invalidate('skillsWanted', 'Cannot have more than 10 skills wanted');
  }
  next();
});

// Update user hasProfile field when profile is created
profileSchema.post('save', async function(doc) {
  try {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(doc.user, { hasProfile: true });
  } catch (error) {
    console.error('Error updating user hasProfile field:', error);
  }
});

// Update user hasProfile field when profile is deleted
profileSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      const User = mongoose.model('User');
      await User.findByIdAndUpdate(doc.user, { hasProfile: false });
    } catch (error) {
      console.error('Error updating user hasProfile field:', error);
    }
  }
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;