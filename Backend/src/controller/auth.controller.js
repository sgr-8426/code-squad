import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Something went wrong while generating tokens");
  }
};

const registerUser = async (req, res) => {
  try {
    // Taking user details from request body
    const { username, email, password, role, secret_key } = req.body;

    // Validate required fields
    if ([username, email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({
        statusCode: 400,
        message: "All fields are required",
      });
    }

    // If role is admin, validate secret key
    if (role === 'admin') {
      if (!secret_key || secret_key.trim() === "") {
        return res.status(400).json({
          statusCode: 400,
          message: "Secret key is required for admin registration",
        });
      }

      if (secret_key !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({
          statusCode: 403,
          message: "Invalid admin secret key",
        });
      }
    }

    // Check if user already exists with the same username or email
    const existingUser = await User.findOne({ 
      $or: [
        { username: username.trim() },
        { email: email.trim().toLowerCase() }
      ]
    });

    if (existingUser) {
      const message = existingUser.email === email.trim().toLowerCase() 
        ? "User already exists with this email"
        : "User already exists with this username";
      
      return res.status(409).json({
        statusCode: 409,
        message: message,
      });
    }

    // Create a new user
    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: role || 'user' // Default to 'user' if role not provided
    });

    // If user creation fails, throw an error
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    
    if (!createdUser) {
      return res.status(500).json({
        statusCode: 500,
        message: "Something went wrong while creating user",
      });
    }

    // Return response with created user details
    return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User created successfully"));

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({
        statusCode: 409,
        message: `User already exists with this ${field}`,
      });
    }

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
      message: "Something went wrong during registration",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    // Taking user details from request body
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        statusCode: 400,
        message: "Both email and password are required",
      });
    }

    // Find user by email and include password for comparison
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

    // If user doesn't exist
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        statusCode: 403,
        message: "Account is banned. Please contact support.",
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid credentials",
      });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Get user details without sensitive information
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };

    // Return response with cookies and user data
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong during login",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const userId = req.user._id;

    // Clear refresh token from database
    await User.findByIdAndUpdate(
      userId,
      { $unset: { refreshToken: 1 } },
      { new: true }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));

  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong during logout",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    // Check if refresh token is provided
    if (!incomingRefreshToken) {
      return res.status(401).json({
        statusCode: 401,
        message: "Authentication failed. Refresh token is required.",
      });
    }

    // Verify the refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id).select("+refreshToken");

    // If user does not exist
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid refresh token",
      });
    }

    // Check if the provided refresh token matches the stored one
    if (incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json({
        statusCode: 401,
        message: "Refresh token is expired or used",
      });
    }

    // Generate new access and refresh tokens
    const { accessToken, refreshToken: newRefreshToken } = 
      await generateAccessAndRefreshTokens(user._id);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    };

    // Return response with new tokens
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Tokens refreshed successfully"
        )
      );

  } catch (error) {
    console.error("Token refresh error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid refresh token",
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        statusCode: 401,
        message: "Refresh token has expired",
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong during token refresh",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -refreshToken")
      .populate('profile');

    return res.status(200).json(
      new ApiResponse(200, user, "Current user fetched successfully")
    );

  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong while fetching user data",
    });
  }
};

export { 
  registerUser, 
  loginUser, 
  logoutUser, 
  refreshAccessToken, 
  getCurrentUser 
};