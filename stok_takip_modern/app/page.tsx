'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function RootPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      } else {
        router.push('/giris');
      }
    }
  }, [user, loading, router]);

  // Loading spinner while determining where to redirect
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div style={{
        animation: 'spin 1s linear infinite',
        height: '2.5rem',
        width: '2.5rem',
        borderRadius: '9999px',
        borderTop: '2px solid #6366f1',
        borderBottom: '2px solid #6366f1',
        borderLeft: '2px solid transparent',
        borderRight: '2px solid transparent',
      }}></div>
    </div>
  );
} 