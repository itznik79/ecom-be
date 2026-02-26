import * as Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required().min(1).max(255),
  slug: Joi.string().required().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).message('Slug must be lowercase and dash-separated'),
  brand_id: Joi.string().uuid().optional().allow(null),
  category_id: Joi.string().uuid().optional().allow(null),
  description: Joi.string().optional().allow('', null),
  is_active: Joi.boolean().default(true),
  variants: Joi.array().items(
    Joi.object({
      sku: Joi.string().required(),
      current_price: Joi.number().precision(2).required(),
      compare_at_price: Joi.number().precision(2).optional().allow(null),
      is_active: Joi.boolean().default(true),
    })
  ).optional(),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      alt_text: Joi.string().required(),
      variant_id: Joi.string().uuid().optional().allow(null),
    })
  ).optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  slug: Joi.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  brand_id: Joi.string().uuid().optional().allow(null),
  category_id: Joi.string().uuid().optional().allow(null),
  description: Joi.string().optional().allow('', null),
  is_active: Joi.boolean().optional(),
});
