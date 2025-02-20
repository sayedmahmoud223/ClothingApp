import mongoose, { Schema, Types, model } from "mongoose"


let productSchema = new Schema({
    ProductName: { type: String, trim: true, required: [true, 'ProductName is required'], min: [2, 'minimum length 2 char'], max: [30, 'max length 2 char'] },
    description: { type: String, trim: true, required: [true, 'ProductName is required'], min: [2, 'minimum length 2 char'] },
    slug: { type: String, required: false },
    category: { type: Types.ObjectId, ref: "Category",/* required: true*/ },
    costPrice: { type: Number, required: true, default: 0 },
    soldPrice: { type: Number, required: [true, 'price is required'], default: 0 },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true, default: 0 },
    mainImage: { type: Object, required: true },
    mainColor: { type: String, required: true },
    // enum: ['Black', 'Gray', 'White', 'Brown', 'Beige', 'Red', 'Pink', 'Orange', 'Yellow', 'Ivory', 'Green', 'Blue', 'Purple', 'Gold', 'Silver', 'Multi'],
    variants: [{ type: Types.ObjectId, ref: "Variant" }],
    customId: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// productSchema.pre(['find', 'findOne', 'findOneAndDelete', 'findOneAndUpdate', 'updateOne'], function () {
//     this.where({ isDeleted: false })
// })

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


export const productModel = mongoose.models.Product || model("Product", productSchema)











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