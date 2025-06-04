'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext';

interface SystemSettings {
  sirketAdi: string;
  logo: string;
  kritikStokUyarisi: boolean;
  stokAlarmSeviyesi: number;
  birimler: string[];
  tema: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SystemSettings>({
    sirketAdi: 'Stok Takip Sistemi',
    logo: '',
    kritikStokUyarisi: true,
    stokAlarmSeviyesi: 5,
    birimler: ['Adet', 'Kg', 'Lt', 'Paket', 'Kutu'],
    tema: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [newUnit, setNewUnit] = useState('');
  const [activeTab, setActiveTab] = useState('genel');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/ayarlar', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Settings fetch error:', error);
      setMessage({ text: 'Ayarlar yüklenirken bir hata oluştu', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('http://localhost:3001/api/ayarlar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        setMessage({ text: 'Ayarlar başarıyla kaydedildi', type: 'success' });
      } else {
        setMessage({ text: 'Ayarlar kaydedilirken bir hata oluştu', type: 'error' });
      }
    } catch (error) {
      console.error('Settings save error:', error);
      setMessage({ text: 'Ayarlar kaydedilirken bir hata oluştu', type: 'error' });
    } finally {
      setSaving(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }
  };

  const addUnit = () => {
    if (newUnit.trim() && !settings.birimler.includes(newUnit.trim())) {
      setSettings({
        ...settings,
        birimler: [...settings.birimler, newUnit.trim()]
      });
      setNewUnit('');
    }
  };

  const removeUnit = (unit: string) => {
    setSettings({
      ...settings,
      birimler: settings.birimler.filter(u => u !== unit)
    });
  };

  const createBackup = async () => {
    try {
      setSaving(true);
      const response = await fetch('http://localhost:3001/api/ayarlar/yedekleme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ aciklama: 'Manuel yedekleme' })
      });
      
      if (response.ok) {
        setMessage({ text: 'Yedekleme başarıyla oluşturuldu', type: 'success' });
      } else {
        setMessage({ text: 'Yedekleme oluşturulurken bir hata oluştu', type: 'error' });
      }
    } catch (error) {
      console.error('Backup error:', error);
      setMessage({ text: 'Yedekleme oluşturulurken bir hata oluştu', type: 'error' });
    } finally {
      setSaving(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }
  };

  const containerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    padding: '1.5rem',
  };

  const titleStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '1.5rem',
  };

  const tabsStyle = {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '1.5rem',
  };

  const tabStyle = (isActive: boolean) => ({
    padding: '0.75rem 1rem',
    fontWeight: isActive ? 'bold' : 'normal',
    color: isActive ? '#3b82f6' : '#6b7280',
    borderBottom: isActive ? '2px solid #3b82f6' : 'none',
    cursor: 'pointer',
  });

  const formGroupStyle = {
    marginBottom: '1.5rem',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '0.375rem',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
  };

  const dangerButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ef4444',
  };

  const messageStyle = (type: string) => ({
    padding: '0.75rem',
    borderRadius: '0.375rem',
    marginBottom: '1rem',
    backgroundColor: type === 'success' ? '#ecfdf5' : '#fee2e2',
    color: type === 'success' ? '#065f46' : '#991b1b',
    border: `1px solid ${type === 'success' ? '#a7f3d0' : '#fecaca'}`,
  });

  const unitContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
    marginTop: '0.5rem',
  };

  const unitTagStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
  };

  const removeButtonStyle = {
    marginLeft: '0.5rem',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  };

  const addUnitContainerStyle = {
    display: 'flex',
    marginTop: '0.5rem',
    gap: '0.5rem',
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
        <p style={{ marginTop: '1rem' }}>Ayarlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={titleStyle}>Sistem Ayarları</h1>
      
      {message.text && (
        <div style={messageStyle(message.type)}>
          {message.text}
        </div>
      )}
      
      <div style={containerStyle}>
        <div style={tabsStyle}>
          <div 
            style={tabStyle(activeTab === 'genel')} 
            onClick={() => setActiveTab('genel')}
          >
            Genel Ayarlar
          </div>
          <div 
            style={tabStyle(activeTab === 'birimler')} 
            onClick={() => setActiveTab('birimler')}
          >
            Birimler
          </div>
          <div 
            style={tabStyle(activeTab === 'yedekleme')} 
            onClick={() => setActiveTab('yedekleme')}
          >
            Yedekleme
          </div>
        </div>
        
        {activeTab === 'genel' && (
          <div>
            <div style={formGroupStyle}>
              <label htmlFor="companyName" style={labelStyle}>Şirket Adı</label>
              <input
                id="companyName"
                type="text"
                value={settings.sirketAdi}
                onChange={(e) => setSettings({...settings, sirketAdi: e.target.value})}
                style={inputStyle}
              />
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                <input
                  type="checkbox"
                  checked={settings.kritikStokUyarisi}
                  onChange={(e) => setSettings({...settings, kritikStokUyarisi: e.target.checked})}
                  style={{ marginRight: '0.5rem' }}
                />
                Kritik Stok Uyarılarını Göster
              </label>
            </div>
            
            <div style={formGroupStyle}>
              <label htmlFor="alarmLevel" style={labelStyle}>Stok Alarm Seviyesi</label>
              <input
                id="alarmLevel"
                type="number"
                min="0"
                value={settings.stokAlarmSeviyesi}
                onChange={(e) => setSettings({...settings, stokAlarmSeviyesi: parseInt(e.target.value)})}
                style={inputStyle}
              />
            </div>
            
            <div style={formGroupStyle}>
              <label htmlFor="theme" style={labelStyle}>Tema</label>
              <select
                id="theme"
                value={settings.tema}
                onChange={(e) => setSettings({...settings, tema: e.target.value})}
                style={inputStyle}
              >
                <option value="light">Açık</option>
                <option value="dark">Koyu</option>
              </select>
            </div>
          </div>
        )}
        
        {activeTab === 'birimler' && (
          <div>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Birimler</label>
              <div style={unitContainerStyle}>
                {settings.birimler.map((unit, index) => (
                  <div key={index} style={unitTagStyle}>
                    {unit}
                    <span 
                      style={removeButtonStyle}
                      onClick={() => removeUnit(unit)}
                    >
                      ×
                    </span>
                  </div>
                ))}
              </div>
              
              <div style={addUnitContainerStyle}>
                <input
                  type="text"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="Yeni birim ekle"
                  style={inputStyle}
                />
                <button 
                  onClick={addUnit}
                  style={buttonStyle}
                >
                  Ekle
                </button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'yedekleme' && (
          <div>
            <div style={formGroupStyle}>
              <p style={{ marginBottom: '1rem' }}>
                Veritabanının manuel olarak yedeğini alabilirsiniz. Bu işlem tüm veritabanı verilerini yedekler.
              </p>
              
              <button 
                onClick={createBackup}
                style={buttonStyle}
                disabled={saving}
              >
                {saving ? 'Yedekleniyor...' : 'Yedekleme Oluştur'}
              </button>
            </div>
          </div>
        )}
        
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            onClick={saveSettings}
            style={buttonStyle}
            disabled={saving}
          >
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
} 