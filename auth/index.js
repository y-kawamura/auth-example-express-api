const express = require('express');
const Joi = require('@hapi/joi');

const db = require('../db/connection');
const users = db.get('users');
users.createIndex('username', { unique: true });

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

router.post('/signup', async (req, res, next) => {
  try {
    const result = await schema.validateAsync(req.body);
    
    // make sure username is unique
    const user = await users.findOne({
      username: result.username
    });
    if (user) {
      console.log(user);
      
      // there is already a user in the DB with this username
      const error = new Error('That username is already exist. Please choose another one.');
      res.statusCode=400;
      return next(error);
    }
    
    // hash the password

    // insert to DB
    res.json(user);
  } catch (error) {
    next(error);
  }
})

module.exports = router;
