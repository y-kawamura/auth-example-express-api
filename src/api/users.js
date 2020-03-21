const express = require('express');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const db = require('../db/connection');

const saltRounds = 12;
const users = db.get('users');

const router = express.Router();

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


/**
 * GET /
 * Return to list all users
 */
router.get('/', async (req, res, next) => {
  try {
    const userList = await users.find({}, '-password');
    res.json(userList);
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /:id
 * Update a user
 */
router.patch('/:id', async (req, res, next) => {
  const { id: _id } = req.params;

  // find user
  try {
    // validate req id
    const user = await users.findOne({ _id });
    if (!user) {
      // not found
      return next();
    }
  } catch (error) {
    // not found
    return next();
  }

  // validate update item
  try {
    await userUpdateSchema.validateAsync(req.body);
  } catch (error) {
    res.statusCode = 422;
    return next(error);
  }

  // update user in db
  try {
    const updateReq = req.body;
    if (updateReq.password) {
      // if password will update, hash password
      updateReq.password = await bcrypt.hash(updateReq.password, saltRounds);
    }

    const updated = await users.findOneAndUpdate(
      { _id },
      { $set: updateReq },
    );

    delete updated.password;
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
