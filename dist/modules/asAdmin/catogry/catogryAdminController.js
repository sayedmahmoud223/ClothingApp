"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryAdminController = void 0;
const catogryController_1 = require("../../asUser/catogry/catogryController");
const catogryAdminService_1 = require("./catogryAdminService");
const errorHandling_1 = require("../../../utils/errorHandling");
class CategoryAdminController {
    async readAll(req, res, next) {
        const data = await catogryController_1.categoryController.readAll(req, res, next);
        return res.status(200).json({ Success: true, message: "Success", data });
    }
    async create(req, res, next) {
        if (!req.decoded) {
            return next(new errorHandling_1.ResError("userData not found", 400));
        }
        const data = await catogryAdminService_1.categoryAdminService.create(req.body, req.file, req.decoded);
        return res.status(201).json({ Success: true, message: "Success", data });
    }
    async updateOne(req, res, next) {
        const { categoryId } = req.params;
        const { name } = req.body;
        let buffer;
        if (req.file?.buffer) {
            buffer = req?.file?.buffer;
        }
        if (!req.decoded) {
            return next(new errorHandling_1.ResError("userData not found", 400));
        }
        const data = await catogryAdminService_1.categoryAdminService.updateOne(categoryId, name, buffer, req.decoded);
        return res.status(200).json({ Success: true, message: "Success", data });
    }
    async deleteOne(req, res, next) {
        const data = await catogryAdminService_1.categoryAdminService.deleteOne(req.params.categoryId);
        return res.status(200).json({ Success: true, message: "Success", data });
    }
}
exports.categoryAdminController = new CategoryAdminController();
