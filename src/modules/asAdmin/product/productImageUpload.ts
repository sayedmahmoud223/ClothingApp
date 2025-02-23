import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../../utils/cloudinary"
import sharp from "sharp";
import { ICategory } from "../../../DB/models/catgeoryModel";
import { ISubcategory } from "../../../DB/models/subcatgeoryModel";
import { IProduct } from "../../../DB/models/productModel";
import { ResError } from "../../../utils/errorHandling";

export const uploadCreateProduct = async (category: ICategory, subcategory: ISubcategory, product: IProduct, buffer: string) => {
    console.log({ buffer });
    if (!buffer || !buffer.length) {
        throw new Error('Invalid image buffer');
    }
    const image = sharp(buffer)
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
    const uploadMainResponse: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: `clothing/${category.name}/subcategories/${subcategory.name}/products/${product.productName}`, format: "webp" },
            (error, result: any) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(resizedMainImageBuffer);
    });

    const uploadSmallResponse: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: `clothing/${category.name}/subcategories/${subcategory.name}/products/${product.productName}`, format: "webp" },
            (error, result: any) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(resizedSmallImageBuffer);
    });

    if (!uploadMainResponse.secure_url || !uploadMainResponse.public_id || !uploadSmallResponse.secure_url || !uploadSmallResponse.public_id) {
        throw new ResError("Image not uploaded", 400);
    }
    return { secure_urlForMain: uploadMainResponse.secure_url, public_idForMain: uploadMainResponse.public_id, secure_urlForSmall: uploadSmallResponse.secure_url, public_idForSmall: uploadSmallResponse.public_id }
}


export const uploadUpdateProduct = async (product: any, buffer: string) => {

    await cloudinary.api.delete_resources([product.mainImage.public_id, product.smallImage.public_id])
    console.log({ bufferNew: buffer });

    if (!buffer || !buffer.length) {
        throw new Error('Invalid image buffer');
    }

    const image = sharp(buffer)

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
    const uploadMainResponse: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: `clothing/${product.category.name}/subcategories/${product.subcategory.name}/products/${product.productName}`, format: "webp" },
            (error, result: any) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(resizedMainImageBuffer);
    });

    const uploadSmallResponse: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: `clothing/${product.category.name}/subcategories/${product.subcategory.name}/products/${product.productName}`, format: "webp" },
            (error, result: any) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(resizedSmallImageBuffer);
    });

    if (!uploadMainResponse.secure_url || !uploadMainResponse.public_id || !uploadSmallResponse.secure_url || !uploadSmallResponse.public_id) {
        throw new ResError("Image not uploaded", 400);
    }
    return { secure_urlForMain: uploadMainResponse.secure_url, public_idForMain: uploadMainResponse.public_id, secure_urlForSmall: uploadSmallResponse.secure_url, public_idForSmall: uploadSmallResponse.public_id }
}