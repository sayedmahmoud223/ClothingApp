"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = exports.generalFields = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = require("mongoose");
const validateObjectId = (value, helper) => {
    console.log({ value });
    console.log(helper);
    return mongoose_1.Types.ObjectId.isValid(value) ? true : helper.message('In-valid objectId');
};
exports.generalFields = {
    email: joi_1.default.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net',] }
    }).required(),
    password: joi_1.default.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi_1.default.string()
        .valid(joi_1.default.ref('password')).required()
        .messages({ 'any.invalid': 'Password and confirm password must match' }), // Custom error message for mismatched passwords
    id: joi_1.default.string().custom(validateObjectId).required(),
    file: joi_1.default.object({
        size: joi_1.default.number().positive().required(),
        path: joi_1.default.string().required(),
        filename: joi_1.default.string().required(),
        destination: joi_1.default.string().required(),
        mimetype: joi_1.default.string().required(),
        encoding: joi_1.default.string().required(),
        originalname: joi_1.default.string().required(),
        fieldname: joi_1.default.string().required()
    })
};
const validation = (schema) => {
    return (req, res, next) => {
        const inputs = { ...req.body, ...req.params, ...req.query };
        if (req.file || req.files) {
            inputs.file = req.file || req.files;
        }
        const validationResult = schema.validate(inputs, { abortEarly: false });
        if (validationResult.error) {
            return res.status(400).json({ status: 'failed', errors: validationResult.error.details.map((err) => err.message) });
        }
        return next();
    };
};
exports.validation = validation;
