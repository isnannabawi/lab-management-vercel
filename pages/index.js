import { useState, useEffect } from 'react';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion
  const toggleTask = async (task) => {
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: task.id,
          title: task.title,
          description: task.description,
          completed: !task.completed,
        }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await fetch(`/api/tasks?id=${id}`, {
        method: 'DELETE',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Simple Task Manager</h1>
      
      {/* Add Task Form */}
      <form onSubmit={addTask} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minHeight: '60px'
            }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || !title.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>

      {/* Tasks List */}
      <div>
        <h2>Tasks ({tasks.length})</h2>
        {tasks.length === 0 ? (
          <p>No tasks yet. Add your first task!</p>
        ) : (
          <div>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  marginBottom: '10px',
                  backgroundColor: task.completed ? '#f0f0f0' : 'white',
                  textDecoration: task.completed ? 'line-through' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 5px 0' }}>{task.title}</h3>
                    {task.description && (
                      <p style={{ margin: '0 0 10px 0', color: '#666' }}>{task.description}</p>
                    )}
                    <small style={{ color: '#999' }}>
                      Created: {new Date(task.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => toggleTask(task)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: task.completed ? '#ffa500' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}