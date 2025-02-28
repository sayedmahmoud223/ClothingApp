import { NextFunction, Request, Response } from "express";
import { productAdminService } from "./productAdminService";
import { ResError } from "../../../utils/errorHandling";
import { IProductFile } from "./IProductAdmin";



class ProductAdminController {
    async readAll(req: Request, res: Response, next: NextFunction) {
        const { data, allCount, currentPage, size } = await productAdminService.readAll(req)
        return res.status(200).json({ Success: true, message: "Success", pagination: { count: allCount, currentPage, size },data })
    }

    async create(req: Request, res: Response, next: NextFunction) {
        if (!req.decoded) {
            return next(new ResError("userData not found", 400))
        }
        let { buffer }: any = req.file
        const data = await productAdminService.create(req.body, buffer, req.decoded)
        return res.status(201).json({ Success: true, message: "Success", data })
    }

    async updateOne(req: Request, res: Response, next: NextFunction) {
        if (!req.decoded) {
            return next(new ResError("userData not found", 400))
        }
        const { productId } = req.params
        let { buffer }: any = req.file;
        const data = await productAdminService.updateOne(productId, req.body, buffer, req.decoded)
        return res.status(200).json({ Success: true, message: "Success", data })
    }

    async deleteOne(req: Request, res: Response, next: NextFunction) {
        if (!req.decoded) {
            return next(new ResError("userData not found", 400))
        }
        const { productId } = req.params
        const { isDeleted } = req.body
        const data = await productAdminService.deleteOne(productId, isDeleted, req.decoded)
        return res.status(200).json({ Success: true, message: "Success", data })
    }
}

export const productAdminController: ProductAdminController = new ProductAdminController()









