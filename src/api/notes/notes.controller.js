const notes = require('./notes.model');

const get = async (req, res, next) => {
  try {
    const noteList = await notes.find({
      user_id: req.user._id,
    });
    res.json(noteList);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  const note = {
    ...req.body,
    user_id: req.user._id,
  };

  try {
    const created = await notes.insert(note);
    res.json(created);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  create,
};
