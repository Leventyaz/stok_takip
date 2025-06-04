'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { register, user, error, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name || !email || !password || !confirmPassword) {
      setFormError('Lütfen tüm alanları doldurun');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Şifreler eşleşmiyor');
      return;
    }

    try {
      await register(name, email, password);
    } catch (err) {
      setFormError('Kayıt sırasında bir hata oluştu');
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  };

  const inputContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#1f2937',
  };

  const inputStyle = {
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    width: '100%',
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '0.375rem',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '0.5rem',
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
  };

  const linkStyle = {
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '0.875rem',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{
          animation: 'spin 1s linear infinite',
          height: '2.5rem',
          width: '2.5rem',
          borderRadius: '9999px',
          borderTop: '2px solid #6366f1',
          borderBottom: '2px solid #6366f1',
          borderLeft: '2px solid transparent',
          borderRight: '2px solid transparent',
          margin: '0 auto',
        }}></div>
        <p style={{ marginTop: '1rem' }}>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        Stok Takip Sistemi
      </h1>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.25rem' }}>
        Kayıt Ol
      </h2>

      <form style={formStyle} onSubmit={handleSubmit}>
        <div style={inputContainerStyle}>
          <label htmlFor="name" style={labelStyle}>Ad Soyad</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ad Soyad"
            style={inputStyle}
            required
          />
        </div>

        <div style={inputContainerStyle}>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email adresiniz"
            style={inputStyle}
            required
          />
        </div>

        <div style={inputContainerStyle}>
          <label htmlFor="password" style={labelStyle}>Şifre</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifreniz"
            style={inputStyle}
            required
          />
        </div>

        <div style={inputContainerStyle}>
          <label htmlFor="confirmPassword" style={labelStyle}>Şifre Tekrar</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Şifrenizi tekrar girin"
            style={inputStyle}
            required
          />
        </div>

        {(formError || error) && (
          <div style={errorStyle}>
            {formError || error}
          </div>
        )}

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
        </button>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <span>Zaten hesabınız var mı? </span>
          <Link href="/giris" style={linkStyle}>Giriş Yap</Link>
        </div>
      </form>
    </div>
  );
} 