const express = require('express');
const db = require('../db/connection');

const users = db.get('users');

const router = express.Router();

// GET /api/v1/users 
// Return to list all users
router.get('/users', async (req, res) => {
  const userList = await users.find();
  res.json(userList);
});

module.exports = router;