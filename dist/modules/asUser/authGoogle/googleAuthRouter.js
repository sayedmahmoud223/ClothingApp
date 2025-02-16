"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const googleAuthController_1 = require("./googleAuthController");
const errorHandling_1 = require("../../../utils/errorHandling");
const router = (0, express_1.Router)();
router.get("/google/callback", (0, errorHandling_1.asyncHandler)(googleAuthController_1.authWithGoogle.setGoogleConfig));
exports.default = router;
