"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authService_1 = require("./authService");
const errorHandling_1 = require("../../../utils/errorHandling");
const methodsWillUsed_1 = require("../../../utils/methodsWillUsed");
const userModel_1 = __importDefault(require("../../../DB/models/userModel"));
class AuthController {
    async signup(req, res, next) {
        const newUser = await authService_1.authService.signup(req.body, next);
        return res.status(201).json({ success: true, message: "Account Register Successful" });
    }
    async confirmEmail(req, res, next) {
        await authService_1.authService.confirmEmail(req.params, next);
        return res.status(200).redirect("http://localhost:3000/login");
    }
    async login(req, res, next) {
        const { user, token, refresh_token } = await authService_1.authService.login(req.body, next);
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        });
        res.cookie("refresh_token", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({
            success: true,
            message: "Success", data: {
                _id: user._id,
                userName: user.userName,
                email: user.email, role: user.role
            }
        });
    }
    async refreshToken(req, res, next) {
        const { refresh_token } = req.cookies;
        if (!refresh_token)
            throw new errorHandling_1.ResError("Go to login", 400);
        // Verify refresh token
        const verifyToken = methodsWillUsed_1.methodsWillUsed.verifyToken({ token: refresh_token });
        if (!verifyToken)
            throw new errorHandling_1.ResError("Invalid refresh token", 400);
        // Check if user exists
        const userExist = await userModel_1.default.findById(verifyToken._id);
        if (!userExist)
            throw new errorHandling_1.ResError("User does not exist", 400);
        // Generate new access & refresh tokens
        const new_access_token = methodsWillUsed_1.methodsWillUsed.generateToken({
            payload: { _id: userExist._id, email: userExist.email, role: userExist.role },
            expiresIn: "15m"
        });
        const new_refresh_token = methodsWillUsed_1.methodsWillUsed.generateToken({
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
exports.authController = new AuthController();
