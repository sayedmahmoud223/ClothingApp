import passport from "passport"
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from "jsonwebtoken"
import userModel from "../../../DB/models/userModel";
import { NextFunction, Request, response, Response } from "express";
import { googleauthService } from "./googleAuthService";
class AuthWithGoogle {

    async setGoogleConfig(req: Request, res: Response, next: NextFunction) {
        const { code } = req.query;
        const { refresh_token, access_token } = await googleauthService.authWithGoogleService(code)
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("rerfresh-token", refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.redirect("http://localhost:3050/api/v1/admin/users");
    }
}


export const authWithGoogle: AuthWithGoogle = new AuthWithGoogle()

