import userModel from "../../../DB/models/userModel"
import { ResError } from "../../../utils/errorHandling"
import { IDeleteOne, IUpdateOne } from "./Iuser"


class UserService {

    async readAll(isDeleted: boolean, next: any) {
        const usersCount = await userModel.countDocuments({ isDeleted })
        const users = await userModel.find({ isDeleted })
            .select("userName email age role phone provider isDeleted")
        return { users, usersCount }
    }

    async deleteOne(reqBody: IDeleteOne) {
        const { _id, isDeleted } = reqBody
        const user = await userModel.findByIdAndUpdate(_id, { isDeleted }, { new: true })
            .select("userName email age role phone provider isDeleted")
        console.log(user);
        return user
    }

    async updateOne(reqBody: IUpdateOne) {
        const { _id, role } = reqBody
        const user = await userModel.findByIdAndUpdate(_id, { role }, { new: true })
            .select("userName email age role phone provider isDeleted")
        return user
    }

}

export const userService: UserService = new UserService()