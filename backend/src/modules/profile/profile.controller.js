import {getMyProfile,updateMyProfile} from "./profile.service.js";

export const getMyProfileFunct = async (req, res) => {
  try {
    const profile = await getMyProfile(req.user.id);

    return res.status(200).json({
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to fetch profile",
    });
  }
};

export const updateMyProfileFunct = async (req, res) => {
  try {
    const profile = await updateMyProfile({
      userId: req.user.id,
      fullName: req.body.fullName?.trim(),
      emailId: req.body.emailId?.trim().toLowerCase(),
      mobileNo: req.body.mobileNo?.trim(),
      profilePicFile: req.file,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Failed to update profile",
    });
  }
};