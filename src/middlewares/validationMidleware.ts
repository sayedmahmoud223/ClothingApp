import joi from 'joi'
import { Types } from 'mongoose'

const validateObjectId = (value: any, helper: any) => {
    console.log({ value });
    console.log(helper);
    return Types.ObjectId.isValid(value) ? true : helper.message('In-valid objectId')
}

export const generalFields = {
    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net',] }
    }).required(),
   
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
   
    cPassword: joi.string()
        .valid(joi.ref('password')).required()
        .messages({ 'any.invalid': 'Password and confirm password must match' }),  // Custom error message for mismatched passwords

    id: joi.string().custom(validateObjectId).required(),
    file: joi.object({
        size: joi.number().positive().required(),
        path: joi.string().required(),
        filename: joi.string().required(),
        destination: joi.string().required(),
        mimetype: joi.string().required(),
        encoding: joi.string().required(),
        originalname: joi.string().required(),
        fieldname: joi.string().required()

    })
}

export const validation = (schema: any) => {
    return (req: any, res: any, next: any) => {
        const inputs = { ...req.body, ...req.params, ...req.query }
        if (req.file || req.files) {
            inputs.file = req.file || req.files
        }
        const validationResult = schema.validate(inputs, { abortEarly: false })
        if (validationResult.error) {
            return res.status(400).json({ status: 'failed', errors: validationResult.error.details.map((err: any) => err.message) })
        }
        return next()
    }
}
