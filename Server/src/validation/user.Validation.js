import Joi from "joi";

export const updateUserStatusSchema = Joi.object({
  newStatus: Joi.string()
    .valid("approved", "rejected", "pending")
    .required()
    .messages({
      "any.only": "Status must be one of approved, rejected, pending",
      "any.required": "newStatus is required",
    }),
});