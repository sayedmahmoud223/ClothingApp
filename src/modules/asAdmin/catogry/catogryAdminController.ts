import { NextFunction, Request, Response } from "express";
import { categoryController } from "../../asUser/catogry/catogryController";
import { categoryAdminService } from "./catogryAdminService";
import { ResError } from "../../../utils/errorHandling";



class CategoryAdminController {

    async readAll(req: Request, res: Response, next: NextFunction) {
        const data = await categoryController.readAll(req, res, next)
        return res.status(200).json({ Success: true, message: "Success", data })
    }

    async create(req: Request, res: Response, next: NextFunction) {
        if (!req.decoded) {
            return next(new ResError("userData not found", 400))
        }
        const data = await categoryAdminService.create(req.body, req.file, req.decoded)
        return res.status(201).json({ Success: true, message: "Success", data })
    }

    async updateOne(req: Request, res: Response, next: NextFunction) {
        const { categoryId } = req.params
        const { name } = req.body
        let buffer: any;
        if (req.file?.buffer) {
            buffer = req?.file?.buffer
        }
        if (!req.decoded) {
            return next(new ResError("userData not found", 400))
        }
        const data = await categoryAdminService.updateOne(categoryId, name, buffer, req.decoded)
        return res.status(200).json({ Success: true, message: "Success", data })
    }

    async deleteOne(req: Request, res: Response, next: NextFunction) {
        const data = await categoryAdminService.deleteOne(req.params.categoryId)
        return res.status(200).json({ Success: true, message: "Success", data })
    }

}

export const categoryAdminController: CategoryAdminController = new CategoryAdminController()