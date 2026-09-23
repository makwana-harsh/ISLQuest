import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token missing",
      });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Check current block status
    if (user.isBlocked) {
      if (
        user.blockedUntil &&
        user.blockedUntil <= new Date()
      ) {
        user.isBlocked = false;
        user.blockedUntil = null;

        await user.save();
      } else {
        return res.status(403).json({
          message: "Your account is blocked",
        });
      }
    }

    req.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};

export const moderatorOnly = (
  req,
  res,
  next
) => {
  if (req.user?.role !== "moderator") {
    return res.status(403).json({
      message: "Moderator access required",
    });
  }

  next();
};