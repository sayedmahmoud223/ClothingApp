import { ResError } from "../../../utils/errorHandling";
import cloudinary from "../../../utils/cloudinary"
import { tokenPayload } from "../../../type";
import { categoryAdminService } from "../catogry/catogryAdminService";
import { IVariant, variantModel } from "../../../DB/models/variantModel";
import { productAdminService } from "../product/productAdminService";
import { ICreateVariantBody, ICreateVariantFile, IImage, IParams } from "./IVariantsAdmin";
import { uploadUpdatevariantImages, uploadvariantImages } from "./uploadVariantsImages";
// import { uploadImageForCreatevariant,uploadImageForUpdateVariant } from "./uploadvariantImages";

class VariantAdminService {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async variantExist(name: string) {
        if (await variantModel.findOne({ name })) throw new ResError("catogry is already exist", 400)
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async variantNotExist(variantId: string, productId: string) {
        const variant = await variantModel.findOne({ _id: variantId, productId })
        if (!variant) throw new ResError("variant not found", 400)
        return variant
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async createService(productId: string, reqBody: ICreateVariantBody, reqFiles: IImage[]) {
        const product = await productAdminService.productNotExist(productId)
        const { colorName, avaliable } = reqBody
        console.log({ reqBody });
        const avaliableData = JSON.parse(avaliable as any)
        const variant: any = await variantModel.create({ productId, colorName, avaliable: avaliableData })
        if (reqFiles.length > 0) {
            await uploadvariantImages(reqFiles, product, variant, colorName)
        }
        return variant
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async updateOne(reqParams: IParams, reqBody: any, reqFiles: any) {
        const { productId, variantId } = reqParams
        console.log({ productId, variantId });
        const product = await productAdminService.productNotExist(productId)
        console.log({ product });
        const variant = await this.variantNotExist(variantId, productId)
        variant.set(reqBody)
        console.log({ variant });
        if (reqFiles.length > 0) {
            const colorName = variant.colorName
            await uploadUpdatevariantImages(reqFiles, product, variant, colorName)
        }
        return variant
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async addAvaliableToVariant(reqParams: IParams, avaliable: any) {
        const { productId, variantId } = reqParams
        await productAdminService.productNotExist(productId)
        const variant = await this.variantNotExist(variantId, productId)
        console.log({ avaliable });
        variant.avaliable.push(avaliable)
        console.log({ variant });
        await variant.save()
        return variant
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteOneFromAvaliable(reqParams: IParams, avaliableId: any) {
        const { productId, variantId } = reqParams
        await productAdminService.productNotExist(productId)
        const variant = await this.variantNotExist(variantId, productId)
        const updateVariant = await variantModel
            .findOneAndUpdate({ _id: variantId, productId }, { $pull: { avaliable: { _id: avaliableId } } }, { new: true })
        console.log({ updateVariant });
        await variant.save()
        return variant
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteOne(reqParams: IParams) {
        const { productId, variantId } = reqParams
        await productAdminService.productNotExist(productId)
        const variant = await this.variantNotExist(variantId, productId)
        const updateVariant = await variantModel
            .findOneAndUpdate({ _id: variantId, productId }, { isDeleted: true }, { new: true })
        console.log({ updateVariant });
        return variant

    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
}

export const variantAdminService: VariantAdminService = new VariantAdminService()