import multer from "multer";

const storage = multer.memoryStorage();

export const uploadProfilePic = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed for profile picture!"), false);
    }
  },
});