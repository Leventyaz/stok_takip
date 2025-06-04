'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const pathname = usePathname();
  
  const navigation = [
    { name: 'Ana Sayfa', href: '/dashboard', icon: HomeIcon },
    { name: 'Stok Yönetimi', href: '/stok', icon: ArchiveBoxIcon },
    { name: 'İstatistikler', href: '/istatistikler', icon: ChartBarIcon },
    { name: 'Stok Hareketleri', href: '/hareketler', icon: ArrowPathIcon },
    { name: 'Raporlar', href: '/raporlar', icon: DocumentTextIcon },
    { name: 'Ayarlar', href: '/ayarlar', icon: CogIcon },
  ];
  
  const sidebarStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
  };
  
  const headerStyle = {
    height: '4rem',
    display: 'flex',
    alignItems: 'center',
    padding: '0 1.5rem',
    borderBottom: '1px solid #e5e7eb',
  };
  
  const logoStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#4f46e5',
  };
  
  const navStyle = {
    flex: '1',
    overflowY: 'auto' as const,
    padding: '1rem',
  };
  
  const footerStyle = {
    padding: '1rem',
    borderTop: '1px solid #e5e7eb',
  };
  
  const navItemStyle = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    marginBottom: '0.5rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    backgroundColor: isActive ? '#eef2ff' : 'transparent',
    color: isActive ? '#4f46e5' : '#374151',
    transition: 'background-color 0.2s',
  });
  
  const iconStyle = (isActive: boolean) => ({
    marginRight: '0.75rem',
    width: '1.25rem',
    height: '1.25rem',
    color: isActive ? '#4f46e5' : '#6b7280',
  });
  
  return (
    <div style={sidebarStyle}>
      <div style={headerStyle}>
        <h1 style={logoStyle}>Stok Takip</h1>
      </div>
      <nav style={navStyle}>
        <ul>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link href={item.href} style={navItemStyle(isActive)}>
                  <item.icon
                    style={iconStyle(isActive)}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div style={footerStyle}>
        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          © {new Date().getFullYear()} Stok Takip v1.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar; 