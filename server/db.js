const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('books.db');

module.exports = db;
