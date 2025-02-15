"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("./userController");
const errorHandling_1 = require("../../../utils/errorHandling");
const validationMidleware_1 = require("../../../middlewares/validationMidleware");
const userValidation_1 = require("./userValidation");
const router = (0, express_1.Router)();
router.get("/", (0, validationMidleware_1.validation)(userValidation_1.readAllSchema), 
// Auth([Roles.Admin]),
(0, errorHandling_1.asyncHandler)(userController_1.userController.readAll));
router.patch("/delete-one", (0, validationMidleware_1.validation)(userValidation_1.deleteOneSchema), 
// Auth([Roles.Admin]),
(0, errorHandling_1.asyncHandler)(userController_1.userController.deleteOne));
router.patch("/update-role", (0, validationMidleware_1.validation)(userValidation_1.updateOneSchema), 
// Auth([Roles.Admin]),
(0, errorHandling_1.asyncHandler)(userController_1.userController.updateOne));
exports.default = router;
