'use client';

import { useState, useEffect } from 'react';
import DashboardStats from '@/components/DashboardStats';
import StokList from '@/components/StokList';
import RecentActivity from '@/components/RecentActivity';

export default function Home() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // API'den veri yüklerken loading durumunu burada ayarlayabiliriz
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const loadingContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  };

  const spinnerStyle = {
    animation: 'spin 1s linear infinite',
    height: '2.5rem',
    width: '2.5rem',
    borderRadius: '9999px',
    borderTop: '2px solid #6366f1',
    borderBottom: '2px solid #6366f1',
    borderLeft: '2px solid transparent',
    borderRight: '2px solid transparent',
  };

  const containerStyle = {
    marginBottom: '1rem',
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '1rem',
    marginTop: '1rem',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    padding: '1rem',
  };

  const cardTitleStyle = {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: '0.75rem',
  };

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={spinnerStyle}></div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Dashboard</h1>
      
      <DashboardStats />
      
      <div style={gridStyle}>
        <div style={{...cardStyle, gridColumn: '1 / -1'}}>
          <h2 style={cardTitleStyle}>Kritik Stok Durumu</h2>
          <StokList type="critical" limit={5} />
        </div>
        
        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Son Aktiviteler</h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
} 