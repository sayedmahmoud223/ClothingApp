import { Types } from "mongoose";

export interface ICreateVariantBody {
    productId?: Types.ObjectId; // Optional Product ID
    colorName: string; // Name of the color
    avaliable: IAvailable[]; // Available sizes and stock
    subImages: ISubImages[]
}

export interface ICreateVariantFile {
    subImages: IImage
}

export interface IAvailable {
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL'; // Valid size values
    stock: number; // Stock quantity
}

export interface ISubImages {
    secure_url: string; // Image URL
    public_id: string; // Cloudinary (or other storage) public ID
}

export interface IImage {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    buffer: any
    size: number
    path: string
}

export interface IParams {
    productId: string,
    variantId: string
}

