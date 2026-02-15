import * as Joi from "joi"

export const createUserProfileValidator = Joi.object({
    first_name: Joi.string().required().messages({
        'string.empty': "First name is required",
        'any.required': "First name is required"
    }),
    last_name: Joi.string().required().messages({
        'string.empty': "Last name is required",
        'any.required': "Last name is required"
    }),
    phone: Joi.string().optional().messages({
        'string.empty': "Phone number is required",
        'any.required': "Phone number is required"
    }),
    avatar_url: Joi.string().optional().messages({
        'string.empty': "Avatar URL is required",
        'any.required': "Avatar URL is required"
    }),
    dob: Joi.date().optional().messages({
        'date.base': "DOB must be a valid date",
        'any.required': "DOB is required"
    }),
})

export const updateUserProfileValidator = createUserProfileValidator.fork(
    Object.keys(createUserProfileValidator.describe().keys),
    (schema) => schema.optional()
)