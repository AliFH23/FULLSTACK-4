import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required().messages({
    "string.min": "Name must be at least 2 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().trim().lowercase().email().max(150).required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .max(64)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base": "Password must contain letters and numbers",
      "any.required": "Password is required",
    }),
  // admin ممنوع من هون
  role: Joi.string().valid("user", "trader").default("user").messages({
    "any.only": "Role must be user or trader",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});