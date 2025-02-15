"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validationMidleware_1 = require("../../../middlewares/validationMidleware");
exports.signupSchema = joi_1.default.object({
    userName: joi_1.default.string().min(2).max(30).required(),
    email: validationMidleware_1.generalFields.email,
    age: joi_1.default.number().min(12).max(80).required(),
    password: joi_1.default.string().min(8).max(30).required(),
    rePassword: validationMidleware_1.generalFields.cPassword.required()
}).required();
exports.loginSchema = joi_1.default.object({
    email: validationMidleware_1.generalFields.email,
    password: joi_1.default.string().min(8).max(30).required()
}).required();
