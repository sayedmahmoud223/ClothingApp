import { Router } from "express";
import { authWithGoogle } from "./googleAuthController"
import { asyncHandler } from "../../../utils/errorHandling";
const router = Router()

router.get("/google/callback", asyncHandler(authWithGoogle.setGoogleConfig))

export default router