import * as Joi from 'joi';
import { MAX_LIMIT, DEFAULT_LIMIT, DEFAULT_PAGE } from '../constants/pagination.constants';

export const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(DEFAULT_PAGE),
    limit: Joi.number().integer().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
    all: Joi.boolean().default(false),
});
