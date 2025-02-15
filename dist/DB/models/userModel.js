"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const methodsWillUsed_1 = require("../../utils/methodsWillUsed");
const crypto_1 = require("crypto");
const userSchema = new mongoose_1.Schema({
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
    wishList: [{ type: mongoose_1.Types.ObjectId, ref: "Product" }],
    vCode: String,
}, {
    timestamps: true
});
userSchema.pre('save', function () {
    this.password = methodsWillUsed_1.methodsWillUsed.hash({ plaintext: this.password });
});
userSchema.pre('save', function () {
    this.vCode = (0, crypto_1.randomUUID)();
});
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.default = userModel;
