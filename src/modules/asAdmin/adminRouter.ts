import { Router } from "express";
import userRouter from "./user/userRouter"
import categoryAdminRouter from "./catogry/catogryAdminRouter"
import { fileType, fileUploud } from "../../utils/multer";
const router = Router()

router.use("/users", userRouter)
router.use(`/category`, categoryAdminRouter)

export default router