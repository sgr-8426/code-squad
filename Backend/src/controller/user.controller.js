import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message:
        "Something went wrong while generating access tokens and refresh tokens",
    });
  }
};

const registerUser = async (req, res) => {
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

  // Check if user already exists with the same email
  const existingUser = await User.findOne({ email });

  // If user already exists, throw an error
  if (existingUser) {
    return res.status(409).json({
      statusCode: 409,
      message: "User already exists with this email",
    });
  }

  // Create a new user
  const user = await User.create({
    username,
    email,
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
};

const loginUser = async (req, res) => {
  // Taking user details from request body
  const { email, password } = req.body;

  // Validate that both email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      statusCode: 400,
      message: "Both email and password are required",
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user doesn't exist
    if (!user) {
      return res.status(401).json({  // 401 is more appropriate for login failures
        statusCode: 401,
        message: "Invalid credentials", // Generic message for security
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid credentials", // Generic message for security
      });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    // Get user details without sensitive information
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set secure only in production
      sameSite: "strict" // Added for CSRF protection
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
            accessToken, // Still returning in body for clients that can't use cookies
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

const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // Check if refresh token is provided
  if (!incomingRefreshToken) {
    return res.status(400).json({
      statusCode: 400,
      message: "Anauthentication failed. Refresh token is required.",
    });
  }

  try {
    const decodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodeToken?._id);

    // If user does not exist, throw an error
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "Invalid refresh token",
      });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(401).json({
        statusCode: 401,
        message: "Refresh token is expired or used",
      });
    }

    const options = {
      httpOnly: true,
      secure: true, // Set to true if using HTTPS
    };

    //generate new access and refresh tokens
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(user._id);

    //return res
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
    return res.status(401).json({
      statusCode: 401,
      message: error?.message || "Invalid refresh token",
    });
  }
};

export { registerUser, loginUser, refreshAccessToken };
