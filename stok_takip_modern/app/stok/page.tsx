'use client';

import { useState } from 'react';
import StokList from '@/components/StokList';
import { PlusIcon, ArrowPathIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function StokYonetimi() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const categories = [
    { id: '', name: 'Tüm Kategoriler' },
    { id: 'elektronik', name: 'Elektronik' },
    { id: 'telefon', name: 'Telefon' },
    { id: 'yazici', name: 'Yazıcı' },
    { id: 'aksesuar', name: 'Aksesuar' },
    { id: 'hirdavat', name: 'Hırdavat' },
  ];

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

  const buttonContainerStyle = {
    display: 'flex',
    gap: '0.5rem',
  };

  const primaryButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const secondaryButtonStyle = {
    padding: '0.5rem',
    border: '1px solid #E5E7EB',
    borderRadius: '0.5rem',
    color: '#4B5563',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const mainContentStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const filterContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginBottom: '1.5rem',
    '@media (min-width: 768px)': {
      flexDirection: 'row',
    },
  };

  const searchContainerStyle = {
    position: 'relative' as const,
    flex: '1',
  };

  const searchInputStyle = {
    width: '100%',
    paddingLeft: '2.5rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    outline: 'none',
  };

  const searchIconStyle = {
    position: 'absolute' as const,
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1.25rem',
    height: '1.25rem',
    color: '#9CA3AF',
  };

  const filterStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const filterIconStyle = {
    width: '1.25rem',
    height: '1.25rem',
    color: '#9CA3AF',
    marginRight: '0.5rem',
  };

  const selectStyle = {
    padding: '0.5rem 1rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    outline: 'none',
  };

  const modalOverlayStyle = {
    position: 'fixed' as const,
    inset: '0',
    backgroundColor: 'rgba(75, 85, 99, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  };

  const modalContentStyle = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '32rem',
  };

  const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  };

  const modalTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#6B7280',
    cursor: 'pointer',
  };

  const closeIconStyle = {
    width: '1.5rem',
    height: '1.5rem',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.25rem',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.5rem',
    outline: 'none',
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  };

  const formFooterStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1rem',
  };

  const cancelButtonStyle = {
    padding: '0.5rem 1rem',
    border: '1px solid #D1D5DB',
    borderRadius: '0.375rem',
    color: '#4B5563',
    backgroundColor: 'white',
    cursor: 'pointer',
  };

  const saveButtonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Stok Yönetimi</h1>
        
        <div style={buttonContainerStyle}>
          <button 
            onClick={() => setShowAddModal(true)}
            style={primaryButtonStyle}
          >
            <PlusIcon style={{width: '1.25rem', height: '1.25rem'}} />
            <span>Yeni Stok</span>
          </button>
          
          <button style={secondaryButtonStyle}>
            <ArrowPathIcon style={{width: '1.25rem', height: '1.25rem'}} />
          </button>
        </div>
      </div>
      
      <div style={mainContentStyle}>
        <div style={filterContainerStyle}>
          <div style={searchContainerStyle}>
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
            <div style={searchIconStyle}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div style={filterStyle}>
            <FunnelIcon style={filterIconStyle} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={selectStyle}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <StokList type="all" />
      </div>
      
      {showAddModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={modalHeaderStyle}>
              <h2 style={modalTitleStyle}>Yeni Stok Ekle</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                style={closeButtonStyle}
              >
                <svg style={closeIconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form style={formStyle}>
              <div>
                <label style={labelStyle}>
                  Ürün Adı
                </label>
                <input 
                  type="text" 
                  style={inputStyle}
                />
              </div>
              
              <div style={gridContainerStyle}>
                <div>
                  <label style={labelStyle}>
                    Kategori
                  </label>
                  <select style={inputStyle}>
                    {categories.filter(c => c.id !== '').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label style={labelStyle}>
                    Birim
                  </label>
                  <select style={inputStyle}>
                    <option>Adet</option>
                    <option>Kutu</option>
                    <option>Kg</option>
                    <option>Metre</option>
                  </select>
                </div>
              </div>
              
              <div style={gridContainerStyle}>
                <div>
                  <label style={labelStyle}>
                    Miktar
                  </label>
                  <input 
                    type="number" 
                    style={inputStyle}
                  />
                </div>
                
                <div>
                  <label style={labelStyle}>
                    Fiyat
                  </label>
                  <input 
                    type="number" 
                    style={inputStyle}
                  />
                </div>
              </div>
              
              <div>
                <label style={labelStyle}>
                  Minimum Stok Seviyesi
                </label>
                <input 
                  type="number" 
                  style={inputStyle}
                />
              </div>
              
              <div style={formFooterStyle}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={cancelButtonStyle}
                >
                  İptal
                </button>
                <button
                  type="button"
                  style={saveButtonStyle}
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 