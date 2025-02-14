import { Router } from "express";
import userRouter from "./user/userRouter"
const router = Router()

router.use("/users", userRouter)

export default router