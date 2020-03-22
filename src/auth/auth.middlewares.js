const jwt = require('jsonwebtoken');
const schema = require('./auth.schema');

function isExistAuthHeader(authHeader) {
  return authHeader && authHeader.split(' ')[0] === 'Bearer';
}

function checkTokenSetUser(req, res, next) {
  const authHeader = req.get('authorization');

  if (!isExistAuthHeader(authHeader)) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return next();
  }

  return jwt.verify(
    token,
    process.env.TOKEN_SECRET,
    (err, user) => {
      if (err) {
        console.log(err);
      }
      req.user = user;
      return next();
    },
  );
}

function unAuthorized(res, next) {
  const error = new Error('Un-Authorized');
  res.statusCode = 401;
  next(error);
}

function isLoggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    unAuthorized(res, next);
  }
}

function isAdmin(req, res, next) {
  if (req.user.role === 'admin') {
    next();
  } else {
    unAuthorized(res, next);
  }
}

const validateUser = (defaultErrorMessage = '') => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    // validation failed
    res.statusCode = 422;
    const err = defaultErrorMessage ? new Error(defaultErrorMessage) : error;
    next(err);
  }
};

module.exports = {
  checkTokenSetUser,
  isLoggedIn,
  isAdmin,
  validateUser,
};
