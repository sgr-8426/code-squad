import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    //get the access token from the request headers or cookies
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // Check if access token is provided or not
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Access token is required",
        });
        return;
    }

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodeToken?._id).select(
      "-password -refreshToken"
    );

    if(!user){
        res.status(401).json({
            success: false,
            message: "Invalid access token",
        });
        return;
    }

    // Attach user to the request object
    req.user = user;
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid access token",
    });
  }
};
