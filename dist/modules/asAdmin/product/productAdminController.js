"use strict";
// import { NextFunction, Request, Response } from "express";
// import { ApiFeature } from "../../../utils/apiFeatures";
// import { productAdminService } from "./productAdminService";
// // import { productController } from "../../asUser/product/productController";
// import { ResError } from "../../../utils/errorHandling";
Object.defineProperty(exports, "__esModule", { value: true });
// class ProductAdminController {
//     // async readAll(req: Request, res: Response, next: NextFunction) {
//     //     const data = await productController.readAll(req, res, next)
//     //     return res.status(200).json({ Success: true, message: "Success", data })
//     // }
//     async create(req: Request, res: Response, next: NextFunction) {
//         const
//         const data = await productAdminService.create(req.body, req.file)
//         return res.status(200).json({ Success: true, message: "Success", data })
//     }
//     async updateOne(req: Request, res: Response, next: NextFunction) {
//         const { name } = req.body
//         const { productId } = req.params
//         let path: any;
//         if (req.file) {
//             path = req.file.path
//         }
//         const data = await productAdminService.updateOne(productId, name, path)
//         return res.status(200).json({ Success: true, message: "Success", data })
//     }
//     async deleteOne(req: Request, res: Response, next: NextFunction) {
//         const { productId } = req.params
//         const data = await productAdminService.deleteOne(productId)
//         return res.status(200).json({ Success: true, message: "Success", data })
//     }
// }
// export const productAdminController: ProductAdminController = new ProductAdminController()
// // import { nanoid } from "nanoid";
// // import cloudinary from "../../../utils/cloudinary.js";
// // import productModel from "../../../../DB/model/product.model.js";
// // import { ResError } from "../../../utils/errorHandling.js";
// // import { ApiFeature } from "../../../utils/ApiFeatures.js";
// // import { Request, Response, NextFunction } from "express";
// // export const productList = async (req: Request, res: Response, next: NextFunction) => {
// //     const mongooseQuery = new ApiFeature(productModel.find({}), req.query).paginate().filter().search().sort();
// //     const data = await mongooseQuery.mongooseQuery;
// //     return res.status(200).json({ message: "Done", data });
// // };
// // export const createproduct = async (req: Request, res: Response, next: NextFunction) => {
// //     const { name } = req.body;
// //     req.body.customId = nanoid(6);
// //     let { public_id, secure_url } = await cloudinary.uploader.upload(req.file?.path as string, { folder: `luxxete/product/${req.body.customId}` });
// //     const data = await productModel.create({
// //         name,
// //         customId: req.body.customId,
// //         image: { secure_url, public_id }
// //     });
// //     return res.status(201).json({ message: "Success", data });
// // };
// // export const updateproduct = async (req: Request, res: Response, next: NextFunction) => {
// //     const { productId } = req.params;
// //     const { name } = req.body;
// //     console.log({ name });
// //     const data = await productModel.findById(productId);
// //     if (!data) {
// //         return next(new ResError("Invalid product id", 400));
// //     }
// //     if (req.body.name) {
// //         data.name = req.body.name;
// //     }
// //     if (req.file) {
// //         const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path as string, { folder: `luxxete/product/${data.customId}` });
// //         await cloudinary.uploader.destroy(data.image.public_id);
// //         data.image = { secure_url, public_id };
// //     }
// //     await data.save();
// //     return res.status(200).json({ message: "Success", data });
// // };
