"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcategoryAdminController = void 0;
const subcatogryAdminService_1 = require("./subcatogryAdminService");
const errorHandling_1 = require("../../../utils/errorHandling");
class SubCategoryAdminController {
    // async readAll(req: Request, res: Response, next: NextFunction) {
    //     const data = await subcategoryController.readAll(req, res, next)
    //     return res.status(200).json({ Success: true, message: "Success", data })
    // }
    async create(req, res, next) {
        if (!req.decoded)
            return next(new errorHandling_1.ResError("userData not found", 400));
        if (!req.file)
            return next(new errorHandling_1.ResError("enter subcategory image", 400));
        const { categoryId } = req.params;
        const { name } = req.body;
        const { buffer } = req.file;
        console.log({ file: req.file });
        const data = await subcatogryAdminService_1.subcategoryAdminService.create(name, categoryId, buffer, req.decoded);
        return res.status(201).json({ Success: true, message: "Success", data });
    }
    async updateOne(req, res, next) {
        const { subcategoryId, categoryId } = req.params;
        const { name } = req.body;
        let buffer;
        if (req.file?.buffer) {
            buffer = req?.file?.buffer;
        }
        if (!req.decoded) {
            return next(new errorHandling_1.ResError("userData not found", 400));
        }
        const data = await subcatogryAdminService_1.subcategoryAdminService.updateOne(subcategoryId, categoryId, name, buffer, req.decoded);
        return res.status(200).json({ Success: true, message: "Success", data });
    }
    async deleteOne(req, res, next) {
        const data = await subcatogryAdminService_1.subcategoryAdminService.deleteOne(req.params.subcategoryId, req.params.categoryId);
        return res.status(200).json({ Success: true, message: "Success", data });
    }
}
exports.subcategoryAdminController = new SubCategoryAdminController();
