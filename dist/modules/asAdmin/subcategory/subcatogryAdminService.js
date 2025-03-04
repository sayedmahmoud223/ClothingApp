"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcategoryAdminService = void 0;
const errorHandling_1 = require("../../../utils/errorHandling");
const cloudinary_1 = __importDefault(require("../../../utils/cloudinary"));
const catogryAdminService_1 = require("../catogry/catogryAdminService");
const subcatgeoryModel_1 = __importDefault(require("../../../DB/models/subcatgeoryModel"));
const uploadSubcategoryImages_1 = require("./uploadSubcategoryImages");
const apiFeatures_1 = require("../../../utils/apiFeatures");
const productModel_1 = require("../../../DB/models/productModel");
class SubcategoryAdminService {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async subcategoryExist(name) {
        if (await subcatgeoryModel_1.default.findOne({ name }))
            throw new errorHandling_1.ResError("catogry is already exist", 400);
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async subcategoryNotExist(subcategoryId, categoryId) {
        const subcategory = await subcatgeoryModel_1.default.findOne({ _id: subcategoryId, category: categoryId });
        if (!subcategory)
            throw new errorHandling_1.ResError("subcatogry not found", 400);
        return subcategory;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // async readAll(reqParams: any) {
    //     const readAll = new ApiFeature(subcategoryModel.find(), reqParams.query).paginate().filter().search().sort();
    //     const data = await readAll.mongooseQuery
    //     const allCount = await subcategoryModel.countDocuments()
    //     return { data, allCount, currentPage: readAll.queryData.page, size: readAll.queryData.size }
    // }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async readSubcategoryForOneCategory(reqParams, categoryId) {
        const readAll = new apiFeatures_1.ApiFeature(subcatgeoryModel_1.default.find({ category: categoryId }), reqParams.query).paginate().filter().search().sort();
        const data = await readAll.mongooseQuery;
        const allCount = await subcatgeoryModel_1.default.countDocuments();
        const allPages = Math.ceil(allCount / readAll.queryData.size);
        return { data, allCount, currentPage: readAll.queryData.page, size: readAll.queryData.size, allPages };
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async create(name, categoryId, buffer, userData) {
        const { _id } = userData;
        const category = await catogryAdminService_1.categoryAdminService.categoryNotExist(categoryId);
        const { secure_url, public_id } = await (0, uploadSubcategoryImages_1.uploadImageForCreateSubcategory)(category, name, buffer);
        const subcategory = await subcatgeoryModel_1.default.create({ name, createdBy: _id, category: category._id, image: { public_id, secure_url } });
        category.subcategories.push(subcategory._id);
        await category.save();
        if (!subcategory)
            throw new errorHandling_1.ResError("subcategory not Created", 400);
        return subcategory;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async updateOne(subcategoryId, categoryId, name, buffer, userData) {
        const category = await catogryAdminService_1.categoryAdminService.categoryNotExist(categoryId);
        const subcategory = await this.subcategoryNotExist(subcategoryId, categoryId);
        const { _id } = userData;
        console.log({ subcategory });
        if (name && name !== subcategory.name) {
            const oldFolder = `clothing/${category.name}/subcategories/${subcategory.name}`;
            const newFolder = `clothing/${category.name}/subcategories/${name}`;
            // Rename the single image to move it to the new folder
            const newImagePublicId = newFolder + '/' + subcategory.image.public_id.split('/').pop();
            await cloudinary_1.default.uploader.rename(subcategory.image.public_id, newImagePublicId);
            subcategory.image.public_id = newImagePublicId;
            subcategory.image.secure_url = subcategory.image.secure_url.replace(subcategory.name, name);
            // Delete the old folder (optional, Cloudinary auto-deletes empty folders)
            await cloudinary_1.default.api.delete_folder(oldFolder).catch(() => {
                console.log(`Old folder "${oldFolder}" was already empty or does not exist.`);
            });
            // Update subcategory name in DB
            subcategory.name = name;
        }
        if (buffer) {
            await (0, uploadSubcategoryImages_1.uploadImageForUpdateSubcategory)(subcategory, category, name, buffer);
        }
        subcategory.updatedBy = _id;
        await subcategory.save();
        return subcategory;
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteOne(subcategoryId, categoryId, isDeleted) {
        const subcategory = await subcatgeoryModel_1.default.findOneAndUpdate({ _id: subcategoryId, category: categoryId }, { isDeleted }, { new: true });
        const products = await productModel_1.productModel.updateMany({ subcategory: subcategoryId }, { isSubcategoryDeleted: isDeleted });
        return subcategory;
    }
}
exports.subcategoryAdminService = new SubcategoryAdminService();
