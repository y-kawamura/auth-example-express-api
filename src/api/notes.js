const express = require('express');
const Joi = require('@hapi/joi');

const db = require('../db/connection');

const notes = db.get('notes');

const schema = Joi.object({
  title: Joi.string().trim().required(),
  note: Joi.string().trim().required(),
});

const router = express.Router();

router.get('/', async (req, res) => {
  const noteList = await notes.find({
    user_id: req.user._id,
  });
  res.json(noteList);
});

router.post('/', async (req, res, next) => {
  let validated;
  try {
    validated = await schema.validateAsync(req.body);
  } catch (error) {
    // validation failed
    res.statusCode = 422;
    return next(error);
  }

  const note = {
    ...validated,
    user_id: req.user._id,
  };
  const created = await notes.insert(note);
  return res.json(created);
});

module.exports = router;
