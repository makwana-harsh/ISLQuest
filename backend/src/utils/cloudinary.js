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
 * 1. USER PROFILE PIC
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

/*
 * 2. PENDING USER CONTRIBUTION VIDEO
 * Cloudinary: ISLQuest/pending_contributions/<contributionId>
 */
export const uploadPendingContributionVideo = async (fileBuffer, contributionId) => {
  return uploadStreamHelper(fileBuffer, {
    folder: "ISLQuest/pending_contributions",
    public_id: contributionId.toString(),
    overwrite: true,
    resource_type: "video",
  });
};

/*
 * 3. DICTIONARY SIGN VIDEO
 * Cloudinary: ISLQuest/dictionary/<dictionaryId>
 */
export const uploadDictionaryVideo = async (fileBuffer, dictionaryId) => {
  return uploadStreamHelper(fileBuffer, {
    folder: "ISLQuest/dictionary",
    public_id: dictionaryId.toString(),
    overwrite: true,
    resource_type: "video",
  });
};

/*
 * 4. LEARN ISL MODULE SIGN VIDEO
 * Cloudinary: ISLQuest/learn_isl/<learnSignId>
 */
export const uploadLearnSignVideo = async (fileBuffer, learnSignId) => {
  return uploadStreamHelper(fileBuffer, {
    folder: "ISLQuest/learn_isl",
    public_id: learnSignId.toString(),
    overwrite: true,
    resource_type: "video",
  });
};