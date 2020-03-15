const express = require('express');
const Joi = require('@hapi/joi');

const router = express.Router();

const schema = Joi.object({
  username: Joi.string()
      .alphanum()
      .min(2)
      .max(30)
      .required(),
  password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9-_]{3,}$')),
});

router.get('/', (req, res) => {
  res.json({
    message: '🔐'
  });
});

router.post('/signup', (req, res) => {
  const result = schema.validate(req.body);
  res.json(result);  
})

module.exports = router;
