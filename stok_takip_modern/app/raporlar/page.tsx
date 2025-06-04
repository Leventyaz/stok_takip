'use client';

import { useState, useEffect } from 'react';
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ReportData {
  _id: string;
  title: string;
  description: string;
  date: string;
  type: 'stok' | 'satis' | 'alim';
  link: string;
}

export default function RaporlarPage() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/raporlar');
        if (!response.ok) {
          throw new Error('Raporlar yüklenirken bir hata oluştu.');
        }
        const data = await response.json();
        setReports(data);
        setError(null);
      } catch (err: any) {
        console.error('Raporlar alınırken hata:', err);
        setError(err.message);
        // Geçici olarak boş dizi atayalım ki sayfa çalışmaya devam etsin
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#1F2937',
  };

  const mainContentStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const reportsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '1rem',
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  };

  const reportCardStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
  };

  const reportHeaderStyle = {
    display: 'flex',
    padding: '1rem',
    backgroundColor: '#F9FAFB',
    borderBottom: '1px solid #E5E7EB',
  };

  const reportIconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.5rem',
    height: '2.5rem',
    backgroundColor: '#EFF6FF',
    borderRadius: '0.375rem',
    marginRight: '0.75rem',
  };

  const iconStyle = {
    width: '1.25rem',
    height: '1.25rem',
    color: '#3B82F6',
  };

  const reportInfoStyle = {
    flex: '1',
  };

  const reportTitleStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '0.25rem',
  };

  const reportDateStyle = {
    fontSize: '0.75rem',
    color: '#6B7280',
  };

  const reportBodyStyle = {
    padding: '1rem',
    flex: '1',
  };

  const reportDescriptionStyle = {
    color: '#4B5563',
    fontSize: '0.875rem',
    marginBottom: '1rem',
  };

  const downloadButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#3B82F6',
    color: 'white',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const loadingContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  };

  const spinnerStyle = {
    width: '2rem',
    height: '2rem',
    borderRadius: '9999px',
    borderTop: '2px solid #3B82F6',
    borderRight: '2px solid transparent',
    animation: 'spin 1s linear infinite',
  };

  const errorContainerStyle = {
    padding: '1rem',
    backgroundColor: '#FEF2F2',
    color: '#B91C1C',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
  };

  const noDataStyle = {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#6B7280',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Raporlar</h1>
      </div>
      
      <div style={mainContentStyle}>
        {error && (
          <div style={errorContainerStyle}>
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <div style={loadingContainerStyle}>
            <div style={spinnerStyle}></div>
          </div>
        ) : reports.length === 0 ? (
          <div style={noDataStyle}>
            <p>Henüz rapor bulunmamaktadır.</p>
          </div>
        ) : (
          <div style={reportsGridStyle}>
            {reports.map((report) => (
              <div key={report._id} style={reportCardStyle}>
                <div style={reportHeaderStyle}>
                  <div style={reportIconStyle}>
                    <DocumentTextIcon style={iconStyle} />
                  </div>
                  <div style={reportInfoStyle}>
                    <h3 style={reportTitleStyle}>{report.title}</h3>
                    <p style={reportDateStyle}>{report.date}</p>
                  </div>
                </div>
                <div style={reportBodyStyle}>
                  <p style={reportDescriptionStyle}>{report.description}</p>
                  <button style={downloadButtonStyle}>
                    <ArrowDownTrayIcon style={{ width: '1rem', height: '1rem' }} />
                    <span>İndir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 