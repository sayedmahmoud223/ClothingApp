import { productModel } from "../../../DB/models/productModel";
import subcategoryModel from "../../../DB/models/subcatgeoryModel";
import { tokenPayload } from "../../../type";
import { ApiFeature } from "../../../utils/apiFeatures";
import { ResError } from "../../../utils/errorHandling";
import { categoryAdminService } from "../catogry/catogryAdminService";
import { IProductBody } from "./IProductAdmin";
import { uploadCreateProduct, uploadUpdateProduct } from "./productImageUpload";


class ProductAdminService {
    //////////////////////////////////////////////////////////////////////////////////////////////////
    async productExist(_id: string) {
        if (await productModel.findById(_id)) throw new ResError("product is already exist", 400)
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async productNotExist(productId: string) {
        const product = await productModel.findById({ _id: productId }).populate("category subcategory")
        if (!product) throw new ResError("product not found", 400)
        return product
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    async readAll(reqParams: any) {
        const readAll = new ApiFeature(productModel.find({}), reqParams.query).paginate().filter().search().sort();
        const data = await readAll.mongooseQuery.populate("category subcategory")
        const allCount = await productModel.countDocuments()
        return { data, allCount, currentPage: readAll.queryData.page, size: readAll.queryData.size }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async create(reqBody: IProductBody, buffer: string, userData: tokenPayload) {
        const { productName, description, categoryName, subcategoryName, costPrice, soldPrice, discount, mainColor } = reqBody
        // find category
        const category = await categoryAdminService.findCategoryWithName(categoryName)
        // find subcategory
        const subcategory = await subcategoryModel.findOne({ name: subcategoryName, category: category._id })
        if (!subcategory) throw new ResError("subcategory not found", 400)
        // create Product
        const product = new productModel({ productName, description, costPrice, soldPrice, mainColor, category: category._id, subcategory: subcategory._id })
        // handle product final price
        product.finalPrice = soldPrice - (soldPrice * ((discount || 0) / 100))
        // get images urls from uploadCreateProduct
        const { secure_urlForMain, public_idForMain, secure_urlForSmall, public_idForSmall } = await uploadCreateProduct(category, subcategory, product, buffer)
        product.mainImage.public_id = public_idForMain
        product.mainImage.secure_url = secure_urlForMain
        product.smallImage.public_id = public_idForSmall
        product.smallImage.secure_url = secure_urlForSmall
        product.createdBy = userData._id
        await product.save()
        return product
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async updateOne(productId: string, reqBody: any, buffer: string, userData: tokenPayload) {
        const product = await this.productNotExist(productId)
        product.set(reqBody);
        console.log({ product });
        const { discount, soldPrice } = reqBody
        discount || soldPrice ? product.finalPrice =
            (soldPrice || product.soldPrice) - (((discount || product.discount) / 100) * (soldPrice || product.soldPrice))
            : product.finalPrice
        if (buffer) {
            console.log({ buffer });
            const { secure_urlForMain, public_idForMain, secure_urlForSmall, public_idForSmall } = await uploadUpdateProduct(product, buffer)
            product.mainImage.public_id = public_idForMain
            product.mainImage.secure_url = secure_urlForMain
            product.smallImage.public_id = public_idForSmall
            product.smallImage.secure_url = secure_urlForSmall
        }
        product.updatedBy = userData._id
        await product.save()
        return product
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteOne(productId: string, isDeleted: boolean, userData: tokenPayload) {
        const product = await productModel.findByIdAndUpdate({ _id: productId }, { isDeleted }, { new: true })
        product.updateBy = userData._id
        return product
    }
}

export const productAdminService: ProductAdminService = new ProductAdminService()