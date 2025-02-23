import mongoose, { Schema, Types, model } from "mongoose";
import { IAvailable, ISubImages } from "../../modules/asAdmin/productVariants/IVariantsAdmin";


export interface IVariant {
    productId?: Types.ObjectId
    colorName: string
    avaliable: IAvailable[]
    subImages: ISubImages[]
}



export let variantSchema = new Schema<IVariant>({
    productId: { type: Types.ObjectId, ref: "Product" },
    colorName: { type: String, required: true },
    // enum: ['Black', 'Gray', 'White', 'Brown', 'Beige', 'Red', 'Pink', 'Orange', 'Yellow', 'Ivory', 'Green', 'Blue', 'Purple', 'Gold', 'Silver', 'Multi'], required: true },
    avaliable: [{
        size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', '2XL'], required: true },
        stock: Number
    }],
    subImages: [{ secure_url: String, public_id: String }]
})

export const variantModel = model("Variant", variantSchema) || mongoose.models.Variant  
