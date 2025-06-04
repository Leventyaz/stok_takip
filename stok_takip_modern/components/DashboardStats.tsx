'use client';

import { useEffect, useState } from 'react';
import {
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

type StatsData = {
  totalProducts: number;
  totalValue: number;
  criticalStock: number;
  recentEntries: number;
}

const DashboardStats = () => {
  const [stats, setStats] = useState<StatsData>({
    totalProducts: 0,
    totalValue: 0,
    criticalStock: 0,
    recentEntries: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats');
        
        if (!response.ok) {
          throw new Error('İstatistik verileri yüklenirken bir hata oluştu.');
        }
        
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err: any) {
        console.error('İstatistik verileri alınırken hata:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    {
      name: 'Toplam Ürün',
      value: stats.totalProducts,
      icon: ArchiveBoxIcon,
      color: { bg: '#EBF5FF', text: '#3B82F6' }
    },
    {
      name: 'Toplam Değer',
      value: `${stats.totalValue.toLocaleString()} ₺`,
      icon: CurrencyDollarIcon,
      color: { bg: '#ECFDF5', text: '#10B981' }
    },
    {
      name: 'Kritik Stoklar',
      value: stats.criticalStock,
      icon: ExclamationTriangleIcon,
      color: { bg: '#FEF2F2', text: '#EF4444' }
    },
    {
      name: 'Son 30 Gün Giriş',
      value: stats.recentEntries,
      icon: ArrowTrendingUpIcon,
      color: { bg: '#F5F3FF', text: '#8B5CF6' }
    }
  ];

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem',
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    }
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const cardContentStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const iconContainerStyle = (color: string) => ({
    backgroundColor: color,
    padding: '0.5rem',
    borderRadius: '9999px',
  });

  const iconStyle = (color: string) => ({
    height: '1.25rem',
    width: '1.25rem',
    color: color,
  });

  const textContainerStyle = {
    marginLeft: '0.75rem',
  };

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#6B7280',
  };

  const valueStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
  };

  const loadingPulseStyle = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  const loadingCardStyle = {
    ...cardStyle,
    display: 'flex',
    alignItems: 'center',
  };

  const loadingIconStyle = {
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '9999px',
    backgroundColor: '#E5E7EB',
  };

  const loadingTextStyle = {
    marginLeft: '0.75rem',
    flex: 1,
  };

  const loadingTextLineStyle = {
    height: '0.5rem',
    backgroundColor: '#E5E7EB',
    borderRadius: '0.25rem',
    marginBottom: '0.375rem',
  };

  const errorStyle = {
    padding: '0.75rem',
    backgroundColor: '#FEF2F2',
    color: '#B91C1C',
    borderRadius: '0.375rem',
    marginBottom: '1.5rem',
    fontSize: '0.875rem',
  };

  if (loading) {
    return (
      <div style={gridStyle}>
        {[...Array(4)].map((_, idx) => (
          <div key={idx} style={loadingCardStyle}>
            <div style={loadingIconStyle}></div>
            <div style={loadingTextStyle}>
              <div style={{...loadingTextLineStyle, width: '50%'}}></div>
              <div style={{...loadingTextLineStyle, width: '70%'}}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={errorStyle}>
        <p>Hata: {error}</p>
        <p>MongoDB bağlantısını kontrol edin</p>
      </div>
    );
  }

  return (
    <div style={gridStyle}>
      {statItems.map((item) => (
        <div key={item.name} style={cardStyle}>
          <div style={cardContentStyle}>
            <div style={iconContainerStyle(item.color.bg)}>
              <item.icon style={iconStyle(item.color.text)} />
            </div>
            <div style={textContainerStyle}>
              <p style={labelStyle}>{item.name}</p>
              <p style={valueStyle}>{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats; 