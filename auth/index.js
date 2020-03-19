const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const saltRounds = 12;

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
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9-_]{3,}$'))
});

router.get('/', (req, res) => {
  res.json({
    message: '🔐'
  });
});

router.post('/signup', async (req, res, next) => {
  // 1. validate request
  let validated;
  try {
    validated = await schema.validateAsync(req.body);
  } catch (error) {
    // validation failed
    res.statusCode = 422;
    return next(error);
  }

  // 2. make sure username is unique
  const user = await users.findOne({ username: validated.username });
  if (user) {
    // there is already a user in the DB with this username
    const error = new Error(
      'That username is already exist. Please choose another one.'
    );
    res.statusCode = 409;
    return next(error);
  }

  // 3. hash the password
  const hashPassword = await bcrypt.hash(validated.password, saltRounds);

  // 4. insert to DB
  const newUser = {
    username: validated.username,
    password: hashPassword
  };
  const created = await users.insert(newUser);

  // 5. return registered user
  delete created.password;
  res.json(created);
});

function failLogin(res, next) {
  res.statusCode = 422;
  const error = new Error('Unable to login.');
  return next(error);
}

router.post('/login', async (req, res, next) => {
  // 1. validate request
  let validated;
  try {
    validated = await schema.validateAsync(req.body);
  } catch (error) {
    // validation failed
    return failLogin(res, next);
  }

  // 2. find username
  const user = await users.findOne({ username: validated.username });
  if (!user) {
    // not found the username
    return failLogin(res, next);
  }

  // 3. Compare password with hashed password in DB
  const match = await bcrypt.compare(validated.password, user.password);
  if (!match) {
    // password is invalid
    console.log('test2');
    return failLogin(res, next);
  }

  res.json({ match });
});

module.exports = router;
