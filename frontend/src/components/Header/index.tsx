'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const router = useRouter();
  const { token, setToken } = useAuth();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      setToken(null);
    }
    router.push('/login');
  };

  return (
    <header style={{ background: '#eee', padding: '1rem', marginBottom: '1rem' }}>
      <nav>
        <Link href="/">Home</Link> |{' '}
        {token ? (
          <>
            <Link href="/tasks">Tasks</Link> |{' '}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link> | <Link href="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
