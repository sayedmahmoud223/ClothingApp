import { Router } from "express";
import { userController } from "./userController"
import { asyncHandler } from "../../../utils/errorHandling";
import Auth, { Roles } from "../../../middlewares/authMiddleware";
import { validation } from "../../../middlewares/validationMidleware";
import { deleteOneSchema, readAllSchema, updateOneSchema } from "./userValidation";
const router = Router()


router.get("/",
    validation(readAllSchema),
    // Auth([Roles.Admin]),
    asyncHandler(userController.readAll))

router.patch("/delete-one",
    validation(deleteOneSchema),
    // Auth([Roles.Admin]),
    asyncHandler(userController.deleteOne))

router.patch("/update-role",
    validation(updateOneSchema),
    // Auth([Roles.Admin]),
    asyncHandler(userController.updateOne))



export default router