"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const userModel_1 = __importDefault(require("../../../DB/models/userModel"));
class UserService {
    async readAll(isDeleted, next) {
        const usersCount = await userModel_1.default.countDocuments({ isDeleted });
        const users = await userModel_1.default.find({ isDeleted })
            .select("userName email age role phone provider isDeleted");
        return { users, usersCount };
    }
    async deleteOne(reqBody) {
        const { _id, isDeleted } = reqBody;
        const user = await userModel_1.default.findByIdAndUpdate(_id, { isDeleted }, { new: true })
            .select("userName email age role phone provider isDeleted");
        console.log(user);
        return user;
    }
    async updateOne(reqBody) {
        const { _id, role } = reqBody;
        const user = await userModel_1.default.findByIdAndUpdate(_id, { role }, { new: true })
            .select("userName email age role phone provider isDeleted");
        return user;
    }
}
exports.userService = new UserService();
