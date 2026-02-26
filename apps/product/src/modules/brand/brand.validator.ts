import { paginationSchema } from '@app/common';
import * as Joi from 'joi';

export const createBrandSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Brand name is required',
        'any.required': 'Brand name is required',
    }),
    slug: Joi.string().required(),
    logo_url: Joi.string().uri().optional().allow(null, ''),
    is_active: Joi.boolean().optional().default(false)
});

export const updateBrandSchema = createBrandSchema.fork(
    Object.keys(createBrandSchema.describe().keys),
    (schema) => schema.optional()
);

export const listBrandSchema = paginationSchema;