
const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.details.map(d => d.message) 
      });
    }
    next();
  };
};

const schemas = {
  user: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('super_admin', 'company_admin', 'professional').optional()
  }),

  company: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    address: Joi.string().optional(),
    plan: Joi.string().optional(),
    customUrl: Joi.string().optional(),
    whatsappNumber: Joi.string().optional()
  }),

  service: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().positive().required(),
    duration: Joi.number().integer().positive().required(),
    isActive: Joi.boolean().optional()
  }),

  professional: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    specialties: Joi.array().items(Joi.string()).optional(),
    commission: Joi.number().min(0).max(100).optional(),
    isActive: Joi.boolean().optional()
  }),

  appointment: Joi.object({
    clientName: Joi.string().required(),
    clientPhone: Joi.string().required(),
    clientBirthDate: Joi.date().optional(),
    date: Joi.date().required(),
    time: Joi.string().required(),
    duration: Joi.number().integer().positive().required(),
    price: Joi.number().positive().required(),
    professionalId: Joi.string().uuid().required(),
    serviceId: Joi.string().uuid().required(),
    notes: Joi.string().optional()
  }),

  client: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().optional(),
    birthDate: Joi.date().optional()
  }),

  plan: Joi.object({
    name: Joi.string().required(),
    maxEmployees: Joi.string().required(),
    monthlyPrice: Joi.number().positive().required(),
    yearlyPrice: Joi.number().positive().required(),
    features: Joi.array().items(Joi.string()).required(),
    isPopular: Joi.boolean().optional(),
    isActive: Joi.boolean().optional()
  })
};

module.exports = {
  validate,
  schemas
};
