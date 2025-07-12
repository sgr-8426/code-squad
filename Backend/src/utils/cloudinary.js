import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (base64Image, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: "image",
      folder: "profiles",
      transformation: [
        { width: 400, height: 400, crop: "fill", quality: "auto" },
        { format: "webp" }
      ],
      ...options
    };

    const result = await cloudinary.uploader.upload(base64Image, defaultOptions);
    
    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return false;
  }
};

const updateCloudinaryImage = async (oldPublicId, newBase64Image, options = {}) => {
  try {
    // Delete old image
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }

    // Upload new image
    const uploadResult = await uploadToCloudinary(newBase64Image, options);
    return uploadResult;
  } catch (error) {
    console.error("Cloudinary update error:", error);
    return null;
  }
};

export { uploadToCloudinary, deleteFromCloudinary, updateCloudinaryImage };