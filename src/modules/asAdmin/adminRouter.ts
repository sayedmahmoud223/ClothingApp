import { Router } from "express";
import userRouter from "./user/userRouter"
import categoryAdminRouter from "./catogry/catogryAdminRouter"
import productAdminRouter from "./product/productAdminRouter"
import { fileType, fileUploud } from "../../utils/multer";
const router = Router()

router.use("/users", userRouter)
router.use(`/categories`, categoryAdminRouter)
router.use(`/products`, productAdminRouter)
// router.use(`/subcategory`, subcategoryAdminRouter)

export default router