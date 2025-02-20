import userModel from "../DB/models/userModel";
import { asyncHandler, ResError } from "../utils/errorHandling";
import { methodsWillUsed } from "../utils/methodsWillUsed";

export const Roles = {
    Admin: "Admin",
    User: "User",
}

const Auth = (AccessRoles: string[] | string = []) => {
    return asyncHandler(async (req: any, res: any, next: any) => {
        // Correct way to get token from cookies
        const { access_token } = req.cookies;
        // console.log({ cookie: req.cookies });
        if (!access_token) return next(new ResError("Access token is missing", 400));

        // Verify token
        const decoded: any = methodsWillUsed.verifyToken({ token: access_token });
        if (!decoded) return next(new ResError("Invalid token", 400));

        // Fetch user from DB
        const user: any = await userModel.findById(decoded._id).select("_id userName email role");
        if (!user) return next(new ResError("User not found", 400));

        // Check if user role is authorized
        if (!AccessRoles.includes(user.role)) {
            return next(new ResError("Not authorized", 403));
        }

        req.decoded = user;
        next();
    });
};

export default Auth;
