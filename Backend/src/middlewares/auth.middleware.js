import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        message: "Access token is required"
      });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    
    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid access token"
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        statusCode: 403,
        message: "Account is banned"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        statusCode: 401,
        message: "Invalid access token"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        statusCode: 401,
        message: "Access token has expired"
      });
    }

    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong during authentication"
    });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        statusCode: 403,
        message: "Admin access required"
      });
    }
    next();
  } catch (error) {
    console.error("Admin verification error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Something went wrong during admin verification"
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    
    if (user && !user.isBanned) {
      req.user = user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

export { verifyJWT, verifyAdmin, optionalAuth };