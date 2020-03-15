const monk = require('monk');
const db = monk('localhost/auth-example');

module.exports = db;