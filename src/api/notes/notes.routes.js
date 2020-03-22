const express = require('express');

const controller = require('./notes.controller');
const middlewares = require('./notes.middlewares');

const router = express.Router();

router.get('/', controller.get);
router.post('/', middlewares.validateNote, controller.create);

module.exports = router;
