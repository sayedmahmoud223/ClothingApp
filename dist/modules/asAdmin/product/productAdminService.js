"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productAdminService = void 0;
const productModel_1 = require("../../../DB/models/productModel");
const subcatgeoryModel_1 = __importDefault(require("../../../DB/models/subcatgeoryModel"));
const apiFeatures_1 = require("../../../utils/apiFeatures");
const errorHandling_1 = require("../../../utils/errorHandling");
const catogryAdminService_1 = require("../catogry/catogryAdminService");
const productImageUpload_1 = require("./productImageUpload");
class ProductAdminService {
    //////////////////////////////////////////////////////////////////////////////////////////////////
    async productExist(_id) {
        if (await productModel_1.productModel.findById(_id))
            throw new errorHandling_1.ResError("product is already exist", 400);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async productNotExist(productId) {
        const product = await productModel_1.productModel.findById(productId).populate("category subcategory");
        if (!product)
            throw new errorHandling_1.ResError("product not found", 400);
        return product;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    async readAll(reqParams) {
        const readAll = new apiFeatures_1.ApiFeature(productModel_1.productModel.find({}), reqParams.query).paginate().filter().search().sort();
        console.log({ name: readAll.queryData.search });
        const data = await readAll.mongooseQuery.populate("category subcategory");
        const allCount = await productModel_1.productModel.countDocuments({ name: readAll.queryData.search });
        const allPages = Math.ceil(allCount / readAll.queryData.size);
        return { data, allCount, currentPage: readAll.queryData.page, size: readAll.queryData.size, allPages };
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async create(reqBody, buffer, userData) {
        const { productName, description, categoryId, subcategoryId, costPrice, soldPrice, discount, mainColor } = reqBody;
        console.log({ subcategoryId });
        // find category
        const category = await catogryAdminService_1.categoryAdminService.categoryNotExist(categoryId);
        // find subcategory
        const subcategory = await subcatgeoryModel_1.default.findOne({ _id: subcategoryId, category: category._id });
        if (!subcategory)
            throw new errorHandling_1.ResError("subcategory not found", 400);
        // create Product
        const product = new productModel_1.productModel({ productName, description, costPrice, soldPrice, mainColor, category: category._id, subcategory: subcategory._id });
        // handle product final price
        product.finalPrice = soldPrice - (soldPrice * ((discount || 0) / 100));
        // get images urls from uploadCreateProduct
        const { secure_urlForMain, public_idForMain, secure_urlForSmall, public_idForSmall } = await (0, productImageUpload_1.uploadCreateProduct)(category, subcategory, product, buffer);
        product.mainImage.public_id = public_idForMain;
        product.mainImage.secure_url = secure_urlForMain;
        product.smallImage.public_id = public_idForSmall;
        product.smallImage.secure_url = secure_urlForSmall;
        product.createdBy = userData._id;
        await product.save();
        return product;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async updateOne(productId, reqBody, buffer, userData) {
        const product = await this.productNotExist(productId);
        product.set(reqBody);
        console.log({ product });
        const { discount, soldPrice } = reqBody;
        discount || soldPrice ? product.finalPrice =
            (soldPrice || product.soldPrice) - (((discount || product.discount) / 100) * (soldPrice || product.soldPrice))
            : product.finalPrice;
        if (buffer) {
            console.log({ buffer });
            const { secure_urlForMain, public_idForMain, secure_urlForSmall, public_idForSmall } = await (0, productImageUpload_1.uploadUpdateProduct)(product, buffer);
            product.mainImage.public_id = public_idForMain;
            product.mainImage.secure_url = secure_urlForMain;
            product.smallImage.public_id = public_idForSmall;
            product.smallImage.secure_url = secure_urlForSmall;
        }
        product.updatedBy = userData._id;
        await product.save();
        return product;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteOne(productId, isDeleted, userData) {
        const product = await productModel_1.productModel.findByIdAndUpdate({ _id: productId }, { isDeleted }, { new: true });
        product.updateBy = userData._id;
        return product;
    }
}
exports.productAdminService = new ProductAdminService();
