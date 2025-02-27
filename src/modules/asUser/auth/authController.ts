import { NextFunction, Response, Request } from "express";
import { authService } from "./authService";



class AuthController {

    async signup(req: Request, res: Response, next: NextFunction) {
        const newUser = await authService.signup(req.body, next)
        return res.status(201).json({ success: true, message: "Account Register Successful" });
    }

    async confirmEmail(req: Request, res: Response, next: NextFunction) {
        await authService.confirmEmail(req.params, next)
        return res.status(200).redirect("http://localhost:3000/login")
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const { user, token, refresh_token } = await authService.login(req.body, next)
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("rerfresh-token", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            success: true,
            message: "Success", data: {
                _id: user._id,
                userName: user.userName,
                email: user.email, role: user.role
            }
        });
    }

}


export const authController: AuthController = new AuthController()