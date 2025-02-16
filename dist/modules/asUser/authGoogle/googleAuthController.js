"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authWithGoogle = void 0;
const googleAuthService_1 = require("./googleAuthService");
class AuthWithGoogle {
    async setGoogleConfig(req, res, next) {
        const { code } = req.query;
        const { refresh_token, access_token } = await googleAuthService_1.googleauthService.authWithGoogleService(code);
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        res.cookie("rerfresh-token", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.redirect("http://localhost:3050/api/v1/admin/users");
    }
}
exports.authWithGoogle = new AuthWithGoogle();
