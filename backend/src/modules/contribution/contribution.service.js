import Contribution from "../../models/Contribution.model.js";
import User from "../../models/User.model.js";

import {uploadPendingContributionVideo,} from "../../utils/cloudinary.js";

import {
  reviewContribution,
} from "../../integrations/gemini/contributionReviewer.js";

export const createContribution = async ({
  userId,
  signName,
  description,
  meaning,
  usage,
  // example,
  videoBuffer,
}) => {
  const user = await User.findById(userId).select(
    "username fullName mobileNo emailId"
  );

  if (!user) {
    throw new Error("User not found");
  }

  /*
   * Create first so we get contributionId.
   */
  const contribution = await Contribution.create({
    userId,

    signName: signName.trim(),

    description: description?.trim() || "",

    meaning: meaning.trim(),

    usage: usage.trim(),

    // example: example?.trim() || "",

    videoUrl: "pending",

    status: "pending",
  });

  try {
    /*
     * Upload video using contribution ID.
     */
    const uploadResult =
      await uploadPendingContributionVideo(
        videoBuffer,
        contribution._id
      );

    contribution.videoUrl =
      uploadResult.secure_url;

    /*
     * Run Gemini review.
     */
    const review = await reviewContribution({
      signName: contribution.signName,
      description: contribution.description,
      meaning: contribution.meaning,
      usage: contribution.usage,
      // example: contribution.example,
    });

    /*
     * Update fields with Gemini's corrections.
     *
     * Description:
     * Only grammar correction is allowed by prompt.
     *
     * Meaning / usage / example:
     * Gemini may improve them.
     */
    contribution.description =
      review.description || contribution.description;

    contribution.meaning =
      review.meaning || contribution.meaning;

    contribution.usage =
      review.usage || contribution.usage;


    contribution.llmReview = {
      approved: review.approved,
      issues: review.issues || [],
      suggestion: review.suggestion || "",
    };

    /*
     * IMPORTANT:
     * Human moderator still decides final status.
     */
    contribution.status = "pending";

    await contribution.save();

    return contribution;
  } catch (error) {
    /*
     * If upload/LLM fails, remove the incomplete application.
     */
    await Contribution.findByIdAndDelete(
      contribution._id
    );

    throw error;
  }
};

export const getUserContributions = async (userId, page = 1, limit = 6) => {
  const skip = (page - 1) * limit;

  const [contributions, total] = await Promise.all([
    Contribution.find({ userId })
      .select("_id signName status createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Contribution.countDocuments({ userId }),
  ]);

  return {
    contributions,
    page,
    hasMore: skip + contributions.length < total,
    total,
  };
};

export const getContributionById = async (
  userId,
  contributionId
) => {
  const contribution = await Contribution.findOne({
    _id: contributionId,
    userId,
  })
    .select(
      "_id signName description meaning usage videoUrl status llmReview moderatorFeedback createdAt updatedAt"
    )
    .lean();

  if (!contribution) {
    throw new Error("Contribution not found");
  }

  return contribution;
};