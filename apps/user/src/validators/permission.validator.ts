import * as Joi from 'joi';
import { paginationSchema } from '@app/common';

export const createPermissionSchema = Joi.object({
    key: Joi.string().required().messages({
        'string.empty': 'Permission key is required',
        'any.required': 'Permission key is required',
    }),
    description: Joi.string().optional().allow(null, ''),
});

export const updatePermissionSchema = createPermissionSchema.fork(
    Object.keys(createPermissionSchema.describe().keys),
    (schema) => schema.optional()
);

export const listPermissionSchema = paginationSchema;
