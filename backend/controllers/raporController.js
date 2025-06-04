let db;

const setDb = (database) => {
  db = database;
};

// Stok değer raporu (ürünlerin toplam değeri)
const getStokDegerRaporu = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const stoklar = await db.collection("stoks").find({}).toArray();
    
    const urunDegerleri = stoklar.map(stok => ({
      urunId: stok._id.toString(),
      urunAdi: stok.ad,
      kategori: stok.kategori,
      miktar: stok.miktar,
      birim: stok.birim,
      birimFiyat: stok.fiyat,
      toplamDeger: stok.miktar * stok.fiyat
    }));
    
    // Toplam değeri hesapla
    const toplamDeger = urunDegerleri.reduce((toplam, urun) => toplam + urun.toplamDeger, 0);
    
    res.json({
      rapor: urunDegerleri,
      toplamDeger,
      olusturmaTarihi: new Date().toLocaleString('tr-TR')
    });
  } catch (error) {
    console.error('Stok değer raporu oluşturma hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Hareket raporu (belirli tarih aralığındaki stok hareketleri)
const getHareketRaporu = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const { baslangicTarihi, bitisTarihi, islemTipi } = req.query;
    
    if (!baslangicTarihi || !bitisTarihi) {
      return res.status(400).json({ message: 'Başlangıç ve bitiş tarihleri gerekli' });
    }
    
    const sorgu = {
      tarih: {
        $gte: baslangicTarihi,
        $lte: bitisTarihi
      }
    };
    
    // İşlem tipi filtresi
    if (islemTipi && ['GİRİŞ', 'ÇIKIŞ', 'GÜNCELLEME'].includes(islemTipi)) {
      sorgu.islemTipi = islemTipi;
    }
    
    const hareketler = await db.collection("hareketler")
      .find(sorgu)
      .sort({ tarih: -1 })
      .toArray();
    
    // İşlem tipine göre gruplama
    const gruplar = {
      'GİRİŞ': {
        hareketler: hareketler.filter(h => h.islemTipi === 'GİRİŞ'),
        toplamMiktar: 0
      },
      'ÇIKIŞ': {
        hareketler: hareketler.filter(h => h.islemTipi === 'ÇIKIŞ'),
        toplamMiktar: 0
      },
      'GÜNCELLEME': {
        hareketler: hareketler.filter(h => h.islemTipi === 'GÜNCELLEME'),
        toplamMiktar: 0
      }
    };
    
    // Toplam miktarları hesapla
    for (const tip in gruplar) {
      gruplar[tip].toplamMiktar = gruplar[tip].hareketler.reduce((toplam, hareket) => toplam + hareket.miktar, 0);
    }
    
    res.json({
      hareketler,
      gruplar,
      toplamHareket: hareketler.length,
      filtreKriterleri: {
        baslangicTarihi,
        bitisTarihi,
        islemTipi: islemTipi || 'Tümü'
      },
      olusturmaTarihi: new Date().toLocaleString('tr-TR')
    });
  } catch (error) {
    console.error('Hareket raporu oluşturma hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Kritik stok raporu (minimum stok seviyesinin altındaki ürünler)
const getKritikStokRaporu = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const kritikStoklar = await db.collection("stoks")
      .find({ $expr: { $lte: ["$miktar", "$minStok"] } })
      .toArray();
    
    // Kategoriye göre gruplama
    const kategoriGruplari = {};
    
    kritikStoklar.forEach(stok => {
      if (!kategoriGruplari[stok.kategori]) {
        kategoriGruplari[stok.kategori] = [];
      }
      kategoriGruplari[stok.kategori].push(stok);
    });
    
    res.json({
      kritikStoklar,
      kategoriGruplari,
      toplamKritikStok: kritikStoklar.length,
      olusturmaTarihi: new Date().toLocaleString('tr-TR')
    });
  } catch (error) {
    console.error('Kritik stok raporu oluşturma hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Kategori bazlı stok raporu
const getKategoriRaporu = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    // Tüm kategorileri al
    const kategoriler = await db.collection("stoks").distinct("kategori");
    
    // Her kategori için stok ve değer bilgilerini hesapla
    const kategoriRaporlari = await Promise.all(
      kategoriler.map(async (kategori) => {
        const stoklar = await db.collection("stoks").find({ kategori }).toArray();
        
        const toplamDeger = stoklar.reduce((toplam, stok) => toplam + (stok.miktar * stok.fiyat), 0);
        const toplamMiktar = stoklar.reduce((toplam, stok) => toplam + stok.miktar, 0);
        const kritikStokSayisi = stoklar.filter(stok => stok.miktar <= stok.minStok).length;
        
        return {
          kategori,
          urunSayisi: stoklar.length,
          toplamMiktar,
          toplamDeger,
          kritikStokSayisi,
          urunler: stoklar
        };
      })
    );
    
    res.json({
      kategoriRaporlari,
      toplamKategori: kategoriler.length,
      olusturmaTarihi: new Date().toLocaleString('tr-TR')
    });
  } catch (error) {
    console.error('Kategori raporu oluşturma hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Tüm raporları al
const getAllReports = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    // Raporlar koleksiyonu varsa oradan kayıtlı raporları getir
    let raporlar = [];
    
    try {
      raporlar = await db.collection("raporlar").find({}).sort({ tarih: -1 }).toArray();
    } catch (error) {
      console.error('Raporlar koleksiyonu bulunamadı, yeni koleksiyon oluşturulacak');
      await db.createCollection("raporlar");
    }
    
    res.json({
      raporlar,
      toplamRapor: raporlar.length,
      olusturmaTarihi: new Date().toLocaleString('tr-TR')
    });
  } catch (error) {
    console.error('Raporları getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Raporu kaydet
const saveReport = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const { raporAdi, raporTipi, raporVerisi, aciklama } = req.body;
    
    if (!raporAdi || !raporTipi || !raporVerisi) {
      return res.status(400).json({ message: 'Rapor adı, tipi ve verisi gerekli' });
    }
    
    const yeniRapor = {
      raporAdi,
      raporTipi,
      raporVerisi,
      aciklama: aciklama || '',
      tarih: new Date().toLocaleString('tr-TR'),
      olusturan: req.body.olusturan || 'Sistem'
    };
    
    const result = await db.collection("raporlar").insertOne(yeniRapor);
    
    res.status(201).json({
      ...yeniRapor,
      _id: result.insertedId
    });
  } catch (error) {
    console.error('Rapor kaydetme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  setDb,
  getStokDegerRaporu,
  getHareketRaporu,
  getKritikStokRaporu,
  getKategoriRaporu,
  getAllReports,
  saveReport
}; 