const express = require('express');

const controller = require('./users.controller');
const middlewares = require('./users.middlewares');

const router = express.Router();

router.get('/', controller.get);
router.patch(
  '/:id',
  middlewares.validateParamsId,
  middlewares.validateUpdateUser,
  controller.update,
);

module.exports = router;
