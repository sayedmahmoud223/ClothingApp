import { ResError } from "../../../utils/errorHandling";
import cloudinary from "../../../utils/cloudinary"
import { tokenPayload } from "../../../type";
import { categoryAdminService } from "../catogry/catogryAdminService";
import subcategoryModel from "../../../DB/models/subcatgeoryModel";
import { uploadImageForCreateSubcategory, uploadImageForUpdateSubcategory } from "./uploadSubcategoryImages";
import { ApiFeature } from "../../../utils/apiFeatures";

class SubcategoryAdminService {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async subcategoryExist(name: string) {
        if (await subcategoryModel.findOne({ name })) throw new ResError("catogry is already exist", 400)
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async subcategoryNotExist(subcategoryId: string, categoryId: string) {
        const subcategory = await subcategoryModel.findOne({ _id: subcategoryId, category: categoryId })
        if (!subcategory) throw new ResError("subcatogry not found", 400)
        return subcategory
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async readAll(reqParams: any) {
        const readAll = new ApiFeature(subcategoryModel.find({}), reqParams.query).paginate().filter().search().sort();
        const data = await readAll.mongooseQuery
        const allCount = await subcategoryModel.countDocuments()
        return { data, allCount, currentPage: readAll.queryData.page, size: readAll.queryData.size }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async create(name: string, categoryId: string, buffer: any, userData: tokenPayload) {
        const { _id } = userData
        const category = await categoryAdminService.categoryNotExist(categoryId)
        const { secure_url, public_id } = await uploadImageForCreateSubcategory(category, name, buffer)
        const subcategory: any = await subcategoryModel.create({ name, createdBy: _id, category: category._id, image: { public_id, secure_url } })
        category.subcategories.push(subcategory._id)
        await category.save()
        if (!subcategory) throw new ResError("subcategory not Created", 400)
        return subcategory
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async updateOne(subcategoryId: string, categoryId: string, name: string, buffer: string, userData: tokenPayload) {
        const category = await categoryAdminService.categoryNotExist(categoryId)
        const subcategory = await this.subcategoryNotExist(subcategoryId, categoryId)
        const { _id } = userData
        console.log({ subcategory });

        if (name && name !== subcategory.name) {
            const oldFolder = `clothing/${category.name}/subcategories/${subcategory.name}`;
            const newFolder = `clothing/${category.name}/subcategories/${name}`;
            // Rename the single image to move it to the new folder
            const newImagePublicId = newFolder + '/' + subcategory.image.public_id.split('/').pop();
            await cloudinary.uploader.rename(subcategory.image.public_id, newImagePublicId);
            subcategory.image.public_id = newImagePublicId
            subcategory.image.secure_url = subcategory.image.secure_url.replace(subcategory.name, name)
            // Delete the old folder (optional, Cloudinary auto-deletes empty folders)
            await cloudinary.api.delete_folder(oldFolder).catch(() => {
                console.log(`Old folder "${oldFolder}" was already empty or does not exist.`);
            });
            // Update subcategory name in DB
            subcategory.name = name;
        }

        if (buffer) {
            await uploadImageForUpdateSubcategory(subcategory, category, name, buffer)
        }
        subcategory.updatedBy = _id
        await subcategory.save()
        return subcategory
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteOne(subcategoryId: string, categoryId: string) {
        const subcategory = await subcategoryModel.findOneAndDelete({ _id: subcategoryId, category: categoryId }).populate("category")
        console.log({ subcategory });
        if (!subcategory) throw new ResError("subcatogry not found", 400)
        await cloudinary.uploader.destroy(subcategory.image.public_id)
        await cloudinary.api.delete_folder(`clothing/${subcategory.category.name}/subcategories/${subcategory.name}`)
        console.log({ subcategory });
        return subcategory
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
}

export const subcategoryAdminService: SubcategoryAdminService = new SubcategoryAdminService()