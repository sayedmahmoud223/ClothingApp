import { NextFunction, Request, Response } from "express";
import { userService } from "./userService";
import { ResError } from "../../../utils/errorHandling";


class UserController {
    async readAll(req: Request, res: Response, next: NextFunction) {
        const users = await userService.readAll(req.body.isDeleted, next)
        return res.status(200).json({ success: true, message: "Success", data: users })
    }

    async deleteOne(req: Request, res: Response, next: NextFunction) {
        const user = await userService.deleteOne(req.body)
        if (!user) return next(new ResError("user not exist", 400))
        return res.status(200).json({ success: true, message: "Success", data: user })
    }

    async updateOne(req: Request, res: Response, next: NextFunction) {
        const user = await userService.updateOne(req.body)
        if (!user) return next(new ResError("user not exist", 400))
        return res.status(200).json({ success: true, message: "Success", data: user })
    }
}

export const userController: UserController = new UserController()