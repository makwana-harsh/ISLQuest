import express from "express";

import { protect } from "../../middlewares/auth.middleware.js";

import {
  getModulesController,
  getModuleSignsController,
  getSignController,
  createQuizController,
  submitQuizController,
} from "./learnIsl.controller.js";

const router = express.Router();

router.use(protect);

router.get(
  "/modules",
  getModulesController
);

router.get(
  "/modules/:moduleNumber/signs",
  getModuleSignsController
);

router.get(
  "/signs/:signId",
  getSignController
);

router.post(
  "/modules/:moduleNumber/quiz",
  createQuizController
);

router.post(
  "/quiz/submit",
  submitQuizController
);

export default router;