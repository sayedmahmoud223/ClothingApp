import userModel from "../../../DB/models/userModel";
import { ResError } from "../../../utils/errorHandling";
import { eventEmitter } from "../../../utils/eventEmitter";
import { methodsWillUsed } from "../../../utils/methodsWillUsed";
import { IConfirmEmail, ILogin, ISignup } from "./Iauth";
import axios from "axios"


class GoogleAuthService {
    async authWithGoogleService(code: any) {
        if (!code) {
            throw new ResError("code not valid", 400);
        }

        try {
            console.log({ code });
            // 1️⃣ Exchange Code for Access Token
            const tokenResponse = await axios.post("https://oauth2.googleapis.com/token", {
                client_id: process.env.clientID,
                client_secret: process.env.clientSecret,
                redirect_uri: process.env.LOCAL_REDIRECT_URI,
                grant_type: "authorization_code",
                code,
            });

            const { access_token } = tokenResponse.data;
            console.log({ access_token });
            if (!access_token) {
                console.error("Google OAuth Token Response:", tokenResponse.data);
                throw new ResError("Failed to get access token", 400);
            }

            // 2️⃣ Fetch User Info from Google
            const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            const { id, email, name } = userResponse.data;

            let user = await userModel.findOne({ googleId: id });

            if (!user) {
                user = await userModel.create({
                    googleId: id,
                    email,
                    userName: name,
                    provider: "GOOGLE",
                    confirmEmail: true
                });
            }
            user.vCode = ""
            const refresh_token = methodsWillUsed.generateToken({ payload: { _id: user._id, email: user.email }, expiresIn: "7d" });

            return { refresh_token, access_token };

        } catch (error: any) {
            console.error("Google OAuth Error:", error.response?.data || error.message);
            throw new ResError("Invalid or expired authorization code", 400);
        }
    }
}

export const googleauthService: GoogleAuthService = new GoogleAuthService()

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
