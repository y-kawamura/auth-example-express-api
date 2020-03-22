const bcrypt = require('bcrypt');

const saltRounds = 12;

const users = require('../../auth/auth.model');

/**
 * GET /
 * Return to list all users
 */
const get = async (req, res, next) => {
  try {
    const userList = await users.find({}, '-password');
    res.json(userList);
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /:id
 * Update a user
 */
const update = async (req, res, next) => {
  // update user in db
  try {
    const { id: _id } = req.params
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
};

module.exports = {
  get,
  update,
};
