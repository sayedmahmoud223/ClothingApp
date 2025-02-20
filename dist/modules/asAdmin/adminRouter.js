"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRouter_1 = __importDefault(require("./user/userRouter"));
const catogryAdminRouter_1 = __importDefault(require("./catogry/catogryAdminRouter"));
const router = (0, express_1.Router)();
router.use("/users", userRouter_1.default);
router.use(`/category`, catogryAdminRouter_1.default);
exports.default = router;
