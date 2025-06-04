'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { useAuth } from '@/lib/authContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/giris');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="app-container">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="main-content">
        <div className="navbar">
          <TopNav />
        </div>
        <main className="main-container">
          {children}
        </main>
      </div>
    </div>
  );
} 