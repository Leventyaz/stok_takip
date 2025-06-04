'use client';

import { useState, useEffect } from 'react';

interface StokItem {
  _id: string;
  ad: string;
  kategori: string;
  miktar: number;
  fiyat: number;
  minStok: number;
  birim: string;
}

// Demo veri
const demoStoklar: StokItem[] = [
  { _id: '1', ad: 'Laptop Dell XPS 13', kategori: 'Elektronik', miktar: 5, fiyat: 15000, minStok: 3, birim: 'Adet' },
  { _id: '2', ad: 'Samsung Galaxy S21', kategori: 'Telefon', miktar: 2, fiyat: 8000, minStok: 5, birim: 'Adet' },
  { _id: '3', ad: 'HP LaserJet Pro', kategori: 'Yazıcı', miktar: 8, fiyat: 2000, minStok: 2, birim: 'Adet' },
  { _id: '4', ad: 'LG 4K Monitor', kategori: 'Elektronik', miktar: 10, fiyat: 3500, minStok: 4, birim: 'Adet' },
  { _id: '5', ad: 'Logitech MX Keys', kategori: 'Aksesuar', miktar: 3, fiyat: 1200, minStok: 5, birim: 'Adet' },
  { _id: '6', ad: 'Çelik Vida 3mm', kategori: 'Hırdavat', miktar: 120, fiyat: 0.5, minStok: 100, birim: 'Kutu' },
];

export function useStokData(type: 'all' | 'critical' = 'all', limit?: number) {
  const [stoklar, setStoklar] = useState<StokItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoklar = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Gerçek API entegrasyonu burada yapılacak
        // const response = await fetch('/api/stoklar');
        // const data = await response.json();
        
        // Şimdilik demo veriler kullanılıyor
        setTimeout(() => {
          // Kritik stokları filtrele
          const filteredData = type === 'critical'
            ? demoStoklar.filter(item => item.miktar <= item.minStok)
            : demoStoklar;
            
          setStoklar(limit ? filteredData.slice(0, limit) : filteredData);
          setLoading(false);
        }, 600);
      } catch (err) {
        setError('Stok verileri yüklenirken bir hata oluştu');
        setLoading(false);
      }
    };

    fetchStoklar();
  }, [type, limit]);

  return { stoklar, loading, error };
} 