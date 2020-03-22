const db = require('../../db/connection');

const notes = db.get('notes');

module.exports = notes;
