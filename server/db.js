const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create translations table if it doesn't exist
        // key is unique, like "common.confirm"
        // en, zh, ar are the translated texts
        db.run(`CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      en TEXT,
      zh TEXT,
      ar TEXT
    )`, (err) => {
            if (err) {
                console.error('Error creating translations table', err.message);
            } else {
                console.log('Translations table ready.');
            }
        });
    }
});

module.exports = db;
