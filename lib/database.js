import { sql } from '@vercel/postgres';

export async function initDatabase() {
  try {
    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Check if table is empty and insert sample data
    const result = await sql`SELECT COUNT(*) as count FROM tasks`;
    if (parseInt(result.rows[0].count) === 0) {
      await sql`
        INSERT INTO tasks (title, description, completed) 
        VALUES 
        ('Belajar Next.js', 'Membuat aplikasi CRUD sederhana', false),
        ('Deploy ke Vercel', 'Deploy aplikasi ke Vercel', false)
      `;
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}