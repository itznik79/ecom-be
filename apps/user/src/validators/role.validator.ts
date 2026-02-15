import * as Joi from 'joi';
import { paginationSchema } from '@app/common';

export const createRoleSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Role name is required',
        'any.required': 'Role name is required',
    }),
    description: Joi.string().optional().allow(null, ''),
});

export const updateRoleSchema = createRoleSchema.fork(
    Object.keys(createRoleSchema.describe().keys),
    (schema) => schema.optional()
);

export const listRoleSchema = paginationSchema;