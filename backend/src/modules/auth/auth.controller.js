import {
  validateRegister,
  validateLogin,
} from "./auth.validation.js";

import {
  registerUser,
  loginUser,
  verifyAndGenerateAccessToken,
} from "./auth.service.js";

export const registerUserFunct = async (req, res) => {
  try {
    const data = validateRegister(req.body);
    const user = await registerUser(data);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Registration failed",
    });
  }
};

export const loginUserFunct = async (req, res) => {
  try {
    const data = validateLogin(req.body);

    const { accessToken, refreshToken, user } =
      await loginUser(data);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message || "Login failed",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token missing",
      });
    }

    const data =
      await verifyAndGenerateAccessToken(refreshToken);

    return res.status(200).json(data);
  } catch {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};

export const logoutUserFunct = async (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "strict" : "lax",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};