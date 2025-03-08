"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productAdminController_1 = require("./productAdminController");
const errorHandling_1 = require("../../../utils/errorHandling");
const multer_1 = require("../../../utils/multer");
const authMiddleware_1 = __importStar(require("../../../middlewares/authMiddleware"));
const variantsAdminRouter_1 = __importDefault(require("../productVariants/variantsAdminRouter"));
const router = (0, express_1.Router)({ mergeParams: true });
router.use("/:productId/variant", variantsAdminRouter_1.default);
router.get("/read_all", (0, errorHandling_1.asyncHandler)(productAdminController_1.productAdminController.readAll));
router.post("/create", (0, authMiddleware_1.default)(authMiddleware_1.Roles.Admin), (0, multer_1.fileUploud)(multer_1.fileType.imageTypes).single("image"), (0, errorHandling_1.asyncHandler)(productAdminController_1.productAdminController.create));
router.patch("/update-one/:productId", (0, authMiddleware_1.default)([authMiddleware_1.Roles.Admin]), (0, multer_1.fileUploud)(multer_1.fileType.imageTypes).single("image"), (0, errorHandling_1.asyncHandler)(productAdminController_1.productAdminController.updateOne));
router.delete("/delete-one/:productId", (0, authMiddleware_1.default)([authMiddleware_1.Roles.Admin]), (0, errorHandling_1.asyncHandler)(productAdminController_1.productAdminController.deleteOne));
exports.default = router;
