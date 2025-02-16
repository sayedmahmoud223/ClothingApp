"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleauthService = void 0;
const userModel_1 = __importDefault(require("../../../DB/models/userModel"));
const errorHandling_1 = require("../../../utils/errorHandling");
const methodsWillUsed_1 = require("../../../utils/methodsWillUsed");
const axios_1 = __importDefault(require("axios"));
class GoogleAuthService {
    async authWithGoogleService(code) {
        if (!code) {
            throw new errorHandling_1.ResError("code not valid", 400);
        }
        try {
            console.log({ code });
            // 1️⃣ Exchange Code for Access Token
            const tokenResponse = await axios_1.default.post("https://oauth2.googleapis.com/token", {
                client_id: process.env.clientID,
                client_secret: process.env.clientSecret,
                redirect_uri: process.env.REDIRECT_URI,
                grant_type: "authorization_code",
                code,
            });
            const { access_token } = tokenResponse.data;
            console.log({ access_token });
            if (!access_token) {
                console.error("Google OAuth Token Response:", tokenResponse.data);
                throw new errorHandling_1.ResError("Failed to get access token", 400);
            }
            // 2️⃣ Fetch User Info from Google
            const userResponse = await axios_1.default.get("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: { Authorization: `Bearer ${access_token}` },
            });
            const { id, email, name } = userResponse.data;
            let user = await userModel_1.default.findOne({ googleId: id });
            if (!user) {
                user = await userModel_1.default.create({
                    googleId: id,
                    email,
                    userName: name,
                    provider: "GOOGLE",
                    confirmEmail: true
                });
            }
            const refresh_token = methodsWillUsed_1.methodsWillUsed.generateToken({ payload: { _id: user._id, email: user.email }, expiresIn: "7d" });
            return { refresh_token, access_token };
        }
        catch (error) {
            console.error("Google OAuth Error:", error.response?.data || error.message);
            throw new errorHandling_1.ResError("Invalid or expired authorization code", 400);
        }
    }
}
exports.googleauthService = new GoogleAuthService();
/*
async (req: Request, res: Response) => {

    

    try {
        // 1️⃣ استبدال `code` بـ `access_token`
        const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
            code,
        });

        const { access_token } = tokenResponse.data;

        // 2️⃣ جلب بيانات المستخدم من Google
        const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const { id, email, name } = userResponse.data;

        // 3️⃣ التحقق مما إذا كان المستخدم موجودًا في قاعدة البيانات
        let user = await userModel.findOne({ googleId: id });

        if (!user) {
            user = await userModel.create({
                googleId: id,
                email,
                name,
                authMethod: "GOOGLE",
                confirmEmail: true,
            });
        }

        // 4️⃣ إنشاء JWT Token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.TOKEN_SECRET_KEY!, {
            expiresIn: "1d",
        });

        // 5️⃣ إرسال التوكن في HttpOnly Cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // يوم واحد
        });

        res.redirect("http://localhost:5173/dashboard");
    } catch (error) {
        console.error("Google OAuth Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
*/
