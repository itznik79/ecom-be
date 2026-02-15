import * as Joi from "joi"

export const createUserRoleValidator = Joi.object({
    user_id: Joi.string().uuid().required().messages({
        'string.empty': "User ID is required",
        'any.required': "User ID is required",
        'string.guid': "User ID must be a valid UUID"
    }),
    role_id: Joi.string().uuid().required().messages({
        'string.empty': "Role ID is required",
        'any.required': "Role ID is required",
        'string.guid': "Role ID must be a valid UUID"
    }),
})

export const updateUserRoleValidator = createUserRoleValidator.fork(
    Object.keys(createUserRoleValidator.describe().keys),
    (schema) => schema.optional()
)