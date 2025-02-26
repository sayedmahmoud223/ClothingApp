"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variantAdminService = void 0;
const errorHandling_1 = require("../../../utils/errorHandling");
const variantModel_1 = require("../../../DB/models/variantModel");
const productAdminService_1 = require("../product/productAdminService");
const uploadVariantsImages_1 = require("./uploadVariantsImages");
// import { uploadImageForCreatevariant,uploadImageForUpdateVariant } from "./uploadvariantImages";
class VariantAdminService {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async variantExist(name) {
        if (await variantModel_1.variantModel.findOne({ name }))
            throw new errorHandling_1.ResError("catogry is already exist", 400);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async variantNotExist(variantId, productId) {
        const variant = await variantModel_1.variantModel.findOne({ _id: variantId, productId });
        if (!variant)
            throw new errorHandling_1.ResError("variant not found", 400);
        return variant;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async createService(productId, reqBody, reqFiles) {
        const product = await productAdminService_1.productAdminService.productNotExist(productId);
        const { colorName, avaliable } = reqBody;
        console.log({ reqBody });
        const avaliableData = JSON.parse(avaliable);
        const variant = await variantModel_1.variantModel.create({ productId, colorName, avaliable: avaliableData });
        if (reqFiles.length > 0) {
            await (0, uploadVariantsImages_1.uploadvariantImages)(reqFiles, product, variant, colorName);
        }
        return variant;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async updateOne(reqParams, reqBody, reqFiles) {
        const { productId, variantId } = reqParams;
        console.log({ productId, variantId });
        const product = await productAdminService_1.productAdminService.productNotExist(productId);
        console.log({ product });
        const variant = await this.variantNotExist(variantId, productId);
        variant.set(reqBody);
        console.log({ variant });
        if (reqFiles.length > 0) {
            const colorName = variant.colorName;
            await (0, uploadVariantsImages_1.uploadUpdatevariantImages)(reqFiles, product, variant, colorName);
        }
        return variant;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async addAvaliableToVariant(reqParams, avaliable) {
        const { productId, variantId } = reqParams;
        await productAdminService_1.productAdminService.productNotExist(productId);
        const variant = await this.variantNotExist(variantId, productId);
        console.log({ avaliable });
        variant.avaliable.push(avaliable);
        console.log({ variant });
        await variant.save();
        return variant;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteOneFromAvaliable(reqParams, avaliableId) {
        const { productId, variantId } = reqParams;
        await productAdminService_1.productAdminService.productNotExist(productId);
        const variant = await this.variantNotExist(variantId, productId);
        const updateVariant = await variantModel_1.variantModel
            .findOneAndUpdate({ _id: variantId, productId }, { $pull: { avaliable: { _id: avaliableId } } }, { new: true });
        console.log({ updateVariant });
        await variant.save();
        return variant;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteOne(reqParams) {
        const { productId, variantId } = reqParams;
        await productAdminService_1.productAdminService.productNotExist(productId);
        const variant = await this.variantNotExist(variantId, productId);
        const updateVariant = await variantModel_1.variantModel
            .findOneAndUpdate({ _id: variantId, productId }, { isDeleted: true }, { new: true });
        console.log({ updateVariant });
        return variant;
    }
}
exports.variantAdminService = new VariantAdminService();
