"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryImage = void 0;
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
const errorHandling_1 = require("../../../utils/errorHandling");
const updateCategoryImage = async (category, buffer, name) => {
    await cloudinary_1.default.uploader.destroy(category.image.public_id);
    const resizedImageBuffer = await (0, sharp_1.default)(buffer)
        .resize(400, 400) // Resize to 500x500 pixels (adjust as needed)
        .toFormat("webp") // Convert to WebP for better compression
        .toBuffer();
    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary_1.default.uploader.upload_stream({ folder: `clothing/category/${name ? name.toLowerCase() : category.name}`, format: "webp" }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        }).end(resizedImageBuffer);
    });
    console.log("Buffer Size:", resizedImageBuffer.length);
    if (!uploadResponse.secure_url || !uploadResponse.public_id) {
        throw new errorHandling_1.ResError("Image not uploaded", 400);
    }
    category.image.secure_url = uploadResponse.secure_url;
    category.image.public_id = uploadResponse.public_id;
};
exports.updateCategoryImage = updateCategoryImage;
