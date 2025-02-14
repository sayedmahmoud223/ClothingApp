import { Schema, model, Types } from 'mongoose';
import { methodsWillUsed } from "../../utils/methodsWillUsed";
import { randomUUID } from "crypto";


const userSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'userName is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
    },
    email: {
        type: String,
        unique: [true, 'email must be unique value'],
        required: [true, 'userName is required'],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    },
    provider: {
        type: String,
        default: 'SYSTEM',
        enum: ['SYSTEM', 'FACEBOOK', 'GOOGLE']
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    age: {
        type: Number
    },
    confirmEmail: {
        type: Boolean,
        default: false,
    },
    wishList: [{ type: Types.ObjectId, ref: "Product" }],
    vCode: String,
}, {
    timestamps: true
})

userSchema.pre('save', function () {
    this.password = methodsWillUsed.hash({ plaintext: this.password })
})
userSchema.pre('save', function () {
    this.vCode = randomUUID()
})


const userModel = model('User', userSchema)
export default userModel