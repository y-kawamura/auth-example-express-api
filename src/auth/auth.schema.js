const Joi = require('@hapi/joi');

const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(2)
    .max(30)
    .required(),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9-_]{3,}$'))
    .required(),
});

module.exports = schema;
