import { getDatabase } from '../../lib/database';

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = getDatabase();

    switch (req.method) {
      case 'GET':
        handleGet(req, res, db);
        break;
      case 'POST':
        handlePost(req, res, db);
        break;
      case 'PUT':
        handlePut(req, res, db);
        break;
      case 'DELETE':
        handleDelete(req, res, db);
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

function handleGet(req, res, db) {
  try {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
}

function handlePost(req, res, db) {
  try {
    const { title, description } = req.body;
    
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = db.prepare(`
      INSERT INTO tasks (title, description) 
      VALUES (?, ?)
    `).run(title.trim(), (description || '').trim());

    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
}

function handlePut(req, res, db) {
  try {
    const { id, title, description, completed } = req.body;
    
    if (!id || !title || !title.trim()) {
      return res.status(400).json({ error: 'ID and title are required' });
    }

    const result = db.prepare(`
      UPDATE tasks 
      SET title = ?, description = ?, completed = ? 
      WHERE id = ?
    `).run(title.trim(), (description || '').trim(), completed ? 1 : 0, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
}

function handleDelete(req, res, db) {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Task ID is required' });
    }

    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
}