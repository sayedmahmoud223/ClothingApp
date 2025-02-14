import Joi from "joi";
import { generalFields } from "../../../middlewares/validationMidleware";

export const signupSchema = Joi.object({
    userName: Joi.string().min(2).max(30).required(),
    email: generalFields.email,
    age: Joi.number().min(12).max(80).required(),
    password: Joi.string().min(8).max(30).required(),
    rePassword: generalFields.cPassword.required()
}).required()

export const loginSchema = Joi.object({
    email: generalFields.email,
    password: Joi.string().min(8).max(30).required()
}).required()
