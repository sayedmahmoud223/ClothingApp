"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const userModel_1 = __importDefault(require("../DB/models/userModel"));
const errorHandling_1 = require("../utils/errorHandling");
const methodsWillUsed_1 = require("../utils/methodsWillUsed");
exports.Roles = {
    Admin: "Admin",
    User: "User",
};
const Auth = (AccessRoles = []) => {
    return (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        // Correct way to get token from cookies
        const { access_token } = req.cookies;
        console.log({ cookie: req.cookies });
        if (!access_token)
            return next(new errorHandling_1.ResError("Access token is missing", 400));
        // Verify token
        const decoded = methodsWillUsed_1.methodsWillUsed.verifyToken({ token: access_token });
        if (!decoded)
            return next(new errorHandling_1.ResError("Invalid token", 400));
        // Fetch user from DB
        const user = await userModel_1.default.findById(decoded._id).select("userName email role");
        if (!user)
            return next(new errorHandling_1.ResError("User not found", 400));
        // Check if user role is authorized
        if (!AccessRoles.includes(user.role)) {
            return next(new errorHandling_1.ResError("Not authorized", 403));
        }
        req.user = user;
        next();
    });
};
exports.default = Auth;
