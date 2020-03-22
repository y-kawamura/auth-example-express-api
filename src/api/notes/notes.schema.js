const Joi = require('@hapi/joi');

const schema = Joi.object({
  title: Joi.string().trim().required(),
  note: Joi.string().trim().required(),
});

module.exports = schema;
