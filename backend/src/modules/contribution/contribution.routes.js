import express from "express";

import { protect } from "../../middlewares/auth.middleware.js";
import {uploadContributeVideo} from "../../middlewares/multer.middleware.js";
import {createContributionController,getUserContributionsController,getContributionController,} from "./contribution.controller.js";

const router = express.Router();

router.use(protect);

router.get("/",getUserContributionsController);
router.get("/:contributionId",getContributionController);
router.post("/",uploadContributeVideo.single("video"),createContributionController);

export default router;