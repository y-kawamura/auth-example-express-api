const schema = require('./notes.schema');

const validateNote = async (req, res, next) => {
  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    res.statusCode = 422;
    next(error);
  }
};

module.exports = {
  validateNote,
};
