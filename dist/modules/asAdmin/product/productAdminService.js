"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productAdminService = void 0;
const productModel_1 = require("../../../DB/models/productModel");
const errorHandling_1 = require("../../../utils/errorHandling");
// import { ICreateproduct } from "./IProductAdmin";
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
class ProductAdminService {
    async productExist(name) {
        if (await productModel_1.productModel.findOne({ name }))
            throw new errorHandling_1.ResError("catogry is already exist", 400);
    }
    async productNotExist(productId) {
        const product = await productModel_1.productModel.findOne({ _id: productId });
        if (!product)
            throw new errorHandling_1.ResError("catogry is not found", 400);
        return product;
    }
    async create(reqBody, reqFile) {
    }
    async updateOne(productId, name, path) {
        const product = await this.productNotExist(productId);
        console.log({ product });
        if (name && name !== product.name) {
            const oldFolder = `clothing/product/${product.name}`;
            const newFolder = `clothing/product/${name}`;
            // Rename the single image to move it to the new folder
            const newImagePublicId = newFolder + '/' + product.image.public_id.split('/').pop();
            await cloudinary_1.default.uploader.rename(product.image.public_id, newImagePublicId);
            product.image.public_id = newImagePublicId;
            product.image.secure_url = product.image.secure_url.replace(product.name, name);
            // Delete the old folder (optional, Cloudinary auto-deletes empty folders)
            await cloudinary_1.default.api.delete_folder(oldFolder).catch(() => {
                console.log(`Old folder "${oldFolder}" was already empty or does not exist.`);
            });
            // Update product name in DB
            product.name = name;
        }
        if (path) {
            await cloudinary_1.default.uploader.destroy(product.image.public_id);
            console.log({ productName: product.name });
            const { secure_url, public_id } = await cloudinary_1.default.uploader.upload(path, { folder: `clothing/product/${product.name}` });
            product.image.secure_url = secure_url;
            product.image.public_id = public_id;
        }
        await product.save();
        return product;
    }
    async deleteOne(productId) {
        const product = await productModel_1.productModel.findByIdAndDelete(productId);
        console.log({ product });
        if (!product)
            throw new errorHandling_1.ResError("catogry not found", 400);
        await cloudinary_1.default.uploader.destroy(product.image.public_id);
        await cloudinary_1.default.api.delete_folder(`clothing/product/${product.name}`);
        return product;
    }
}
exports.productAdminService = new ProductAdminService();
