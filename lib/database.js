import Database from 'better-sqlite3';
import fs from 'fs';

// Untuk Vercel, kita perlu menggunakan temporary file
const dbPath = '/tmp/tasks.db';

export function initDatabase() {
  // Hapus database lama jika ada (untuk development)
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

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

  // Insert sample data
  const insert = db.prepare(`
    INSERT INTO tasks (title, description, completed) 
    VALUES (?, ?, ?)
  `);

  insert.run('Belajar Next.js', 'Membuat aplikasi CRUD sederhana', false);
  insert.run('Deploy ke Vercel', 'Deploy aplikasi ke Vercel', false);

  return db;
}

export function getDatabase() {
  if (!fs.existsSync(dbPath)) {
    return initDatabase();
  }
  return new Database(dbPath);
}