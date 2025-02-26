import { Router } from "express";
import { variantAdminController } from "./variantsAdminController"
import { asyncHandler } from "../../../utils/errorHandling";
import { fileType, fileUploud } from "../../../utils/multer";
import Auth, { Roles } from "../../../middlewares/authMiddleware";
const router = Router({ mergeParams: true })

// router.get("/read_all", asyncHandler(subcategoryAdminController.readAll))
router.post("/",
    Auth(Roles.Admin),
    fileUploud(fileType.imageTypes).array("subImages", 4),
    asyncHandler(variantAdminController.createController))


router.patch("/:variantId",
    Auth([Roles.Admin]),
    fileUploud(fileType.imageTypes).array("subImages", 4),
    asyncHandler(variantAdminController.updateOne))

router.post("/:variantId/add-avliable",
    Auth([Roles.Admin]),
    asyncHandler(variantAdminController.addAvaliableToVariant))

router.patch("/:variantId/delete-avliable",
    Auth([Roles.Admin]),
    asyncHandler(variantAdminController.deleteOneFromAvaliable))


router.delete("/:variantId/delete-variant",
    Auth([Roles.Admin]),
    asyncHandler(variantAdminController.deleteOne))


export default router