"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productAdminController = void 0;
const productAdminService_1 = require("./productAdminService");
const errorHandling_1 = require("../../../utils/errorHandling");
class ProductAdminController {
    async readAll(req, res, next) {
        const { data, allCount, currentPage, size } = await productAdminService_1.productAdminService.readAll(req);
        return res.status(200).json({ Success: true, message: "Success", pagination: { count: allCount, currentPage, size }, data });
    }
    async create(req, res, next) {
        if (!req.decoded) {
            return next(new errorHandling_1.ResError("userData not found", 400));
        }
        let { buffer } = req.file;
        const data = await productAdminService_1.productAdminService.create(req.body, buffer, req.decoded);
        return res.status(201).json({ Success: true, message: "Success", data });
    }
    async updateOne(req, res, next) {
        if (!req.decoded) {
            return next(new errorHandling_1.ResError("userData not found", 400));
        }
        const { productId } = req.params;
        let { buffer } = req.file;
        const data = await productAdminService_1.productAdminService.updateOne(productId, req.body, buffer, req.decoded);
        return res.status(200).json({ Success: true, message: "Success", data });
    }
    async deleteOne(req, res, next) {
        if (!req.decoded) {
            return next(new errorHandling_1.ResError("userData not found", 400));
        }
        const { productId } = req.params;
        const { isDeleted } = req.body;
        const data = await productAdminService_1.productAdminService.deleteOne(productId, isDeleted, req.decoded);
        return res.status(200).json({ Success: true, message: "Success", data });
    }
}
exports.productAdminController = new ProductAdminController();
