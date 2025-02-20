'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button
} from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const { setToken } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser(username, password);
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        router.push('/tasks');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login.');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
      {error && (
        <Typography color="error" variant="body1" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
}
