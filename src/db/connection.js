const monk = require('monk');

const dbUrl = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_URL
  : process.env.MONGODB_URI;

const db = monk(dbUrl);

module.exports = db;
