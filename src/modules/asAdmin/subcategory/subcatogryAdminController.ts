import { NextFunction, Request, Response } from "express";
import { subcategoryAdminService } from "./subcatogryAdminService";
import { ResError } from "../../../utils/errorHandling";



class SubCategoryAdminController {

    // async readAll(req: Request, res: Response, next: NextFunction) {
    //     const { data, allCount, currentPage, size } = await subcategoryAdminService.readAll(req)
    //     return res.status(200).json({ Success: true, message: "Success", pagination: { count: allCount, currentPage, size }, data })
    // }

    async readSubcategoryForOneCategory(req: Request, res: Response, next: NextFunction) {
        const { categoryId } = req.params
        console.log({ categoryId });
        const { data, categoryName, allCount, currentPage, size, allPages } = await subcategoryAdminService.readSubcategoryForOneCategory(req, categoryId)
        return res.status(200).json({ Success: true, message: "Success", pagination: { count: allCount, currentPage, size, allPages }, categoryName, data })
    }

    async create(req: Request, res: Response, next: NextFunction) {
        if (!req.decoded) return next(new ResError("userData not found", 400))
        if (!req.file) return next(new ResError("enter subcategory image", 400))
        const { categoryId } = req.params
        const { name } = req.body
        const { buffer } = req.file
        console.log({ file: req.file });
        const data = await subcategoryAdminService.create(name, categoryId, buffer, req.decoded)
        return res.status(201).json({ Success: true, message: "Success", data })
    }

    async updateOne(req: Request, res: Response, next: NextFunction) {
        const { subcategoryId, categoryId } = req.params
        const { name } = req.body
        let buffer: any;
        if (req.file?.buffer) {
            buffer = req?.file?.buffer
        }
        if (!req.decoded) {
            return next(new ResError("userData not found", 400))
        }
        const data = await subcategoryAdminService.updateOne(subcategoryId, categoryId, name, buffer, req.decoded)
        return res.status(200).json({ Success: true, message: "Success", data })
    }

    async deleteOne(req: Request, res: Response, next: NextFunction) {
        const { isDeleted } = req.body
        console.log({ isDeleted });

        const data = await subcategoryAdminService.deleteOne(req.params.subcategoryId, req.params.categoryId, isDeleted)
        return res.status(200).json({ Success: true, message: "Success", data })
    }

}

export const subcategoryAdminController: SubCategoryAdminController = new SubCategoryAdminController()