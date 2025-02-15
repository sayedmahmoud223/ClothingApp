"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const userService_1 = require("./userService");
const errorHandling_1 = require("../../../utils/errorHandling");
class UserController {
    async readAll(req, res, next) {
        const users = await userService_1.userService.readAll(req.body.isDeleted, next);
        return res.status(200).json({ success: true, message: "Success", data: users });
    }
    async deleteOne(req, res, next) {
        const user = await userService_1.userService.deleteOne(req.body);
        if (!user)
            return next(new errorHandling_1.ResError("user not exist", 400));
        return res.status(200).json({ success: true, message: "Success", data: user });
    }
    async updateOne(req, res, next) {
        const user = await userService_1.userService.updateOne(req.body);
        if (!user)
            return next(new errorHandling_1.ResError("user not exist", 400));
        return res.status(200).json({ success: true, message: "Success", data: user });
    }
}
exports.userController = new UserController();
