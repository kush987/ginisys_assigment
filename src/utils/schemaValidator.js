const Joi = require('joi');


const emailValidator = Joi.string()
  .email({ tlds: { allow: false } })
  .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  .required()
  .messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  });

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: emailValidator,
  contact_no: Joi.number()
  .integer()
  .min(1000000000)
  .max(9999999999) 
  .required(),
  password: Joi.string().min(4).max(20).required()
});

const loginSchema = Joi.object({
  email: emailValidator,
  password: Joi.string().required()
});

const petSchema = Joi.object({
    pet_name: Joi.string().min(2).max(30).required(),
    breed: Joi.string().min(3).max(10).required()
})

module.exports = {
  registerSchema,
  loginSchema,
  petSchema
};
