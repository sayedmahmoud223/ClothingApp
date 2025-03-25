import { Schema, model, Types } from 'mongoose';
import { methodsWillUsed } from "../../utils/methodsWillUsed";
import { randomUUID } from "crypto";
import { ResError } from '../../utils/errorHandling';


const userSchema = new Schema({
    userName: { type: String, required: [true, 'userName is required'], min: [2, 'minimum length 2 char'], max: [20, 'max length 2 char'], lowercase: true },
    email: { type: String,lowercase: true, unique: [true, 'email must be unique value'], required: [true, 'userName is required'] },
    password: { type: String },
    phone: { type: String},
    address:{
        
    },
    role: { type: String, default: 'User', enum: ['User', 'Admin'] },
    googleId: String,
    provider: { type: String, default: 'SYSTEM', enum: ['SYSTEM', 'GOOGLE'] },
    isDeleted: { type: Boolean, default: false },
    age: { type: Number },
    confirmEmail: { type: Boolean, default: false },
    wishList: [{ type: Types.ObjectId, ref: "Product" }],
    vCode: String,
}, {
    timestamps: true
})

userSchema.pre('save', function () {
    if (this.password) {
        this.password = methodsWillUsed.hash({ plaintext: this.password })
    }
})
userSchema.pre('save', function () {
    if (this.provider == "GOOGLE") {
        this.vCode = undefined
    } else {
        this.vCode = randomUUID()
    }
})


const userModel = model('User', userSchema)
export default userModel