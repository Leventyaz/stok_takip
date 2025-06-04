'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  PencilIcon,
  CalendarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface StokHareket {
  _id: string;
  tarih: string;
  urunAdi: string;
  urunId: string;
  islemTipi: 'GİRİŞ' | 'ÇIKIŞ' | 'GÜNCELLEME';
  miktar: number;
  oncekiStok: number;
  yeniStok: number;
  aciklama?: string;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem'
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  },
  cardHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb'
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  filterLabel: {
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  select: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    outline: 'none',
    cursor: 'pointer'
  },
  datePicker: {
    padding: '0.5rem 0.75rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    outline: 'none'
  },
  tableContainer: {
    overflowX: 'auto' as const
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    padding: '0.75rem 1rem',
    textAlign: 'left' as const,
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  tableHeaderRight: {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    padding: '0.75rem 1rem',
    textAlign: 'right' as const,
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  tableHeaderCenter: {
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    padding: '0.75rem 1rem',
    textAlign: 'center' as const,
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  tableCell: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.875rem',
    color: '#4b5563'
  },
  tableCellRight: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.875rem',
    color: '#4b5563',
    textAlign: 'right' as const
  },
  tableCellCenter: {
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '0.875rem',
    color: '#4b5563',
    textAlign: 'center' as const
  },
  link: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '500'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.625rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  badgeGreen: {
    backgroundColor: '#d1fae5',
    color: '#065f46'
  },
  badgeRed: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c'
  },
  badgeBlue: {
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  icon: {
    width: '0.75rem',
    height: '0.75rem',
    marginRight: '0.25rem'
  },
  noData: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#6b7280'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 9rem)'
  },
  loadingSpinner: {
    width: '3rem',
    height: '3rem',
    borderRadius: '9999px',
    borderTop: '2px solid #4f46e5',
    borderBottom: '2px solid #4f46e5',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 9rem)'
  },
  errorMessage: {
    backgroundColor: '#fee2e2',
    borderRadius: '0.375rem',
    border: '1px solid #f87171',
    color: '#b91c1c',
    padding: '0.75rem 1rem'
  }
};

export default function StokHareketleri() {
  const [hareketler, setHareketler] = useState<StokHareket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHareketler = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/hareketler');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        console.log('Hareketler data:', data);
        setHareketler(data);
      } catch (err) {
        console.error('Hareketleri getirme hatası:', err);
        setError('Veriler yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    fetchHareketler();
  }, []);

  // Filtreleme işlemi
  const filteredHareketler = hareketler.filter(hareket => {
    // İşlem tipine göre filtrele
    if (filterType && hareket.islemTipi !== filterType) {
      return false;
    }
    
    // Tarih aralığına göre filtrele
    if (dateRange.start && dateRange.end) {
      // Burada tarih karşılaştırma işlemi yapılabilir
    }
    
    return true;
  });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorMessage}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Stok Hareketleri</h1>
      
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <div style={styles.filterContainer}>
            <div style={{display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' as const}}>
              <div style={styles.filterRow}>
                <FunnelIcon style={{width: '1.25rem', height: '1.25rem', color: '#9ca3af'}} />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={styles.select}
                >
                  <option value="">Tüm İşlemler</option>
                  <option value="GİRİŞ">Stok Girişleri</option>
                  <option value="ÇIKIŞ">Stok Çıkışları</option>
                  <option value="GÜNCELLEME">Güncellemeler</option>
                </select>
              </div>
              
              <div style={styles.filterRow}>
                <CalendarIcon style={{width: '1.25rem', height: '1.25rem', color: '#9ca3af'}} />
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    style={styles.datePicker}
                  />
                  <span style={{color: '#6b7280'}}>-</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    style={styles.datePicker}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Tarih</th>
                <th style={styles.tableHeader}>Ürün</th>
                <th style={styles.tableHeaderCenter}>İşlem Tipi</th>
                <th style={styles.tableHeaderRight}>Miktar</th>
                <th style={styles.tableHeaderRight}>Önceki Stok</th>
                <th style={styles.tableHeaderRight}>Yeni Stok</th>
                <th style={styles.tableHeader}>Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {filteredHareketler.map((hareket) => (
                <tr key={hareket._id}>
                  <td style={styles.tableCell}>{hareket.tarih}</td>
                  <td style={styles.tableCell}>
                    <a href={`/stok/${hareket.urunId}`} style={styles.link}>
                      {hareket.urunAdi}
                    </a>
                  </td>
                  <td style={styles.tableCellCenter}>
                    <span style={{
                      ...styles.badge,
                      ...(hareket.islemTipi === 'GİRİŞ' ? styles.badgeGreen : 
                        hareket.islemTipi === 'ÇIKIŞ' ? styles.badgeRed : 
                        styles.badgeBlue)
                    }}>
                      {hareket.islemTipi === 'GİRİŞ' && <ArrowUpIcon style={styles.icon} />}
                      {hareket.islemTipi === 'ÇIKIŞ' && <ArrowDownIcon style={styles.icon} />}
                      {hareket.islemTipi === 'GÜNCELLEME' && <PencilIcon style={styles.icon} />}
                      {hareket.islemTipi}
                    </span>
                  </td>
                  <td style={styles.tableCellRight}>
                    {hareket.miktar}
                  </td>
                  <td style={styles.tableCellRight}>
                    {hareket.oncekiStok}
                  </td>
                  <td style={styles.tableCellRight}>
                    {hareket.yeniStok}
                  </td>
                  <td style={styles.tableCell}>
                    {hareket.aciklama || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredHareketler.length === 0 && (
          <div style={styles.noData}>
            <p>Gösterilecek stok hareketi bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
} 