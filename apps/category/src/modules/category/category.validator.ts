import * as Joi from 'joi';
import { paginationSchema } from '@app/common';

export const createCategorySchema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    slug: Joi.string().required().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).message('Slug must be lowercase and dash-separated'),
    parent_id: Joi.string().uuid().optional().allow(null),
    description: Joi.string().optional().allow('', null),
    is_active: Joi.boolean().default(true),
});

export const updateCategorySchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    slug: Joi.string().min(2).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    parent_id: Joi.string().uuid().optional().allow(null),
    description: Joi.string().optional().allow('', null),
    is_active: Joi.boolean().optional(),
});

export const listCategorySchema = paginationSchema;
