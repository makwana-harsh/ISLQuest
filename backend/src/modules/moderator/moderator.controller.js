import {
  getContributions,
  getContributionForModerator,
  reviewContribution,
  blockUserByMobile,
  unblockUserByMobile,
} from "./moderator.service.js";

export const getModeratorContributionsController =
  async (req, res, next) => {
    try {
      const result =
        await getContributions({
          status: req.query.status,
          cursor: req.query.cursor,
          limit: 10,
        });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

export const getModeratorContributionController =
  async (req, res, next) => {
    try {
      const contribution =
        await getContributionForModerator(
          req.params.contributionId
        );

      res.status(200).json({
        contribution,
      });
    } catch (error) {
      next(error);
    }
  };

export const reviewContributionController =
  async (req, res, next) => {
    try {
      const contribution =
        await reviewContribution({
          contributionId:
            req.params.contributionId,

          moderatorId: req.user.id,

          status: req.body.status,

          signName: req.body.signName,

          meaning: req.body.meaning,

          usage: req.body.usage,

          description:
            req.body.description,

          moderatorFeedback:
            req.body.moderatorFeedback,
        });

      res.status(200).json({
        message:
          "Contribution updated successfully",
        contribution,
      });
    } catch (error) {
      next(error);
    }
  };

export const blockUserController =
  async (req, res, next) => {
    try {
      const {
        mobileNo,
        blockedUntil,
      } = req.body;

      if (!mobileNo) {
        throw new Error(
          "Mobile number is required"
        );
      }

      if (!blockedUntil) {
        throw new Error(
          "Block date is required"
        );
      }

      const result =
        await blockUserByMobile({
          mobileNo,
          blockedUntil:
            new Date(blockedUntil),
        });

      res.status(200).json({
        message:
          "User accounts blocked successfully",
        modifiedCount:
          result.modifiedCount,
      });
    } catch (error) {
      next(error);
    }
  };

export const unblockUserController =
  async (req, res, next) => {
    try {
      const { mobileNo } = req.body;

      if (!mobileNo) {
        throw new Error(
          "Mobile number is required"
        );
      }

      const result =
        await unblockUserByMobile(
          mobileNo
        );

      res.status(200).json({
        message:
          "User accounts unblocked successfully",
        modifiedCount:
          result.modifiedCount,
      });
    } catch (error) {
      next(error);
    }
  };