"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadUpdateProduct = exports.uploadCreateProduct = void 0;
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
const sharp_1 = __importDefault(require("sharp"));
const errorHandling_1 = require("../../../utils/errorHandling");
const uploadCreateProduct = async (category, subcategory, product, buffer) => {
    console.log({ buffer });
    if (!buffer || !buffer.length) {
        throw new Error('Invalid image buffer');
    }
    const image = (0, sharp_1.default)(buffer);
    const resizedMainImageBuffer = await image
        .clone()
        .resize(400, 400) // Resize to 400x400 pixels (adjust as needed)
        .toFormat("webp") // Convert to WebP for better compression
        .toBuffer();
    const resizedSmallImageBuffer = await image
        .clone()
        .resize(100, 100) // Resize to 100x100 pixels (adjust as needed)
        .toFormat("webp") // Convert to WebP for better compression
        .toBuffer();
    // Upload to Cloudinary
    const uploadMainResponse = await new Promise((resolve, reject) => {
        cloudinary_1.default.uploader.upload_stream({ folder: `clothing/${category.name}/subcategories/${subcategory.name}/products/${product.productName}`, format: "webp" }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        }).end(resizedMainImageBuffer);
    });
    const uploadSmallResponse = await new Promise((resolve, reject) => {
        cloudinary_1.default.uploader.upload_stream({ folder: `clothing/${category.name}/subcategories/${subcategory.name}/products/${product.productName}`, format: "webp" }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        }).end(resizedSmallImageBuffer);
    });
    if (!uploadMainResponse.secure_url || !uploadMainResponse.public_id || !uploadSmallResponse.secure_url || !uploadSmallResponse.public_id) {
        throw new errorHandling_1.ResError("Image not uploaded", 400);
    }
    return { secure_urlForMain: uploadMainResponse.secure_url, public_idForMain: uploadMainResponse.public_id, secure_urlForSmall: uploadSmallResponse.secure_url, public_idForSmall: uploadSmallResponse.public_id };
};
exports.uploadCreateProduct = uploadCreateProduct;
const uploadUpdateProduct = async (product, buffer) => {
    await cloudinary_1.default.api.delete_resources([product.mainImage.public_id, product.smallImage.public_id]);
    console.log({ bufferNew: buffer });
    if (!buffer || !buffer.length) {
        throw new Error('Invalid image buffer');
    }
    const image = (0, sharp_1.default)(buffer);
    const resizedMainImageBuffer = await image
        .clone()
        .resize(400, 400) // Resize to 400x400 pixels (adjust as needed)
        .toFormat("webp") // Convert to WebP for better compression
        .toBuffer();
    const resizedSmallImageBuffer = await image
        .clone()
        .resize(100, 100) // Resize to 100x100 pixels (adjust as needed)
        .toFormat("webp") // Convert to WebP for better compression
        .toBuffer();
    // Upload to Cloudinary
    const uploadMainResponse = await new Promise((resolve, reject) => {
        cloudinary_1.default.uploader.upload_stream({ folder: `clothing/${product.category.name}/subcategories/${product.subcategory.name}/products/${product.productName}`, format: "webp" }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        }).end(resizedMainImageBuffer);
    });
    const uploadSmallResponse = await new Promise((resolve, reject) => {
        cloudinary_1.default.uploader.upload_stream({ folder: `clothing/${product.category.name}/subcategories/${product.subcategory.name}/products/${product.productName}`, format: "webp" }, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        }).end(resizedSmallImageBuffer);
    });
    if (!uploadMainResponse.secure_url || !uploadMainResponse.public_id || !uploadSmallResponse.secure_url || !uploadSmallResponse.public_id) {
        throw new errorHandling_1.ResError("Image not uploaded", 400);
    }
    return { secure_urlForMain: uploadMainResponse.secure_url, public_idForMain: uploadMainResponse.public_id, secure_urlForSmall: uploadSmallResponse.secure_url, public_idForSmall: uploadSmallResponse.public_id };
};
exports.uploadUpdateProduct = uploadUpdateProduct;
