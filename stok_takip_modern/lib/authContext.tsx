'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  ad: string;
  email: string;
  rol: string;
  token: string;
} | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/kullanicilar/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, sifre: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Giriş başarısız');
      }

      // Save user to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Redirect to home
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/kullanicilar/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ad: name, email, sifre: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Kayıt başarısız');
      }

      // Save user to state and localStorage
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      // Redirect to home
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/giris');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 