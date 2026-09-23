import express from "express";

import {getDictionarySignsFunct,getDictionarySignByIdFunct} from "./dictionary.controller.js";

// import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getDictionarySignsFunct);

router.get("/:id", getDictionarySignByIdFunct);

export default router;