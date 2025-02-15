"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOneSchema = exports.deleteOneSchema = exports.readAllSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const validationMidleware_1 = require("../../../middlewares/validationMidleware");
exports.readAllSchema = joi_1.default.object({
    isDeleted: joi_1.default.boolean()
}).required();
exports.deleteOneSchema = joi_1.default.object({
    _id: validationMidleware_1.generalFields.id,
    isDeleted: joi_1.default.boolean().required()
}).required();
exports.updateOneSchema = joi_1.default.object({
    _id: validationMidleware_1.generalFields.id,
    role: joi_1.default.string().valid('User', 'Admin').required(),
}).required();
