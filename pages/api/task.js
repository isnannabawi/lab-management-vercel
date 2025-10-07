import { sql } from '@vercel/postgres';
import { initDatabase } from '../../lib/database';

// Initialize database on first request
let dbInitialized = false;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Initialize database if not already done
    if (!dbInitialized) {
      await initDatabase();
      dbInitialized = true;
    }

    switch (req.method) {
      case 'GET':
        const tasks = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;
        res.status(200).json(tasks.rows);
        break;

      case 'POST':
        const { title, description } = req.body;
        
        if (!title || !title.trim()) {
          return res.status(400).json({ error: 'Title is required' });
        }

        const result = await sql`
          INSERT INTO tasks (title, description) 
          VALUES (${title.trim()}, ${(description || '').trim()}) 
          RETURNING *
        `;
        
        res.status(201).json(result.rows[0]);
        break;

      case 'PUT':
        const { id, title: newTitle, description: newDesc, completed } = req.body;
        
        if (!id || !newTitle || !newTitle.trim()) {
          return res.status(400).json({ error: 'ID and title are required' });
        }

        const updateResult = await sql`
          UPDATE tasks 
          SET title = ${newTitle.trim()}, 
              description = ${(newDesc || '').trim()}, 
              completed = ${completed} 
          WHERE id = ${id} 
          RETURNING *
        `;

        if (updateResult.rows.length === 0) {
          return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json(updateResult.rows[0]);
        break;

      case 'DELETE':
        const { id: deleteId } = req.query;
        
        if (!deleteId) {
          return res.status(400).json({ error: 'Task ID is required' });
        }

        const deleteResult = await sql`
          DELETE FROM tasks 
          WHERE id = ${deleteId} 
          RETURNING *
        `;

        if (deleteResult.rows.length === 0) {
          return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}