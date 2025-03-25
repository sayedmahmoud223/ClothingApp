"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageForUpdateSubcategory = exports.uploadImageForCreateSubcategory = void 0;
const sharp_1 = __importDefault(require("sharp"));
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
const errorHandling_1 = require("../../../utils/errorHandling");
const uploadImageForCreateSubcategory = async (category, name, buffer) => {
    const resizedImageBuffer = await (0, sharp_1.default)(buffer)
        .resize(400, 400) // Resize to 500x500 pixels (adjust as needed)
        .toFormat("webp") // Convert to WebP for better compression
        .toBuffer();
    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary_1.default.uploader.upload_stream({ folder: `clothing/${category.name}/subcategories/${name.toLowerCase()}`, format: "webp" }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        }).end(resizedImageBuffer);
    });
    if (!uploadResponse.secure_url || !uploadResponse.public_id) {
        throw new errorHandling_1.ResError("Image not uploaded", 400);
    }
    return { secure_url: uploadResponse.secure_url, public_id: uploadResponse.public_id };
};
exports.uploadImageForCreateSubcategory = uploadImageForCreateSubcategory;
const uploadImageForUpdateSubcategory = async (subcategory, category, name, buffer) => {
    await cloudinary_1.default.uploader.destroy(subcategory.image.public_id);
    const resizedImageBuffer = await (0, sharp_1.default)(buffer)
        .resize(400, 400) // Resize to 500x500 pixels (adjust as needed)
        .toFormat("webp") // Convert to WebP for better compression
        .toBuffer();
    // Upload to Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
        cloudinary_1.default.uploader.upload_stream({ folder: `clothing/${category.name}/subcategories/${name ? name.toLowerCase() : subcategory.name}`, format: "webp" }, (error, result) => {
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
    subcategory.image.secure_url = uploadResponse.secure_url;
    subcategory.image.public_id = uploadResponse.public_id;
};
exports.uploadImageForUpdateSubcategory = uploadImageForUpdateSubcategory;
