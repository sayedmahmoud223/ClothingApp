"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploud = exports.fileType = void 0;
const multer_1 = __importDefault(require("multer"));
const errorHandling_1 = require("./errorHandling");
exports.fileType = {
    imageTypes: ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"],
    pdf: ["application/pdf"]
};
const fileUploud = (fileValidation = []) => {
    const storage = multer_1.default.memoryStorage();
    //filter method
    const fileFilter = (req, file, cb) => {
        if (fileValidation.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        }
        else {
            cb(new errorHandling_1.ResError("invalid file format", 400), false); // Reject the file
        }
    };
    const upload = (0, multer_1.default)({ fileFilter, storage });
    return upload;
};
exports.fileUploud = fileUploud;
