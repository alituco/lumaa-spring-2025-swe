'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, createTask, updateTask, deleteTask } from '@/services/api';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

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

  // For editing a task
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

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

  // ------------------
  // CREATE
  // ------------------
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

  // ------------------
  // TOGGLE COMPLETE
  // ------------------
  const handleToggleComplete = async (task: Task) => {
    if (!token) return;
    try {
      const updated = await updateTask(token, task.id, {
        isComplete: !task.isComplete,
      });
      if (updated.id) {
        setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      } else {
        setError(updated.message || 'Failed to update task');
      }
    } catch (err) {
      setError('An error occurred while updating task.');
    }
  };

  // ------------------
  // DELETE
  // ------------------
  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      await deleteTask(token, id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      setError('An error occurred while deleting task.');
    }
  };

  // ------------------
  // EDIT DIALOG
  // ------------------
  const handleOpenEditDialog = (task: Task) => {
    setEditTask(task);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditTask(null);
  };

  const handleSaveEdit = async () => {
    if (!token || !editTask) return;
    try {
      const updated = await updateTask(token, editTask.id, {
        title: editTask.title,
        description: editTask.description,
        isComplete: editTask.isComplete,
      });
      if (updated.id) {
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        setError(updated.message || 'Failed to update task');
      }
    } catch (err) {
      setError('An error occurred while updating task.');
    } finally {
      handleCloseEditDialog();
    }
  };

  // If token is still null, we show a loading message (or redirect)
  if (token === null) {
    return <p>Loading...</p>;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Tasks
      </Typography>

      {error && (
        <Typography color="error" variant="body1" gutterBottom>
          {error}
        </Typography>
      )}

      {/* Create Task Form */}
      <Box component="form" onSubmit={handleCreateTask} sx={{ mb: 3 }}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>
          Create Task
        </Button>
      </Box>

      {/* Task List */}
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} disableGutters>
            <Card sx={{ width: '100%', mb: 2 }}>
              <CardContent>
                <Typography variant="h6">
                  {task.title} {task.isComplete && '(Complete)'}
                </Typography>
                {task.description && (
                  <Typography variant="body2" color="text.secondary">
                    {task.description}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  color={task.isComplete ? 'warning' : 'success'}
                  onClick={() => handleToggleComplete(task)}
                >
                  {task.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleOpenEditDialog(task)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </ListItem>
        ))}
      </List>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          {editTask && (
            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Title"
                value={editTask.title}
                onChange={(e) =>
                  setEditTask({ ...editTask, title: e.target.value })
                }
              />
              <TextField
                label="Description"
                value={editTask.description || ''}
                onChange={(e) =>
                  setEditTask({ ...editTask, description: e.target.value })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
