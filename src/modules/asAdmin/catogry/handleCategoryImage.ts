import sharp from "sharp";
import cloudinary from "../../../utils/cloudinary"
import { UploadApiResponse } from "cloudinary";
import { ResError } from "../../../utils/errorHandling";
import { ICategory } from "../../../DB/models/catgeoryModel";

export const updateCategoryImage = async (category: ICategory, buffer: any, name: string) => {
    await cloudinary.uploader.destroy(category.image.public_id)
    const resizedImageBuffer = await sharp(buffer)
        .resize(400, 400) // Resize to 500x500 pixels (adjust as needed)
        .toFormat("webp") // Convert to WebP for better compression
        .toBuffer();

    // Upload to Cloudinary
    const uploadResponse: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: `clothing/category/${name ? name : category.name}`, format: "webp" },
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

    category.image.secure_url = uploadResponse.secure_url
    category.image.public_id = uploadResponse.public_id
}