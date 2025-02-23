import { NextFunction, Request, Response } from "express";
import { variantAdminService } from "./variantsAdminService";
import { ResError } from "../../../utils/errorHandling";
import { IImage } from "./IVariantsAdmin";


class VariantAdminController {

    // async readAll(req: Request, res: Response, next: NextFunction) {
    //     const data = await variantController.readAll(req, res, next)
    //     return res.status(200).json({ Success: true, message: "Success", data })
    // }

    async createController(req: Request, res: Response, next: NextFunction) {
        const { productId } = req.params
        const files: Express.Multer.File[] = Array.isArray(req.files) ? req.files : [];
        const data = await variantAdminService.createService(productId, req.body, files)
        return res.status(201).json({ Success: true, message: "Success", data })
    }

    async updateOne(req: Request, res: Response, next: NextFunction) {
        const { productId, variantId } = req.params
        const files: Express.Multer.File[] = Array.isArray(req.files) ? req.files : [];
        const data = await variantAdminService.updateOne({ productId, variantId }, req.body, files)
        return res.status(200).json({ Success: true, message: "Success", data })
    }

    async addAvaliableToVariant(req: Request, res: Response, next: NextFunction) {
        const { productId, variantId } = req.params
        const { avaliable } = req.body

        const data = await variantAdminService.addAvaliableToVariant({ productId, variantId }, avaliable)
        return res.status(200).json({ Success: true, message: "Success", data })
    }

    async deleteOneFromAvaliable(req: Request, res: Response, next: NextFunction) {
        const { productId, variantId } = req.params
        const { avaliableId } = req.body
        const data = await variantAdminService.deleteOneFromAvaliable({ productId, variantId }, avaliableId)
        return res.status(200).json({ Success: true, message: "Success", data })
    }

    async deleteOne(req: Request, res: Response, next: NextFunction) {
        const data = await variantAdminService.deleteOne()
        return res.status(200).json({ Success: true, message: "Success", data })
    }

}

export const variantAdminController: VariantAdminController = new VariantAdminController()