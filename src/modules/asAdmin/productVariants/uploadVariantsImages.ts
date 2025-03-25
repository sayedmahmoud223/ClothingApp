import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../../utils/cloudinary"
import sharp from "sharp";
import { IImage } from "./IVariantsAdmin";
import { randomUUID } from "crypto";


export const uploadvariantImages = async (reqFiles: IImage[], product: any, variant: any, colorName: string) => {
    for (const [index, img] of reqFiles.entries()) {
        const resizedImageBuffer = await sharp(img.buffer)
            .resize(100, 100)
            .toFormat("webp")
            .toBuffer();

        console.log("Uploading image to Cloudinary...");
        const uploadResponse: UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: `clothing/${product.category.name}/${product.productName}/${colorName.toLowerCase()}`, format: "webp", public_id: `${randomUUID()}_${index}` },
                (error, result: any) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(resizedImageBuffer);
        });
        variant.subImages.push({ secure_url: uploadResponse.secure_url, public_id: uploadResponse.public_id });
    }
    variant.markModified("subImages");  // Tell Mongoose the array was updated
    await variant.save();
};


export const uploadUpdatevariantImages = async (reqFiles: IImage[], product: any, variant: any, colorName: string) => {

    if (variant.subImages.length > 0) {
        console.log("Deleting old images...");
        for (const img of variant.subImages) {
            await cloudinary.uploader.destroy(img.public_id);
        }
        variant.subImages = []; // Clear the array
    }

    for (const [index, img] of reqFiles.entries()) {
        const resizedImageBuffer = await sharp(img.buffer)
            .resize(100, 100)
            .toFormat("webp")
            .toBuffer();

        console.log("Uploading image to Cloudinary...");
        const uploadResponse: UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: `clothing/${product.category.name}/${product.productName}/${colorName.toLowerCase()}`, format: "webp", public_id: `${randomUUID()}_${index}` },
                (error, result: any) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(resizedImageBuffer);
        });
        variant.subImages.push({ secure_url: uploadResponse.secure_url, public_id: uploadResponse.public_id });
    }
    variant.markModified("subImages");  // Tell Mongoose the array was updated
    await variant.save();
};