"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variantAdminController = void 0;
const variantsAdminService_1 = require("./variantsAdminService");
class VariantAdminController {
    // async readAll(req: Request, res: Response, next: NextFunction) {
    //     const data = await variantController.readAll(req, res, next)
    //     return res.status(200).json({ Success: true, message: "Success", data })
    // }
    async createController(req, res, next) {
        const { productId } = req.params;
        const files = Array.isArray(req.files) ? req.files : [];
        const data = await variantsAdminService_1.variantAdminService.createService(productId, req.body, files);
        return res.status(201).json({ Success: true, message: "Success", data });
    }
    async updateOne(req, res, next) {
        const { productId, variantId } = req.params;
        const files = Array.isArray(req.files) ? req.files : [];
        const data = await variantsAdminService_1.variantAdminService.updateOne({ productId, variantId }, req.body, files);
        return res.status(200).json({ Success: true, message: "Success", data });
    }
    async addAvaliableToVariant(req, res, next) {
        const { productId, variantId } = req.params;
        const { avaliable } = req.body;
        const data = await variantsAdminService_1.variantAdminService.addAvaliableToVariant({ productId, variantId }, avaliable);
        return res.status(200).json({ Success: true, message: "Success", data });
    }
    async deleteOneFromAvaliable(req, res, next) {
        const { productId, variantId } = req.params;
        const { avaliableId } = req.body;
        const data = await variantsAdminService_1.variantAdminService.deleteOneFromAvaliable({ productId, variantId }, avaliableId);
        return res.status(200).json({ Success: true, message: "Success", data });
    }
    async deleteOne(req, res, next) {
        const { productId, variantId } = req.params;
        const data = await variantsAdminService_1.variantAdminService.deleteOne({ productId, variantId });
        return res.status(200).json({ Success: true, message: "Success", data });
    }
}
exports.variantAdminController = new VariantAdminController();
