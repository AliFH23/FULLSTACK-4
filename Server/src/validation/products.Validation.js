import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).required().messages({
    "string.min": "Product name must be at least 2 characters",
    "any.required": "Product name is required",
  }),
  description: Joi.string().min(4),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
    "any.required": "Price is required",
  }),
  stock: Joi.number().integer().min(0).default(0),
  image_url: Joi.string().uri(),
  category_id: Joi.number().integer().required().messages({
    "any.required": "Category id is required",
  }),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(200),
  description: Joi.string().min(4),
  price: Joi.number().positive(),
  stock: Joi.number().integer().min(0),
  image_url: Joi.string().uri(),
  category_id: Joi.number().integer(),
})
  .min(1)
  .messages({
    "object.min": "Send at least one field to update",
  });