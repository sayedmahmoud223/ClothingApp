import categoryModel, { ICategory } from "../../../DB/models/catgeoryModel";
import { ResError } from "../../../utils/errorHandling";
import { ICreateCategory } from "./IcatogryAdmin";
import cloudinary from "../../../utils/cloudinary"
import { randomUUID } from "crypto";
import { UploadApiResponse } from "cloudinary";
import sharp from "sharp";
import { tokenPayload } from "../../../type";
import { updateCategoryImage } from "./handleCategoryImage";
import { productModel } from "../../../DB/models/productModel";
import subcategoryModel from "../../../DB/models/subcatgeoryModel";

class CategoryAdminService {
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async categoryExist(name: string) {
        if (await categoryModel.findOne({ name })) throw new ResError("catogry is already exist", 400)
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async categoryNotExist(categoryId: string) {
        const category = await categoryModel.findById({ _id: categoryId })
        if (!category) throw new ResError("catogry is not found", 400)
        return category
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    async findCategoryWithName(categoryName: string) {
        const category = await categoryModel.findOne({ name: categoryName })
        if (!category) throw new ResError("catogry is not found", 400)
        return category
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async create(reqBody: ICreateCategory, reqFile: any, userData: tokenPayload) {
        const { name } = reqBody
        const { _id } = userData
        await this.categoryExist(name)
        // Resize image using Sharp
        const resizedImageBuffer = await sharp(reqFile.buffer)
            .resize(400, 400) // Resize to 500x500 pixels (adjust as needed)
            .toFormat("webp") // Convert to WebP for better compression
            .toBuffer();

        // Upload to Cloudinary
        const uploadResponse: UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: `clothing/category/${name}`, format: "webp" },
                (error, result: any) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(resizedImageBuffer);
        });
        if (!uploadResponse.secure_url || !uploadResponse.public_id) {
            throw new ResError("Image not uploaded", 400);
        }
        const category: any = await categoryModel.create({ name, createdBy: _id, image: { public_id: uploadResponse.public_id, secure_url: uploadResponse.secure_url } })
        if (!category) throw new ResError("category not Created", 400)
        return category
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async updateOne(categoryId: string, name: string, buffer: string, userData: tokenPayload) {
        const category = await this.categoryNotExist(categoryId)
        const { _id } = userData
        console.log({ category });

        if (name && name !== category.name) {
            const oldFolder = `clothing/category/${category.name}`;
            const newFolder = `clothing/category/${name}`;
            // Rename the single image to move it to the new folder
            const newImagePublicId = newFolder + '/' + category.image.public_id.split('/').pop();
            console.log({ newImagePublicId });
            await cloudinary.uploader.rename(category.image.public_id, newImagePublicId);
            category.image.public_id = newImagePublicId
            category.image.secure_url = category.image.secure_url.replace(category.name, name)
            // Delete the old folder (optional, Cloudinary auto-deletes empty folders)
            await cloudinary.api.delete_folder(oldFolder).catch(() => {
                console.log(`Old folder "${oldFolder}" was already empty or does not exist.`);
            });
            // Update category name in DB
            category.name = name;
        }

        if (buffer) {
            await updateCategoryImage(category, buffer, name)
        }
        category.updatedBy = _id
        await category.save()
        return category
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    async deleteOne(categoryId: string, isDeleted:Boolean) {
        const category = await categoryModel.findByIdAndUpdate(categoryId, { isDeleted })
        if (!category) throw new ResError("category not found", 400)
        const subcategories = await subcategoryModel.updateMany({ category: categoryId }, { isCategoryDeleted:isDeleted })
        console.log({ subcategories });
        const products = await productModel.updateMany({ category: categoryId }, { isCategoryDeleted:isDeleted })
        console.log({ products });
        return category
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////////
}

export const categoryAdminService: CategoryAdminService = new CategoryAdminService()