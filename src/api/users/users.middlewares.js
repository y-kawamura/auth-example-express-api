const userUpdateSchema = require('./users.schema');
const users = require('../../auth/auth.model');

const validateParamsId = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    // find user
    const user = await users.findOne({ _id });
    if (!user) {
      throw new Error();
    }
    next();
  } catch (error) {
    // not found
    res.statusCode = 404;
    const err = new Error('Not Found user id');
    return next(err);
  }
};

const validateUpdateUser = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw new Error('request is empty');
    }
    await userUpdateSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.statusCode = 422;
    return next(error);
  }
};

module.exports = {
  validateParamsId,
  validateUpdateUser,
};
