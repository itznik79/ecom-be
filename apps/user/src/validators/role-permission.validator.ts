import * as Joi from 'joi';
import { paginationSchema } from '@app/common';

export const assignPermissionSchema = Joi.object({
    role_id: Joi.string().uuid().required().messages({
        'string.empty': 'Role ID is required',
        'any.required': 'Role ID is required',
    }),
    permission_ids: Joi.array().items(Joi.string().uuid()).required().messages({
        'array.base': 'Permission IDs must be an array',
        'any.required': 'Permission IDs are required',
    }),
});

export const listRolePermissionSchema = paginationSchema;
