import * as Joi from "joi";
import { paginationSchema } from '@app/common';

export const createUserValidator = Joi.object({
    credential_id: Joi.string().uuid().required().messages({
        'string.empty': 'Credential ID is required',
        'any.required': 'Credential ID is required',
        'string.guid': 'Credential ID must be a valid UUID'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    provider: Joi.string()
        .valid("local", "google", "github")
        .required()
        .messages({
            "any.only": "Provider must be local, google, or github",
        }),
    provider_id: Joi.string()
        .when("provider", {
            is: "local",
            then: Joi.forbidden(),
            otherwise: Joi.required(),
        })
        .messages({
            "any.required": "provider_id is required for OAuth signup",
        }),
});

export const updateUserValidator = createUserValidator.fork(
    Object.keys(createUserValidator.describe().keys),
    (schema) => schema.optional()
);

export const listUserSchema = paginationSchema;