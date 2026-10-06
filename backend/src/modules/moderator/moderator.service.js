import Contribution from "../../models/Contribution.model.js";
import User from "../../models/User.model.js";
import Dictionary from "../../models/Dictionary.model.js";

export const getContributions = async ({status,cursor,limit = 10,}) => {
  const query = {};

  if (status === "pending") {
    query.status = "pending";
  } else {
    query.status = {
      $in: ["approved", "rejected"],
    };
  }

  if (cursor) {
    query._id = {
      $lt: cursor,
    };
  }

  const contributions =
    await Contribution.find(query)
      .populate(
        "userId",
        "username emailId mobileNo"
      )
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

  const hasMore =
    contributions.length > limit;

  if (hasMore) {
    contributions.pop();
  }

  return {
    contributions,
    nextCursor: hasMore
      ? contributions[
          contributions.length - 1
        ]._id
      : null,
    hasMore,
  };
};

export const getContributionForModerator =
  async (contributionId) => {
    const contribution =
      await Contribution.findById(
        contributionId
      )
        .populate(
          "userId",
          "username fullName emailId mobileNo isBlocked blockedUntil"
        )
        .populate(
          "moderatedBy",
          "username"
        )
        .lean();

    if (!contribution) {
      throw new Error(
        "Contribution not found"
      );
    }

    return contribution;
  };

export const reviewContribution = async ({
  contributionId,
  moderatorId,
  status,
  signName,
  meaning,
  usage,
  description,
  moderatorFeedback,
}) => {
  if (!["approved", "rejected"].includes(status)) {
    throw new Error("Invalid status");
  }

  const contribution = await Contribution.findById(contributionId).populate(
    "userId",
    "username fullName"
  );

  if (!contribution) {
    throw new Error("Contribution not found");
  }

  // Update contribution record details
  contribution.signName = signName.trim();
  contribution.meaning = meaning.trim();
  contribution.usage = usage.trim();
  contribution.description = description?.trim() || "";
  contribution.moderatorFeedback = moderatorFeedback?.trim() || "";
  contribution.status = status;
  contribution.moderatedBy = moderatorId;
  contribution.moderatedAt = new Date();

  if (status === "approved") {
    const contributorName =
      contribution.userId?.username ||
      contribution.userId?.fullName ||
      "Community Contributor";

    // Upsert: Overwrites existing entry if contributionId exists, otherwise inserts a new document
    await Dictionary.findOneAndUpdate(
      { contributionId: contribution._id },
      {
        contributionId: contribution._id,
        signName: contribution.signName,
        meaning: contribution.meaning,
        usage: contribution.usage,
        videoUrl: contribution.videoUrl,
        sourceType: "user",
        sourceName: contributorName,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } else if (status === "rejected") {
    // Delete dictionary entry if previously approved
    await Dictionary.deleteOne({ contributionId: contribution._id });
  }

  await contribution.save();
  return contribution;
};

export const blockUserByMobile = async ({mobileNo,blockedUntil}) => {
  const result = await User.updateMany(
    { mobileNo },
    {
      $set: {
        isBlocked: true,
        blockedUntil,
      },
    }
  );

  return result;
};

export const unblockUserByMobile = async ( mobileNo) => {
  const result = await User.updateMany(
    { mobileNo },
    {
      $set: {
        isBlocked: false,
        blockedUntil: null,
      },
    }
  );

  return result;
};