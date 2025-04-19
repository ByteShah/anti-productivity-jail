const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tasks.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      deadline TEXT NOT NULL,
      duration_hours INTEGER NOT NULL,
      duration_minutes INTEGER NOT NULL,
      consequence TEXT,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS task_sequences (
      task_id TEXT PRIMARY KEY,
      sequence INTEGER NOT NULL,
      FOREIGN KEY (task_id) REFERENCES tasks (id)
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
});

module.exports = db;
