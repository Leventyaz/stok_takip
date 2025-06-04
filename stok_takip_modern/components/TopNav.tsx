'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BellIcon, 
  MagnifyingGlassIcon, 
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/authContext';

const TopNav = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const navigateToSettings = () => {
    router.push('/ayarlar');
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1.5rem',
    width: '100%',
    height: '100%',
  };

  const searchContainerStyle = {
    width: '100%',
    maxWidth: '28rem',
  };

  const searchInputContainerStyle = {
    position: 'relative' as const,
  };

  const searchIconStyle = {
    position: 'absolute' as const,
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1.25rem',
    height: '1.25rem',
    color: '#9ca3af',
  };

  const inputStyle = {
    width: '100%',
    paddingLeft: '2.5rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    borderRadius: '0.375rem',
    border: '1px solid #d1d5db',
    outline: 'none',
    transition: 'all 0.2s',
  };

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
  };

  const bellButtonStyle = {
    position: 'relative' as const,
    padding: '0.5rem',
    color: '#6b7280',
    transition: 'color 0.2s',
  };

  const notificationDotStyle = {
    position: 'absolute' as const,
    top: '0.25rem',
    right: '0.25rem',
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: '#ef4444',
    borderRadius: '9999px',
  };

  const userContainerStyle = {
    marginLeft: '1.5rem',
    position: 'relative' as const,
  };

  const userButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
  };

  const avatarStyle = {
    width: '2rem',
    height: '2rem',
    borderRadius: '9999px',
    marginRight: '0.5rem',
  };

  const dropdownStyle = {
    position: 'absolute' as const,
    right: '0',
    top: '100%',
    marginTop: '0.5rem',
    width: '12rem',
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 50,
    overflow: 'hidden',
  };

  const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
    cursor: 'pointer',
  };

  const iconStyle = {
    width: '1.25rem',
    height: '1.25rem',
    marginRight: '0.5rem',
  };

  return (
    <header style={headerStyle}>
      <div style={searchContainerStyle}>
        <div style={searchInputContainerStyle}>
          <MagnifyingGlassIcon style={searchIconStyle} />
          <input
            type="text"
            placeholder="Ürün veya kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>
      
      <div style={userSectionStyle}>
        <button style={bellButtonStyle}>
          <BellIcon style={{ width: '1.5rem', height: '1.5rem' }} />
          <span style={notificationDotStyle}></span>
        </button>
        <div style={userContainerStyle} ref={dropdownRef}>
          <div 
            style={userButtonStyle}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${user?.ad || 'User'}&background=0D8ABC&color=fff`}
              alt="User Avatar"
              style={avatarStyle}
            />
            <span>{user?.ad || 'Kullanıcı'}</span>
          </div>
          
          {dropdownOpen && (
            <div style={dropdownStyle}>
              <div style={{padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb'}}>
                <div style={{fontWeight: 'bold'}}>{user?.ad}</div>
                <div style={{fontSize: '0.75rem', color: '#6b7280'}}>{user?.email}</div>
              </div>
              <div style={dropdownItemStyle} onClick={navigateToSettings}>
                <CogIcon style={iconStyle} />
                Ayarlar
              </div>
              <div style={dropdownItemStyle} onClick={handleLogout}>
                <ArrowRightOnRectangleIcon style={iconStyle} />
                Çıkış Yap
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav; 