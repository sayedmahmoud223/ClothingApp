"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter_1 = __importDefault(require("./user/userRouter"));
const catogryAdminRouter_1 = __importDefault(require("./catogry/catogryAdminRouter"));
const productAdminRouter_1 = __importDefault(require("./product/productAdminRouter"));
const router = (0, express_1.Router)();
router.use("/users", userRouter_1.default);
router.use(`/categories`, catogryAdminRouter_1.default);
router.use(`/products`, productAdminRouter_1.default);
// router.use(`/subcategory`, subcategoryAdminRouter)
exports.default = router;
