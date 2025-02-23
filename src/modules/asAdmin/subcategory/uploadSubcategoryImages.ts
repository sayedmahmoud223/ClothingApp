import sharp from "sharp";
import cloudinary from "../../../utils/cloudinary"
import { UploadApiResponse } from "cloudinary";
import { ISubcategory } from "../../../DB/models/subcatgeoryModel";
import { ICategory } from "../../../DB/models/catgeoryModel";
import { ResError } from "../../../utils/errorHandling";


export const uploadImageForCreateSubcategory = async (category: ICategory, name: any, buffer: string) => {
    const resizedImageBuffer = await sharp(buffer)
        .resize(400, 400) // Resize to 500x500 pixels (adjust as needed)
        .toFormat("webp") // Convert to WebP for better compression
        .toBuffer();

    // Upload to Cloudinary
    const uploadResponse: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: `clothing/${category.name}/subcategories/${name}`, format: "webp" },
            (error, result: any) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(resizedImageBuffer);
    });
    if (!uploadResponse.secure_url || !uploadResponse.public_id) {
        throw new ResError("Image not uploaded", 400);
    }
    return { secure_url: uploadResponse.secure_url, public_id: uploadResponse.public_id }
}



export const uploadImageForUpdateSubcategory = async (subcategory: ISubcategory, category: ICategory, name: string, buffer: string) => {
    await cloudinary.uploader.destroy(subcategory.image.public_id)
    const resizedImageBuffer = await sharp(buffer)
        .resize(400, 400) // Resize to 500x500 pixels (adjust as needed)
        .toFormat("webp") // Convert to WebP for better compression
        .toBuffer();

    // Upload to Cloudinary
    const uploadResponse: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: `clothing/${category.name}/subcategories/${name ? name : subcategory.name}`, format: "webp" },
            (error, result: any) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(resizedImageBuffer);
    });
    console.log("Buffer Size:", resizedImageBuffer.length);
    if (!uploadResponse.secure_url || !uploadResponse.public_id) {
        throw new ResError("Image not uploaded", 400);
    }

    subcategory.image.secure_url = uploadResponse.secure_url
    subcategory.image.public_id = uploadResponse.public_id
}