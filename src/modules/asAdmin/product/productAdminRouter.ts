import { Router } from "express";
import { productAdminController } from "./productAdminController"
import { asyncHandler } from "../../../utils/errorHandling";
import { fileType, fileUploud } from "../../../utils/multer";
import Auth, { Roles } from "../../../middlewares/authMiddleware";
import variantAdminRouter from "../productVariants/variantsAdminRouter"
const router = Router({ mergeParams: true })

router.use("/:productId/variant", variantAdminRouter)

router.get("/read_all", asyncHandler(productAdminController.readAll))

router.post("/create",
    Auth(Roles.Admin),
    fileUploud(fileType.imageTypes).single("image"),
    asyncHandler(productAdminController.create))


router.patch("/update_one/:productId",
    Auth([Roles.Admin]),
    fileUploud(fileType.imageTypes).single("image"),
    asyncHandler(productAdminController.updateOne))


router.delete("/delete_one/:productId",
    Auth([Roles.Admin]),
    asyncHandler(productAdminController.deleteOne))


export default router