"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const userModel_1 = __importDefault(require("../../../DB/models/userModel"));
const errorHandling_1 = require("../../../utils/errorHandling");
const eventEmitter_1 = require("../../../utils/eventEmitter");
const methodsWillUsed_1 = require("../../../utils/methodsWillUsed");
class AuthService {
    async restoreDeletedAccount(reqBody) {
        const { userName, age, password, email } = reqBody;
        const user = await userModel_1.default.findOne({ email, isDeleted: true });
        if (user) {
            // Update the user's details if the account was deleted
            user.userName = userName || user.userName;
            user.age = age || user.age;
            user.password = password || user.password;
            user.isDeleted = false;
            await user.save();
            // Emit email confirmation event after restoring the account
            eventEmitter_1.eventEmitter.emit("confirmEmail", { email, vCode: user.vCode });
            return user; // Return restored user
        }
    }
    async signup(reqBody, next) {
        const { userName, email, age, password } = reqBody;
        // Check if user already exists but not deleted
        const existingUser = await userModel_1.default.findOne({ email, isDeleted: false });
        if (existingUser)
            return next(new errorHandling_1.ResError("Email already exists", 409));
        // Attempt to restore the account if it was deleted previously
        const restoredUser = await this.restoreDeletedAccount(reqBody);
        if (restoredUser) {
            // If account is restored, return the updated user
            return restoredUser;
        }
        // Create new user if no account was restored
        const newUser = new userModel_1.default({ userName, email, age, password });
        await newUser.save();
        // Emit email confirmation event after user creation
        eventEmitter_1.eventEmitter.emit("confirmEmail", { email, vCode: newUser.vCode });
        return newUser;
    }
    async confirmEmail(reqParams, next) {
        const { vCode } = reqParams;
        const user = await userModel_1.default.findOneAndUpdate({ vCode }, {
            $set: { confirmEmail: true },
            $unset: { vCode }
        });
        if (!user)
            return next(new errorHandling_1.ResError("user not found", 400));
    }
    async login(reqBody, next) {
        const { email, password } = reqBody;
        // if user not exist
        if (!password) {
            return next(new errorHandling_1.ResError("password is requierd", 400));
        }
        const user = await userModel_1.default.findOne({ email: "sbendary977@gmail.com", isDeleted: false });
        console.log({ user: user });
        console.log({ userPassword: user.password });
        if (!user)
            return next(new Error(' Not register account', { cause: 404 }));
        if (user.provider === "GOOGLE")
            return next(new errorHandling_1.ResError("login with google", 400));
        if (!user.confirmEmail)
            return next(new errorHandling_1.ResError('please confirm email first..', 400));
        // compared user password
        const match = methodsWillUsed_1.methodsWillUsed.compare({ plaintext: password, hashValue: user?.password });
        if (!match)
            return next(new errorHandling_1.ResError("in-valid password", 400));
        // generate user token
        const token = methodsWillUsed_1.methodsWillUsed.generateToken({ payload: { _id: user._id, email: user.email, role: user.role } });
        const refresh_token = methodsWillUsed_1.methodsWillUsed.generateToken({ payload: { _id: user._id, email: user.email, role: user.role }, expiresIn: 60 * 60 * 24 * 365 });
        return { user, token, refresh_token };
    }
}
exports.authService = new AuthService();
