import express from "express";

import {registerUserFunct, loginUserFunct, refreshAccessToken, logoutUserFunct} from "./auth.controller.js";

const router = express.Router();

router.post("/register", registerUserFunct);
router.post("/login", loginUserFunct);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUserFunct);

export default router;