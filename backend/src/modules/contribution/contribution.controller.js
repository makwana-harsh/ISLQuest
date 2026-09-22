import {
  createContribution,
  getUserContributions,
  getContributionById,
} from "./contribution.service.js";

import {
  validateContribution,
} from "./contribution.validation.js";

export const createContributionController = async (req,res,next) => {
  try {
    validateContribution(req.body);

    if (!req.file) {
      throw new Error("Contribution video is required");
    }

    const contribution =
      await createContribution({
        userId: req.user.id,
        signName: req.body.signName,
        description: req.body.description,
        meaning: req.body.meaning,
        usage: req.body.usage,
        // example: req.body.example,
        videoBuffer: req.file.buffer,
      });

    res.status(201).json({
      message: "Contribution submitted successfully",
      contribution: {
        _id: contribution._id,
        signName: contribution.signName,
        status: contribution.status,
        createdAt: contribution.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserContributionsController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;

    const result = await getUserContributions(req.user.id, page, limit);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getContributionController = async (
  req,
  res,
  next
) => {
  try {
    const contribution =
      await getContributionById(
        req.user.id,
        req.params.contributionId
      );

    res.status(200).json({
      contribution,
    });
  } catch (error) {
    next(error);
  }
};