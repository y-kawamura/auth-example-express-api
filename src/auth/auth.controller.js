const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const users = require('./auth.model');
const config = require('../config');

function failLogin(res, next) {
  res.statusCode = 422;
  const error = new Error('Unable to login.');
  return next(error);
}

function createTokenSendResponse(user, res, next) {
  const payload = user;
  delete payload.password;

  jwt.sign(
    payload,
    process.env.TOKEN_SECRET,
    { expiresIn: '1d' },
    (err, token) => {
      if (err) {
        return failLogin(res, next);
      }

      return res.json({ token });
    },
  );
}

const get = (req, res) => {
  res.json({
    message: '🔐',
  });
};

const signup = async (req, res, next) => {
  // 1. make sure username is unique
  const user = await users.findOne({ username: req.body.username });
  if (user) {
    // there is already a user in the DB with this username
    const error = new Error(
      'That username is already exist. Please choose another one.',
    );
    res.statusCode = 409;
    return next(error);
  }

  // 2. hash the password
  const hashPassword = await bcrypt.hash(req.body.password, config.saltRounds);

  // 3. insert to DB
  const newUser = {
    ...req.body,
    password: hashPassword,
    role: 'user',
    active: true,
  };
  const created = await users.insert(newUser);

  // 4. Create and Response a JWT
  return createTokenSendResponse(created, res, next);
};

const login = async (req, res, next) => {
  // 1. find username
  const user = await users.findOne({ username: req.body.username });
  if (!user || !user.active) {
    // not found user or not active
    return failLogin(res, next);
  }

  // 2. Compare password with hashed password in DB
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    // password is invalid
    return failLogin(res, next);
  }

  // 3. Create and Response a JWT
  return createTokenSendResponse(user, res, next);
};

module.exports = {
  get,
  signup,
  login,
};
