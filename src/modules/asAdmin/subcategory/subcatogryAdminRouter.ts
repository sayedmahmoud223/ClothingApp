import { Router } from "express";
import { subcategoryAdminController } from "./subcatogryAdminController"
import { asyncHandler } from "../../../utils/errorHandling";
import { fileType, fileUploud } from "../../../utils/multer";
import Auth, { Roles } from "../../../middlewares/authMiddleware";
const router = Router({ mergeParams: true })

// router.get("/read_all", asyncHandler(subcategoryAdminController.readAll))
router.get("/read_all", asyncHandler(subcategoryAdminController.readSubcategoryForOneCategory))
router.post("/",
    Auth(Roles.Admin),
    fileUploud(fileType.imageTypes).single("image"),
    asyncHandler(subcategoryAdminController.create))

router.patch("/:subcategoryId",
    Auth([Roles.Admin]),
    fileUploud(fileType.imageTypes).single("image"),
    asyncHandler(subcategoryAdminController.updateOne))

router.delete("/:subcategoryId",
    Auth([Roles.Admin]),
    asyncHandler(subcategoryAdminController.deleteOne))


export default router