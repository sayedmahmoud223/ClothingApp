"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const productSchema = new mongoose_1.Schema({
    productName: { type: String, trim: true, required: [true, 'ProductName is required'], min: [2, 'minimum length 2 char'], max: [30, 'max length 2 char'] },
    description: { type: String, trim: true, required: [true, 'ProductName is required'], min: [2, 'minimum length 2 char'] },
    category: { type: mongoose_1.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: mongoose_1.Types.ObjectId, ref: "Subcategory", required: true },
    costPrice: { type: Number, required: true, default: 0 },
    soldPrice: { type: Number, required: [true, 'price is required'], default: 0 },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true, default: 0 },
    mainImage: { secure_url: { type: String, required: true, }, public_id: { type: String, required: true, } },
    smallImage: { secure_url: { type: String, required: true, }, public_id: { type: String, required: true, } },
    mainColor: { type: String, required: true },
    // enum: ['Black', 'Gray', 'White', 'Brown', 'Beige', 'Red', 'Pink', 'Orange', 'Yellow', 'Ivory', 'Green', 'Blue', 'Purple', 'Gold', 'Silver', 'Multi'],
    variants: [{ type: mongoose_1.Types.ObjectId, ref: "Variant" }],
    createdBy: { type: mongoose_1.Types.ObjectId, ref: "User", requierd: true },
    updatedBy: { type: mongoose_1.Types.ObjectId, ref: "User", requierd: true },
    isDeleted: { type: Boolean, default: false },
    isCategoryDeleted: { type: Boolean, default: false },
    isSubcategoryDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
productSchema.index({ productName: 1 }, { unique: true }); // Prevent duplicate product names
productSchema.index({ soldPrice: 1 }); // Price-based filtering
productSchema.index({ description: "text" }); // Full-text search
productSchema.index({ mainCiolor: 1 }); // Full-text search
productSchema.pre(['find', 'findOne', "countDocuments"], function () {
    this.where({ isDeleted: false, isCategoryDeleted: false, isSubcategoryDeleted: false });
});
// productSchema.pre(['find', 'findOne', 'findOneAndDelete', 'findOneAndUpdate', 'updateOne'], function (next) {
//     this.populate([
//         {
//             path: "variants",
//         },
//         {
//             path: "category",
//         }
//     ])
//     next()
// })
// productSchema.virtual("colors").get(function () {
//     const colors: string[] = []
//     this.variants?.forEach(variant => {
//         if (variant?.colorName ? !colors.includes(variant.colorName) : null) {
//             colors.push(variant.colorName);
//         }
//     });
//     return colors
// });
// productSchema.virtual("sizes").get(function () {
//     let sizes = []
//     this.variants?.forEach(variant => {
//         variant?.avalible?.forEach((ele) => {
//             if (ele?.size && !sizes.includes(ele.size)) {
//                 sizes.push(ele.size)
//             }
//         })
//     });
//     return sizes
// })
// productSchema.virtual("stock").get(function () {
//     let totalStock = 0
//     this.variants?.forEach(variant => {
//         variant?.avalible?.forEach((ele) => {
//             if (ele?.stock) {
//                 totalStock += ele.stock
//             }
//         })
//     });
//     return totalStock
// })
exports.productModel = mongoose_1.default.models.Product || (0, mongoose_1.model)("Product", productSchema);
// // const variantSchema = new Schema({
// //     color: { type: String, enum: ['Black', 'Gray', 'White', 'Brown', 'Beige', 'Red', 'Pink', 'Orange', 'Yellow', 'Ivory', 'Green', 'Blue', 'Purple', 'Gold', 'Silver', 'Multi'], required: true },
// //     size: { type: String, enum: ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'], required: true },
// //     image: String,
// //     sku: String,
// //     stock: { type: Number, required: true }
// // });
// // const variantsSchema = new Schema(
// //                 {
// //                     productId: { type: Types.ObjectId, ref: "Product", required: true },
// //                     variants: [variantSchema]
// //                 },
// //                 {
// //                     timestamps: true
// //                 }
// //             )
// export let variantSchema = new Schema({
//     productId: { type: Types.ObjectId, ref: "Product" },
//     colorName: { type: String, enum: ['Black', 'Gray', 'White', 'Brown', 'Beige', 'Red', 'Pink', 'Orange', 'Yellow', 'Ivory', 'Green', 'Blue', 'Purple', 'Gold', 'Silver', 'Multi'], required: true },
//     avalible: [{
//         size: { type: String, enum: ['XS', 'S', 'M', 'L', 'XL', '2XL'], required: true },
//         stock: Number,
//     }],
//     subImages: { type: [Object] },
//     imageColor: {
//         colorName: "",
//         image: ""
//     }
// })
// export let varinatModel = model("Variant", variantSchema) || mongoose.models.Variant  
