import Joi from "joi";
import { generalFields } from "../../../middlewares/validationMidleware";

export const readAllSchema = Joi.object({
   isDeleted:Joi.boolean()
}).required()

export const deleteOneSchema = Joi.object({
    _id:generalFields.id,
    isDeleted:Joi.boolean().required()
}).required()

export const updateOneSchema = Joi.object({
    _id:generalFields.id,
    role: Joi.string().valid('User', 'Admin').required(),
}).required()
