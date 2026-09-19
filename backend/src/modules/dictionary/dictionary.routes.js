import express from "express";

import {getDictionarySignsFunct,getDictionarySignByIdFunct} from "./dictionary.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getDictionarySignsFunct);

router.get("/:id", protect, getDictionarySignByIdFunct);

export default router;