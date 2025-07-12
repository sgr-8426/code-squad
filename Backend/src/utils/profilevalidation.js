import validator from 'validator';

const validateProfileData = (profileData) => {
  const errors = [];

  // Name validation
  if (profileData.name !== undefined) {
    if (!profileData.name || profileData.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }
    if (profileData.name && profileData.name.trim().length > 50) {
      errors.push("Name cannot exceed 50 characters");
    }
  }

  // Bio validation
  if (profileData.bio !== undefined && profileData.bio) {
    if (profileData.bio.trim().length > 500) {
      errors.push("Bio cannot exceed 500 characters");
    }
  }

  // Location validation
  if (profileData.location !== undefined && profileData.location) {
    if (profileData.location.trim().length > 100) {
      errors.push("Location cannot exceed 100 characters");
    }
  }

  // Skills validation
  if (profileData.skillsOffered !== undefined) {
    if (!Array.isArray(profileData.skillsOffered)) {
      errors.push("Skills offered must be an array");
    } else {
      if (profileData.skillsOffered.length > 10) {
        errors.push("Cannot have more than 10 skills offered");
      }
      profileData.skillsOffered.forEach((skill, index) => {
        if (typeof skill !== 'string' || skill.trim().length === 0) {
          errors.push(`Skill offered at index ${index} must be a non-empty string`);
        } else if (skill.trim().length > 30) {
          errors.push(`Skill offered at index ${index} cannot exceed 30 characters`);
        }
      });
    }
  }

  if (profileData.skillsWanted !== undefined) {
    if (!Array.isArray(profileData.skillsWanted)) {
      errors.push("Skills wanted must be an array");
    } else {
      if (profileData.skillsWanted.length > 10) {
        errors.push("Cannot have more than 10 skills wanted");
      }
      profileData.skillsWanted.forEach((skill, index) => {
        if (typeof skill !== 'string' || skill.trim().length === 0) {
          errors.push(`Skill wanted at index ${index} must be a non-empty string`);
        } else if (skill.trim().length > 30) {
          errors.push(`Skill wanted at index ${index} cannot exceed 30 characters`);
        }
      });
    }
  }

  // Availability validation
  if (profileData.availability !== undefined) {
    const validAvailability = ['weekdays', 'weekends', 'flexible'];
    if (!validAvailability.includes(profileData.availability)) {
      errors.push("Availability must be weekdays, weekends, or flexible");
    }
  }

  // Profile visibility validation
  if (profileData.profileVisibility !== undefined) {
    const validVisibility = ['public', 'private'];
    if (!validVisibility.includes(profileData.profileVisibility)) {
      errors.push("Profile visibility must be public or private");
    }
  }

  // Social links validation
  if (profileData.socialLinks !== undefined) {
    const { website, github, twitter, linkedin } = profileData.socialLinks;
    
    if (website && !validator.isURL(website, { protocols: ['http', 'https'], require_protocol: true })) {
      errors.push("Invalid website URL");
    }
    
    if (github && github.trim().length > 100) {
      errors.push("GitHub username cannot exceed 100 characters");
    }
    
    if (twitter && twitter.trim().length > 100) {
      errors.push("Twitter username cannot exceed 100 characters");
    }
    
    if (linkedin && !validator.isURL(linkedin, { protocols: ['http', 'https'], require_protocol: true })) {
      errors.push("Invalid LinkedIn URL");
    }
  }

  return errors;
};

const validateBase64Image = (base64String) => {
  if (!base64String) {
    return "Profile photo is required";
  }

  // Check if it's a valid base64 string with image data
  const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
  if (!base64Regex.test(base64String)) {
    return "Invalid image format. Only JPEG, PNG, GIF, and WebP are supported";
  }

  // Check file size (approximate, base64 is ~33% larger than original)
  const sizeInBytes = (base64String.length * 0.75);
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

  if (sizeInBytes > maxSizeInBytes) {
    return "Image size cannot exceed 5MB";
  }

  return null; // No errors
};

export { validateProfileData, validateBase64Image };