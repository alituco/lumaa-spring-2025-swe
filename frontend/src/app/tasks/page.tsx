'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, createTask, updateTask, deleteTask } from '@/services/api';

interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    if (!storedToken) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;
    const fetchTasks = async () => {
      try {
        const data = await getTasks(token);
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setError(data.message || 'Failed to fetch tasks');
        }
      } catch (err) {
        setError('An error occurred while fetching tasks.');
      }
    };
    fetchTasks();
  }, [token]);

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const newTask = await createTask(token, title, description);
      if (newTask.id) {
        setTasks((prev) => [...prev, newTask]);
        setTitle('');
        setDescription('');
      } else {
        setError(newTask.message || 'Failed to create task');
      }
    } catch (err) {
      setError('An error occurred while creating task.');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    if (!token) return;
    try {
      const updated = await updateTask(token, task.id, { isComplete: !task.isComplete });
      if (updated.id) {
        setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      } else {
        setError(updated.message || 'Failed to update task');
      }
    } catch (err) {
      setError('An error occurred while updating task.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await deleteTask(token, id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError('An error occurred while deleting task.');
    }
  };

  if (token === null) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Your Tasks</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleCreateTask}>
        <div>
          <label>
            Title:
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Description:
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Create Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: '1rem' }}>
            <strong>{task.title}</strong> {task.isComplete && '(Complete)'}
            <p>{task.description}</p>
            <button onClick={() => handleToggleComplete(task)}>
              {task.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
