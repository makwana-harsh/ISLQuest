import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token missing",
      });
    }

    const token = header.split(" ")[1];

    req.user = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};

export const moderatorOnly = (req, res, next) => {
  if (req.user?.role !== "moderator") {
    return res.status(403).json({
      message: "Moderator access required",
    });
  }

  next();
};