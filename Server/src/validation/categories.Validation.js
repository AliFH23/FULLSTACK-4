import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.min": "Category name must be at least 3 characters",
      "string.max": "Category name must be at most 30 characters",
      "any.required": "Category name is required",
    }),
  description: Joi.string()
    .min(4)
    .messages({
      "string.min": "Category description must be at least 4 characters",
      "string.base": "Category description must be a text",
    }),
  status: Joi.string()
    .valid("approved", "rejected", "pending")
    .default("approved")
    .messages({
      "any.only": "Category status must be one of approved, rejected, pending",
    }),
});

// UPDATE: كل الحقول اختيارية، بس لازم يكون في حقل واحد على الأقل
export const updateCategorySchema = Joi.object({
  name: Joi.string().min(3).max(30).messages({
    "string.min": "Category name must be at least 3 characters",
    "string.max": "Category name must be at most 30 characters",
  }),
  description: Joi.string().min(4).messages({
    "string.min": "Category description must be at least 4 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "Send at least one field to update",
  });