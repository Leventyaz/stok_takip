'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  tarih: string;
  urunAdi: string;
  urunId: string;
  islemTipi: 'GİRİŞ' | 'ÇIKIŞ' | 'GÜNCELLEME';
  miktar: number;
  oncekiStok: number;
  yeniStok: number;
}

const RecentActivity = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/hareketler?limit=10');
        
        if (!response.ok) {
          throw new Error('Hareketler yüklenirken bir hata oluştu.');
        }
        
        const data = await response.json();
        setActivities(data);
        setError(null);
      } catch (err: any) {
        console.error('Hareket verileri alınırken hata:', err);
        setError(err.message);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Aktivitelerin türlerine göre renkler
  const activityStyles = {
    'GİRİŞ': { bg: '#ECFDF5', text: '#047857' },
    'ÇIKIŞ': { bg: '#FEF2F2', text: '#B91C1C' },
    'GÜNCELLEME': { bg: '#EFF6FF', text: '#1E40AF' }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  };

  const activityItemStyle = {
    borderBottom: '1px solid #E5E7EB',
    paddingBottom: '0.5rem',
  };

  const activityHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  };

  const productLinkStyle = {
    color: '#4F46E5',
    fontWeight: '500',
    textDecoration: 'none',
    fontSize: '0.75rem',
  };

  const dateStyle = {
    fontSize: '0.7rem',
    color: '#6B7280',
    marginTop: '0.125rem',
  };

  const badgeStyle = (type: 'GİRİŞ' | 'ÇIKIŞ' | 'GÜNCELLEME') => ({
    backgroundColor: activityStyles[type].bg,
    color: activityStyles[type].text,
    padding: '0.125rem 0.375rem',
    borderRadius: '9999px',
    fontSize: '0.7rem',
  });

  const activityDetailStyle = {
    marginTop: '0.25rem',
    fontSize: '0.75rem',
    color: '#6B7280',
  };

  const viewAllLinkStyle = {
    display: 'block',
    textAlign: 'center' as const,
    marginTop: '0.375rem',
    fontSize: '0.75rem',
    color: '#4F46E5',
    textDecoration: 'none',
  };

  const loadingPulseStyle = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  const loadingBarStyle = {
    height: '0.75rem',
    backgroundColor: '#E5E7EB',
    borderRadius: '0.25rem',
    marginBottom: '0.375rem',
  };

  const errorStyle = {
    padding: '0.75rem',
    backgroundColor: '#FEF2F2',
    color: '#B91C1C',
    borderRadius: '0.375rem',
    marginBottom: '0.75rem',
    fontSize: '0.75rem',
  };

  const noDataStyle = {
    textAlign: 'center' as const,
    padding: '0.75rem',
    color: '#6B7280',
    fontSize: '0.75rem',
  };

  if (loading) {
    return (
      <div style={loadingPulseStyle}>
        {[...Array(3)].map((_, idx) => (
          <div key={idx} style={{padding: '0.375rem 0'}}>
            <div style={{...loadingBarStyle, width: '25%', marginBottom: '0.375rem'}}></div>
            <div style={{...loadingBarStyle, width: '75%'}}></div>
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

  if (activities.length === 0) {
    return (
      <div style={noDataStyle}>
        <p>Hareket kaydı bulunamadı</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {activities.map((activity) => (
        <div key={activity.id} style={activityItemStyle}>
          <div style={activityHeaderStyle}>
            <div>
              <Link 
                href={`/stok/${activity.urunId}`}
                style={productLinkStyle}
              >
                {activity.urunAdi}
              </Link>
              <p style={dateStyle}>{activity.tarih}</p>
            </div>
            <span style={badgeStyle(activity.islemTipi)}>
              {activity.islemTipi}
            </span>
          </div>
          
          <div style={activityDetailStyle}>
            <span>
              {activity.islemTipi === 'GİRİŞ' && `${activity.miktar} adet stok girişi`}
              {activity.islemTipi === 'ÇIKIŞ' && `${activity.miktar} adet stok çıkışı`}
              {activity.islemTipi === 'GÜNCELLEME' && `Stok ${activity.oncekiStok}'dan ${activity.yeniStok}'a güncellendi`}
            </span>
          </div>
        </div>
      ))}
      
      <div>
        <Link href="/hareketler" style={viewAllLinkStyle}>
          Tüm Hareketleri Görüntüle
        </Link>
      </div>
    </div>
  );
};

export default RecentActivity; 