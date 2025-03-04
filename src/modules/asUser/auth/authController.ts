import { NextFunction, Response, Request } from "express";
import { authService } from "./authService";
import { ResError } from "../../../utils/errorHandling";
import { methodsWillUsed } from "../../../utils/methodsWillUsed";
import userModel from "../../../DB/models/userModel";



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
        res.cookie("refresh_token", refresh_token, {
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

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        const { refresh_token } = req.cookies;

        if (!refresh_token) throw new ResError("Go to login", 400);

        // Verify refresh token
        const verifyToken: any = methodsWillUsed.verifyToken({ token: refresh_token });

        if (!verifyToken) throw new ResError("Invalid refresh token", 400);

        // Check if user exists
        const userExist = await userModel.findById(verifyToken._id);
        if (!userExist) throw new ResError("User does not exist", 400);


        // Generate new access & refresh tokens
        const new_access_token = methodsWillUsed.generateToken({
            payload: { _id: userExist._id, email: userExist.email, role: userExist.role },
            expiresIn: "15m"
        });

        const new_refresh_token = methodsWillUsed.generateToken({
            payload: { _id: userExist._id },
            expiresIn: "7d"
        });

        // Set new cookies
        res.cookie("access_token", new_access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.cookie("refresh_token", new_refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: {
                _id: userExist._id,
                userName: userExist.userName,
                email: userExist.email,
                role: userExist.role,
            },
        });

    }


}


export const authController: AuthController = new AuthController()