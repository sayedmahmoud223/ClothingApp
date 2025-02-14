import { Router } from "express";
import { authController } from "./authController"
import { asyncHandler } from "../../../utils/errorHandling";
const router = Router()


router.post("/signup", asyncHandler(authController.signup))
router.post("/login", asyncHandler(authController.login))
router.get("/confirmEmail/:vCode", asyncHandler(authController.confirmEmail))


export default router