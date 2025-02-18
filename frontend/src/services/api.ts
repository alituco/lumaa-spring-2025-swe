const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function registerUser(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function loginUser(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function getTasks(token: string) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}

export async function createTask(token: string, title: string, description?: string) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });
  return res.json();
}

export async function updateTask(
  token: string,
  id: number,
  updates: Partial<{ title: string; description: string; isComplete: boolean }>
) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  return res.json();
}

export async function deleteTask(token: string, id: number) {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    const contentLength = res.headers.get('Content-Length');
    if (res.status === 204 || (contentLength !== null && Number(contentLength) === 0)) {
      return {};
    }
  
    const text = await res.text();
    return text ? JSON.parse(text) : {};
  }
  
  