import Joi from "joi";

export const registerSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required()
        .messages({
            "string.email": "Invalid email format",
            "any.required": "Email is required",
        }),
    password: Joi.string()
        .min(8)
        .when("provider", {
            is: "local",
            then: Joi.required(),
            otherwise: Joi.optional(),
        })
        .messages({
            "string.min": "Password must be at least 8 characters",
            "any.required": "Password is required for local signup",
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
    profile: Joi.object({
        first_name: Joi.string().optional(),
        last_name: Joi.string().optional(),
        phone: Joi.string().optional(),
    }).optional(),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .lowercase()
        .required(),
    password: Joi.string()
        .required(),
});

export const oauthLoginSchema = Joi.object({
    provider: Joi.string()
        .valid("google", "github")
        .required(),
    provider_id: Joi.string()
        .required(),
    email: Joi.string()
        .email()
        .required(),
});
