const express = require('express');

const controller = require('./auth.controller');
const middlewares = require('./auth.middlewares');

const router = express.Router();

router.get('/', controller.get);
router.post('/signup', middlewares.validateUser(), controller.signup);
router.post('/login', middlewares.validateUser('Unable to login.'), controller.login);

module.exports = router;
