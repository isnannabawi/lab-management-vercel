import Database from 'better-sqlite3';
import fs from 'fs';

// Untuk Vercel, kita perlu menggunakan temporary file
const dbPath = '/tmp/tasks.db';

let dbInstance = null;

export function getDatabase() {
  if (!dbInstance) {
    dbInstance = initDatabase();
  }
  return dbInstance;
}

function initDatabase() {
  const db = new Database(dbPath);
  
  // Buat tabel tasks
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT FALSE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Cek apakah tabel kosong, jika ya insert sample data
  const rowCount = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
  if (rowCount.count === 0) {
    const insert = db.prepare(`
      INSERT INTO tasks (title, description, completed) 
      VALUES (?, ?, ?)
    `);

    insert.run('Belajar Next.js', 'Membuat aplikasi CRUD sederhana', false);
    insert.run('Deploy ke Vercel', 'Deploy aplikasi ke Vercel', false);
  }

  return db;
}