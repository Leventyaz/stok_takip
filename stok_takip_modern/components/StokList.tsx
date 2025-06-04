'use client';

import { useEffect, useState } from 'react';
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/20/solid';
import Link from 'next/link';

interface StokItem {
  _id: string;
  ad: string;
  kategori: string;
  miktar: number;
  fiyat: number;
  minStok: number;
  birim: string;
}

interface StokListProps {
  type?: 'all' | 'critical';
  limit?: number;
}

const StokList = ({ type = 'all', limit = 10 }: StokListProps) => {
  const [stoklar, setStoklar] = useState<StokItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoklar = async () => {
      try {
        setLoading(true);
        // API endpoint'ini oluştur
        const endpoint = `/api/stoklar?${type === 'critical' ? 'critical=true&' : ''}${limit ? `limit=${limit}` : ''}`;
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error('Stoklar yüklenirken bir hata oluştu.');
        }
        
        const data = await response.json();
        setStoklar(data);
        setError(null);
      } catch (err: any) {
        console.error('Stok verileri alınırken hata:', err);
        setError(err.message);
        setStoklar([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStoklar();
  }, [type, limit]);

  const tableContainerStyle = {
    overflowX: 'auto' as const,
    width: '100%',
  };

  const tableStyle = {
    minWidth: '100%',
    borderCollapse: 'collapse' as const,
  };

  const tableHeaderStyle = {
    textAlign: 'left' as const,
    padding: '0.5rem 0.75rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#6B7280',
    borderBottom: '1px solid #E5E7EB',
  };

  const tableHeaderRightStyle = {
    ...tableHeaderStyle,
    textAlign: 'right' as const,
  };

  const tableHeaderCenterStyle = {
    ...tableHeaderStyle,
    textAlign: 'center' as const,
  };

  const tableCellStyle = {
    padding: '0.5rem 0.75rem',
    borderBottom: '1px solid #E5E7EB',
    fontSize: '0.75rem',
  };

  const tableCellRightStyle = {
    ...tableCellStyle,
    textAlign: 'right' as const,
  };

  const linkStyle = {
    color: '#4F46E5',
    fontWeight: '500',
    textDecoration: 'none',
    fontSize: '0.75rem',
  };

  const categoryStyle = {
    color: '#6B7280',
    fontSize: '0.75rem',
  };

  const criticalStyle = {
    color: '#EF4444',
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.75rem',
  };

  const normalStyle = {
    color: '#10B981',
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.75rem',
  };

  const warningIconStyle = {
    height: '0.75rem',
    width: '0.75rem',
    marginLeft: '0.25rem',
    color: '#EF4444',
  };

  const actionButtonsStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.25rem',
  };

  const actionButtonStyle = (color: string) => ({
    padding: '0.15rem',
    color: color,
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  });

  const loadingPulseStyle = {
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  };

  const loadingBarStyle = {
    height: '1rem',
    backgroundColor: '#E5E7EB',
    borderRadius: '0.25rem',
    marginBottom: '0.5rem',
  };

  const noDataStyle = {
    textAlign: 'center' as const,
    padding: '1.5rem',
    color: '#6B7280',
  };

  const errorStyle = {
    padding: '1rem',
    backgroundColor: '#FEF2F2',
    color: '#B91C1C',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
  };

  if (loading) {
    return (
      <div style={loadingPulseStyle}>
        {[...Array(3)].map((_, idx) => (
          <div key={idx} style={{borderBottom: '1px solid #E5E7EB', padding: '0.5rem 0'}}>
            <div style={{...loadingBarStyle, width: '25%'}}></div>
            <div style={{...loadingBarStyle, width: '50%'}}></div>
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

  if (stoklar.length === 0) {
    return (
      <div style={noDataStyle}>
        <p>Stok bulunamadı</p>
      </div>
    );
  }

  return (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Ürün Adı</th>
            <th style={tableHeaderStyle}>Kategori</th>
            <th style={tableHeaderRightStyle}>Miktar</th>
            <th style={tableHeaderRightStyle}>Fiyat</th>
            {type === 'all' && (
              <th style={tableHeaderCenterStyle}>İşlemler</th>
            )}
          </tr>
        </thead>
        <tbody>
          {stoklar.map((stok) => (
            <tr key={stok._id}>
              <td style={tableCellStyle}>
                <Link href={`/stok/${stok._id}`} style={linkStyle}>
                  {stok.ad}
                </Link>
              </td>
              <td style={tableCellStyle}>
                <span style={categoryStyle}>{stok.kategori}</span>
              </td>
              <td style={tableCellRightStyle}>
                <span style={stok.miktar <= stok.minStok ? criticalStyle : normalStyle}>
                  {stok.miktar} {stok.birim}
                  {stok.miktar <= stok.minStok && (
                    <ExclamationTriangleIcon style={warningIconStyle} />
                  )}
                </span>
              </td>
              <td style={tableCellRightStyle}>{stok.fiyat.toLocaleString()} ₺</td>
              {type === 'all' && (
                <td style={tableCellRightStyle}>
                  <div style={actionButtonsStyle}>
                    <button style={actionButtonStyle('#10B981')}>
                      <PlusIcon style={{height: '1rem', width: '1rem'}} />
                    </button>
                    <button style={actionButtonStyle('#EF4444')}>
                      <MinusIcon style={{height: '1rem', width: '1rem'}} />
                    </button>
                    <button style={actionButtonStyle('#3B82F6')}>
                      <PencilIcon style={{height: '1rem', width: '1rem'}} />
                    </button>
                    <button style={actionButtonStyle('#6B7280')}>
                      <TrashIcon style={{height: '1rem', width: '1rem'}} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StokList; 