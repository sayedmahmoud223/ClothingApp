import userModel from "../../../DB/models/userModel";
import { ResError } from "../../../utils/errorHandling";
import { eventEmitter } from "../../../utils/eventEmitter";
import { methodsWillUsed } from "../../../utils/methodsWillUsed";
import { IConfirmEmail, ILogin, ISignup } from "./Iauth";


class AuthService {

    private async restoreDeletedAccount(reqBody: ISignup) {
        const { userName, age, password, email } = reqBody;
        const user = await userModel.findOne({ email, isDeleted: true });
        if (user) {
            // Update the user's details if the account was deleted
            user.userName = userName || user.userName;
            user.age = age || user.age;
            user.password = password || user.password;
            user.isDeleted = false;
            await user.save();

            // Emit email confirmation event after restoring the account
            eventEmitter.emit("confirmEmail", { email, vCode: user.vCode });

            return user; // Return restored user
        }
    }

    async signup(reqBody: ISignup, next: any) {
        const { userName, email, age, password } = reqBody;
        // Check if user already exists but not deleted
        const existingUser = await userModel.findOne({ email, isDeleted: false });
        if (existingUser) return next(new ResError("Email already exists", 409));
        // Attempt to restore the account if it was deleted previously
        const restoredUser = await this.restoreDeletedAccount(reqBody);
        if (restoredUser) {
            // If account is restored, return the updated user
            return restoredUser;
        }
        // Create new user if no account was restored
        const newUser = new userModel({ userName, email, age, password });
        await newUser.save();
        // Emit email confirmation event after user creation
        eventEmitter.emit("confirmEmail", { email, vCode: newUser.vCode });
        return newUser;
    }

    async confirmEmail(reqParams: IConfirmEmail, next: any) {
        const { vCode } = reqParams;
        const user = await userModel.findOneAndUpdate({ vCode },
            {
                $set: { confirmEmail: true },
                $unset: { vCode }
            })
        if (!user) return next(new ResError("user not found", 400))
    }

    async login(reqBody: ILogin, next: any) {
        const { email, password } = reqBody;
        // if user not exist
        const user = await userModel.findOne({ email, isDeleted: false })
        if (!user) return next(new Error(' Not register account', { cause: 404 }))
        if (!user.confirmEmail) return next(new ResError('please confirm email first..', 400))
        // compared user password
        const match = methodsWillUsed.compare({ plaintext: password, hashValue: user.password as string })
        if (!match) return next(new ResError("in-valid password", 400))
        // generate user token
        const token = methodsWillUsed.generateToken({ payload: { _id: user._id, email: user.email, role: user.role } })
        const refresh_Token = methodsWillUsed.generateToken({ payload: { _id: user._id, email: user.email, role: user.role }, expiresIn: 60 * 60 * 24 * 365 })
        return { user, token, refresh_Token }
    }

}


export const authService: AuthService = new AuthService()