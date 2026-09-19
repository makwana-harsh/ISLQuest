import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const uploadStreamHelper = (fileBuffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    Readable.from(fileBuffer).pipe(stream);
  });
};

/*
 * USER PROFILE PIC
 * Cloudinary: ISLQuest/profiles/<userId>
 */
export const uploadUserProfilePic = async (fileBuffer, userId) => {
  return uploadStreamHelper(fileBuffer, {
    folder: "ISLQuest/profiles",
    public_id: userId.toString(),
    overwrite: true,
    invalidate: true,
    resource_type: "image",
  });
};