import express from "express";

import {getMyProfileFunct,updateMyProfileFunct} from "./profile.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { uploadProfilePic } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", protect, getMyProfileFunct);

router.put("/",protect,uploadProfilePic.single("profilePic"),updateMyProfileFunct);

export default router;