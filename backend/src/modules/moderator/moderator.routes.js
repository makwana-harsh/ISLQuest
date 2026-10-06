import express from "express";

import {
  protect,
  moderatorOnly,
} from "../../middlewares/auth.middleware.js";

import {
  getModeratorContributionsController,
  getModeratorContributionController,
  reviewContributionController,
  blockUserController,
  unblockUserController,
} from "./moderator.controller.js";

const router = express.Router();

router.use(protect);
router.use(moderatorOnly);

router.get(
  "/contributions",
  getModeratorContributionsController
);

router.get(
  "/contributions/:contributionId",
  getModeratorContributionController
);

router.patch(
  "/contributions/:contributionId",
  reviewContributionController
);

router.patch(
  "/users/block",
  blockUserController
);

router.patch(
  "/users/unblock",
  unblockUserController
);

export default router;