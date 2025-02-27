"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const authService_1 = require("./authService");
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
        res.cookie("rerfresh-token", refresh_token, {
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
}
exports.authController = new AuthController();
