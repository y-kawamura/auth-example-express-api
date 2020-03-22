const Joi = require('@hapi/joi');

const userUpdateSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(2)
    .max(30),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9-_]{3,}$')),
  role: Joi.string()
    .valid('user', 'admin', 'mod'),
  active: Joi.bool(),
});

module.exports = userUpdateSchema;
