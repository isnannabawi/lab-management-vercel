import { getDatabase, initDatabase } from '../../../lib/database';

export default function handler(req, res) {
  const db = getDatabase();

  switch (req.method) {
    case 'GET':
      // Get all tasks
      try {
        const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
      }
      break;

    case 'POST':
      // Create new task
      try {
        const { title, description } = req.body;
        
        if (!title) {
          return res.status(400).json({ error: 'Title is required' });
        }

        const result = db.prepare(`
          INSERT INTO tasks (title, description) 
          VALUES (?, ?)
        `).run(title, description || '');

        res.status(201).json({
          id: result.lastInsertRowid,
          title,
          description: description || '',
          completed: false
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
      }
      break;

    case 'PUT':
      // Update task
      try {
        const { id, title, description, completed } = req.body;
        
        const result = db.prepare(`
          UPDATE tasks 
          SET title = ?, description = ?, completed = ? 
          WHERE id = ?
        `).run(title, description, completed ? 1 : 0, id);

        if (result.changes === 0) {
          return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
      }
      break;

    case 'DELETE':
      // Delete task
      try {
        const { id } = req.query;
        
        const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

        if (result.changes === 0) {
          return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}