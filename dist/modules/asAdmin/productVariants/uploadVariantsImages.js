"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadUpdatevariantImages = exports.uploadvariantImages = void 0;
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
const sharp_1 = __importDefault(require("sharp"));
const crypto_1 = require("crypto");
const uploadvariantImages = async (reqFiles, product, variant, colorName) => {
    for (const [index, img] of reqFiles.entries()) {
        const resizedImageBuffer = await (0, sharp_1.default)(img.buffer)
            .resize(100, 100)
            .toFormat("webp")
            .toBuffer();
        console.log("Uploading image to Cloudinary...");
        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary_1.default.uploader.upload_stream({ folder: `clothing/${product.category.name}/${product.productName}/${colorName.toLowerCase()}`, format: "webp", public_id: `${(0, crypto_1.randomUUID)()}_${index}` }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            }).end(resizedImageBuffer);
        });
        variant.subImages.push({ secure_url: uploadResponse.secure_url, public_id: uploadResponse.public_id });
    }
    variant.markModified("subImages"); // Tell Mongoose the array was updated
    await variant.save();
};
exports.uploadvariantImages = uploadvariantImages;
const uploadUpdatevariantImages = async (reqFiles, product, variant, colorName) => {
    if (variant.subImages.length > 0) {
        console.log("Deleting old images...");
        for (const img of variant.subImages) {
            await cloudinary_1.default.uploader.destroy(img.public_id);
        }
        variant.subImages = []; // Clear the array
    }
    for (const [index, img] of reqFiles.entries()) {
        const resizedImageBuffer = await (0, sharp_1.default)(img.buffer)
            .resize(100, 100)
            .toFormat("webp")
            .toBuffer();
        console.log("Uploading image to Cloudinary...");
        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary_1.default.uploader.upload_stream({ folder: `clothing/${product.category.name}/${product.productName}/${colorName.toLowerCase()}`, format: "webp", public_id: `${(0, crypto_1.randomUUID)()}_${index}` }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            }).end(resizedImageBuffer);
        });
        variant.subImages.push({ secure_url: uploadResponse.secure_url, public_id: uploadResponse.public_id });
    }
    variant.markModified("subImages"); // Tell Mongoose the array was updated
    await variant.save();
};
exports.uploadUpdatevariantImages = uploadUpdatevariantImages;
