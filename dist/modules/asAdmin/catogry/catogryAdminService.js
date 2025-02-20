"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryAdminService = void 0;
const catgeoryModel_1 = __importDefault(require("../../../DB/models/catgeoryModel"));
const errorHandling_1 = require("../../../utils/errorHandling");
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
const sharp_1 = __importDefault(require("sharp"));
class CategoryAdminService {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async categoryExist(name) {
        if (await catgeoryModel_1.default.findOne({ name }))
            throw new errorHandling_1.ResError("catogry is already exist", 400);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async categoryNotExist(categoryId) {
        const category = await catgeoryModel_1.default.findOne({ _id: categoryId });
        if (!category)
            throw new errorHandling_1.ResError("catogry is not found", 400);
        return category;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async create(reqBody, reqFile, userData) {
        const { name } = reqBody;
        const { _id } = userData;
        await this.categoryExist(name);
        // Resize image using Sharp
        const resizedImageBuffer = await (0, sharp_1.default)(reqFile.buffer)
            .resize(400, 400) // Resize to 500x500 pixels (adjust as needed)
            .toFormat("webp") // Convert to WebP for better compression
            .toBuffer();
        // Upload to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
            cloudinary_1.default.uploader.upload_stream({ folder: `clothing/category/${name}`, format: "webp" }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            }).end(resizedImageBuffer);
        });
        if (!uploadResponse.secure_url || !uploadResponse.public_id) {
            throw new errorHandling_1.ResError("Image not uploaded", 400);
        }
        const category = await catgeoryModel_1.default.create({ name, createdBy: _id, image: { public_id: uploadResponse.public_id, secure_url: uploadResponse.secure_url } });
        if (!category)
            throw new errorHandling_1.ResError("category not Created", 400);
        return category;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async updateOne(categoryId, name, buffer, userData) {
        const category = await this.categoryNotExist(categoryId);
        const { _id } = userData;
        console.log({ category });
        if (name && name !== category.name) {
            const oldFolder = `clothing/category/${category.name}`;
            const newFolder = `clothing/category/${name}`;
            // Rename the single image to move it to the new folder
            const newImagePublicId = newFolder + '/' + category.image.public_id.split('/').pop();
            await cloudinary_1.default.uploader.rename(category.image.public_id, newImagePublicId);
            category.image.public_id = newImagePublicId;
            category.image.secure_url = category.image.secure_url.replace(category.name, name);
            // Delete the old folder (optional, Cloudinary auto-deletes empty folders)
            await cloudinary_1.default.api.delete_folder(oldFolder).catch(() => {
                console.log(`Old folder "${oldFolder}" was already empty or does not exist.`);
            });
            // Update category name in DB
            category.name = name;
        }
        if (buffer) {
            await cloudinary_1.default.uploader.destroy(category.image.public_id);
            const resizedImageBuffer = await (0, sharp_1.default)(buffer)
                .resize(400, 400) // Resize to 500x500 pixels (adjust as needed)
                .toFormat("webp") // Convert to WebP for better compression
                .toBuffer();
            // Upload to Cloudinary
            const uploadResponse = await new Promise((resolve, reject) => {
                cloudinary_1.default.uploader.upload_stream({ folder: `clothing/category/${name ? name : category.name}`, format: "webp" }, (error, result) => {
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
        }
        category.updatedBy = _id;
        await category.save();
        return category;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteOne(categoryId) {
        const category = await catgeoryModel_1.default.findByIdAndDelete(categoryId);
        console.log({ category });
        if (!category)
            throw new errorHandling_1.ResError("catogry not found", 400);
        await cloudinary_1.default.uploader.destroy(category.image.public_id);
        await cloudinary_1.default.api.delete_folder(`clothing/category/${category.name}`);
        console.log({ category });
        return category;
    }
}
exports.categoryAdminService = new CategoryAdminService();
