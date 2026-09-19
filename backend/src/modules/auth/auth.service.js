import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/User.model.js";

const getPublicUser = (user) => ({
  id: user._id,
  username: user.username,
  fullName: user.fullName,
  mobileNo: user.mobileNo,
  emailId: user.emailId,
  profilePic: user.profilePic,
  role: user.role,
});

export const registerUser = async (data) => {
  const existingUser = await User.findOne({
    $or: [
      { username: data.username },
      { emailId: data.emailId },
      { mobileNo: data.mobileNo },
    ],
  });

  if (existingUser) {
    if (existingUser.username === data.username)
      throw new Error("Username already exists");

    if (existingUser.emailId === data.emailId)
      throw new Error("Email already exists");

    throw new Error("Mobile number already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return getPublicUser(user);
};

export const loginUser = async ({ username, password }) => {
  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    throw new Error("Invalid username or password");
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    throw new Error("Invalid username or password");
  }

  // Check block
  if (user.isBlocked) {
    if (!user.blockDuration || user.blockDuration > new Date()) {
      throw new Error("Your account is blocked");
    }

    // Block duration expired
    user.isBlocked = false;
    user.blockDuration = null;
    await user.save();
  }

  const payload = {
    id: user._id,
    username: user.username,
    role: user.role,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return {
    accessToken,
    refreshToken,
    user: getPublicUser(user),
  };
};

export const verifyAndGenerateAccessToken = async (refreshToken) => {
  const decoded = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isBlocked) {
    if (!user.blockDuration || user.blockDuration > new Date()) {
      throw new Error("Account is blocked");
    }

    user.isBlocked = false;
    user.blockDuration = null;
    await user.save();
  }

  const payload = {
    id: user._id,
    username: user.username,
    role: user.role,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  return {
    accessToken,
    user: getPublicUser(user),
  };
};