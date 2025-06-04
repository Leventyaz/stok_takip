let db;

const setDb = (database) => {
  db = database;
};

// Genel istatistikleri getir
const getGeneralStats = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    // Tüm stokları al
    const stoklar = await db.collection("stoks").find({}).toArray();
    
    // Son 30 gündeki giriş hareketlerini al
    const sonOtuzGun = new Date();
    sonOtuzGun.setDate(sonOtuzGun.getDate() - 30);
    const sonOtuzGunString = sonOtuzGun.toLocaleDateString('tr-TR');
    
    const sonHareketler = await db.collection("hareketler")
      .find({ 
        islemTipi: 'GİRİŞ',
        tarih: { $gte: sonOtuzGunString }
      })
      .toArray();
    
    // İstatistikleri hesapla
    const stats = {
      totalProducts: stoklar.length,
      totalValue: stoklar.reduce((acc, stok) => acc + (stok.miktar * stok.fiyat), 0),
      criticalStock: stoklar.filter(stok => stok.miktar <= stok.minStok).length,
      recentEntries: sonHareketler.length
    };
    
    res.json(stats);
  } catch (error) {
    console.error('İstatistik getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Kategori bazlı stok istatistikleri
const getCategoryStats = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    // Tüm kategorileri al
    const kategoriler = await db.collection("stoks").distinct("kategori");
    
    // Her kategori için istatistik hesapla
    const stats = await Promise.all(
      kategoriler.map(async (kategori) => {
        const stoklar = await db.collection("stoks").find({ kategori }).toArray();
        
        return {
          kategori,
          urunSayisi: stoklar.length,
          toplamDeger: stoklar.reduce((acc, stok) => acc + (stok.miktar * stok.fiyat), 0),
          kritikStokSayisi: stoklar.filter(stok => stok.miktar <= stok.minStok).length
        };
      })
    );
    
    res.json(stats);
  } catch (error) {
    console.error('Kategori istatistikleri getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Son 6 ay için aylık stok giriş-çıkış istatistikleri
const getMonthlyStats = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const hareketler = await db.collection("hareketler").find({}).toArray();
    
    // Son 6 ayın isimlerini oluştur
    const son6Ay = [];
    const simdi = new Date();
    
    for (let i = 0; i < 6; i++) {
      const tarih = new Date(simdi);
      tarih.setMonth(simdi.getMonth() - i);
      son6Ay.push({
        ay: tarih.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }),
        giris: 0,
        cikis: 0
      });
    }
    
    // Hareketleri aylara göre grupla
    hareketler.forEach(hareket => {
      try {
        const hareketTarihi = new Date(hareket.tarih.split(' ')[0]);
        const hareketAy = hareketTarihi.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
        
        const ayIstatistik = son6Ay.find(a => a.ay === hareketAy);
        
        if (ayIstatistik) {
          if (hareket.islemTipi === 'GİRİŞ') {
            ayIstatistik.giris += hareket.miktar;
          } else if (hareket.islemTipi === 'ÇIKIŞ') {
            ayIstatistik.cikis += hareket.miktar;
          }
        }
      } catch (error) {
        console.error('Tarih ayrıştırma hatası:', error);
      }
    });
    
    // Sıralamayı tersine çevir (en son ay başta olsun)
    son6Ay.reverse();
    
    res.json(son6Ay);
  } catch (error) {
    console.error('Aylık istatistik getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// En çok hareket gören ürünler
const getMostActiveProducts = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    // Tüm hareketleri al
    const hareketler = await db.collection("hareketler").find({}).toArray();
    
    // Ürün bazlı hareket sayılarını hesapla
    const urunHareketleri = {};
    
    hareketler.forEach(hareket => {
      if (!urunHareketleri[hareket.urunId]) {
        urunHareketleri[hareket.urunId] = {
          urunId: hareket.urunId,
          urunAdi: hareket.urunAdi,
          toplamHareket: 0,
          giris: 0,
          cikis: 0
        };
      }
      
      urunHareketleri[hareket.urunId].toplamHareket++;
      
      if (hareket.islemTipi === 'GİRİŞ') {
        urunHareketleri[hareket.urunId].giris += hareket.miktar;
      } else if (hareket.islemTipi === 'ÇIKIŞ') {
        urunHareketleri[hareket.urunId].cikis += hareket.miktar;
      }
    });
    
    // Ürünleri hareket sayısına göre sırala
    const siraliUrunler = Object.values(urunHareketleri)
      .sort((a, b) => b.toplamHareket - a.toplamHareket)
      .slice(0, 10); // İlk 10 ürünü al
    
    res.json(siraliUrunler);
  } catch (error) {
    console.error('En aktif ürün istatistikleri getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  setDb,
  getGeneralStats,
  getCategoryStats,
  getMonthlyStats,
  getMostActiveProducts
}; 