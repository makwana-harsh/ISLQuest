import User from "../../models/User.model.js";
import { uploadUserProfilePic } from "../../utils/cloudinary.js";

const getProfileData = (user) => ({
  username: user.username,
  fullName: user.fullName,
  emailId: user.emailId,
  mobileNo: user.mobileNo,
  profilePic: user.profilePic,
  moduleScores: user.moduleScores,
});

export const getMyProfile = async (userId) => {
  const user = await User.findById(userId).select(
    "username fullName emailId mobileNo profilePic moduleScores"
  );

  if (!user) {
    throw new Error("User not found");
  }

  return getProfileData(user);
};

export const updateMyProfile = async ({
  userId,
  fullName,
  emailId,
  mobileNo,
  profilePicFile,
}) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (emailId && emailId !== user.emailId) {
    const existingEmail = await User.findOne({
      emailId,
      _id: { $ne: userId },
    });

    if (existingEmail) {
      throw new Error("Email already exists");
    }

    user.emailId = emailId;
  }

  if (mobileNo && mobileNo !== user.mobileNo) {
    const existingMobile = await User.findOne({
      mobileNo,
      _id: { $ne: userId },
    });

    if (existingMobile) {
      throw new Error("Mobile number already exists");
    }

    user.mobileNo = mobileNo;
  }

  if (fullName) {
    user.fullName = fullName;
  }

  if (profilePicFile) {
    const result = await uploadUserProfilePic(
      profilePicFile.buffer,
      userId
    );

    user.profilePic = result.secure_url;
  }

  await user.save();

  return getProfileData(user);
};