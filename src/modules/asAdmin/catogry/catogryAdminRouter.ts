import { Router } from "express";
import { categoryAdminController } from "./catogryAdminController"
import { asyncHandler } from "../../../utils/errorHandling";
import { fileType, fileUploud } from "../../../utils/multer";
import Auth, { Roles } from "../../../middlewares/authMiddleware";
import subcategoryAdminRouter from "../subcategory/subcatogryAdminRouter"
const router = Router()

router.use("/:categoryId/subcategory",subcategoryAdminRouter)

router.get("/read_all",asyncHandler(categoryAdminController.readAll))

router.post("/create",
    Auth([Roles.Admin]),
    fileUploud(fileType.imageTypes).single("image"),
    asyncHandler(categoryAdminController.create))

router.delete("/delete_one/:categoryId",
    Auth([Roles.Admin]),
    asyncHandler(categoryAdminController.deleteOne))
    
router.patch("/update_one/:categoryId",
    Auth([Roles.Admin]),
    fileUploud(fileType.imageTypes).single("image"),
    asyncHandler(categoryAdminController.updateOne))

export default router