let db;

const setDb = (database) => {
  db = database;
};

// Sistem ayarlarını getir
const getSystemSettings = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    // Ayarlar koleksiyonu mevcut mu kontrol et, yoksa oluştur
    let ayarlar;
    
    try {
      ayarlar = await db.collection("ayarlar").findOne({ tip: 'sistem' });
      
      if (!ayarlar) {
        // Varsayılan ayarları oluştur
        const varsayilanAyarlar = {
          tip: 'sistem',
          sirketAdi: 'Stok Takip Sistemi',
          logo: '',
          kritikStokUyarisi: true,
          stokAlarmSeviyesi: 5,
          birimler: ['Adet', 'Kg', 'Lt', 'Paket', 'Kutu'],
          tema: 'light',
          sonGuncelleme: new Date().toLocaleString('tr-TR')
        };
        
        await db.collection("ayarlar").insertOne(varsayilanAyarlar);
        ayarlar = varsayilanAyarlar;
      }
      
    } catch (error) {
      console.error('Ayarlar koleksiyonu bulunamadı, oluşturuluyor');
      await db.createCollection("ayarlar");
      
      // Varsayılan ayarları oluştur
      const varsayilanAyarlar = {
        tip: 'sistem',
        sirketAdi: 'Stok Takip Sistemi',
        logo: '',
        kritikStokUyarisi: true,
        stokAlarmSeviyesi: 5,
        birimler: ['Adet', 'Kg', 'Lt', 'Paket', 'Kutu'],
        tema: 'light',
        sonGuncelleme: new Date().toLocaleString('tr-TR')
      };
      
      await db.collection("ayarlar").insertOne(varsayilanAyarlar);
      ayarlar = varsayilanAyarlar;
    }
    
    res.json(ayarlar);
  } catch (error) {
    console.error('Ayarları getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Sistem ayarlarını güncelle
const updateSystemSettings = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const yeniAyarlar = req.body;
    
    if (!yeniAyarlar) {
      return res.status(400).json({ message: 'Ayar verileri gerekli' });
    }
    
    // tip alanının değiştirilmesini engelle
    delete yeniAyarlar._id;
    yeniAyarlar.tip = 'sistem';
    yeniAyarlar.sonGuncelleme = new Date().toLocaleString('tr-TR');
    
    const result = await db.collection("ayarlar").findOneAndUpdate(
      { tip: 'sistem' },
      { $set: yeniAyarlar },
      { 
        upsert: true,
        returnDocument: 'after' 
      }
    );
    
    res.json(result.value || yeniAyarlar);
  } catch (error) {
    console.error('Ayarları güncelleme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Birimleri getir
const getBirimler = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const ayarlar = await db.collection("ayarlar").findOne({ tip: 'sistem' });
    
    if (!ayarlar || !ayarlar.birimler) {
      // Varsayılan birimler
      const varsayilanBirimler = ['Adet', 'Kg', 'Lt', 'Paket', 'Kutu'];
      res.json(varsayilanBirimler);
    } else {
      res.json(ayarlar.birimler);
    }
  } catch (error) {
    console.error('Birimleri getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Birimleri güncelle
const updateBirimler = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const { birimler } = req.body;
    
    if (!birimler || !Array.isArray(birimler)) {
      return res.status(400).json({ message: 'Birimler dizisi gerekli' });
    }
    
    const result = await db.collection("ayarlar").findOneAndUpdate(
      { tip: 'sistem' },
      { 
        $set: { 
          birimler,
          sonGuncelleme: new Date().toLocaleString('tr-TR')
        } 
      },
      { 
        upsert: true,
        returnDocument: 'after' 
      }
    );
    
    res.json(result.value.birimler);
  } catch (error) {
    console.error('Birimleri güncelleme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Yedekleme bilgilerini getir
const getBackupInfo = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    // Yedekleme bilgilerini al
    let yedeklemeBilgisi;
    
    try {
      yedeklemeBilgisi = await db.collection("ayarlar").findOne({ tip: 'yedekleme' });
      
      if (!yedeklemeBilgisi) {
        // Varsayılan yedekleme bilgisi oluştur
        const varsayilanYedekleme = {
          tip: 'yedekleme',
          sonYedekleme: null,
          otomatikYedekleme: false,
          yedeklemeAraligi: 'haftalik', // gunluk, haftalik, aylik
          yedeklemeler: []
        };
        
        await db.collection("ayarlar").insertOne(varsayilanYedekleme);
        yedeklemeBilgisi = varsayilanYedekleme;
      }
      
    } catch (error) {
      console.error('Yedekleme bilgisi alınamadı, varsayılan değerler kullanılıyor');
      
      // Varsayılan yedekleme bilgisi oluştur
      const varsayilanYedekleme = {
        tip: 'yedekleme',
        sonYedekleme: null,
        otomatikYedekleme: false,
        yedeklemeAraligi: 'haftalik', // gunluk, haftalik, aylik
        yedeklemeler: []
      };
      
      await db.collection("ayarlar").insertOne(varsayilanYedekleme);
      yedeklemeBilgisi = varsayilanYedekleme;
    }
    
    res.json(yedeklemeBilgisi);
  } catch (error) {
    console.error('Yedekleme bilgisi getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Yedekleme oluştur
const createBackup = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    // Tüm koleksiyonları yedekle
    const stoklar = await db.collection("stoks").find({}).toArray();
    const hareketler = await db.collection("hareketler").find({}).toArray();
    const kullanicilar = await db.collection("kullanicilar").find({}).toArray();
    const ayarlar = await db.collection("ayarlar").find({}).toArray();
    
    // Yedekleme verisi
    const yedeklemeVerisi = {
      stoklar,
      hareketler,
      kullanicilar,
      ayarlar,
      tarih: new Date().toLocaleString('tr-TR'),
      aciklama: req.body.aciklama || 'Manuel yedekleme'
    };
    
    // Yedekleme bilgisini güncelle
    const yedeklemeBilgisi = await db.collection("ayarlar").findOne({ tip: 'yedekleme' });
    
    if (yedeklemeBilgisi) {
      // Yedeklemeler dizisini güncelle
      const yedeklemeler = yedeklemeBilgisi.yedeklemeler || [];
      
      // Yeni yedekleme bilgisini ekle
      const yeniYedekleme = {
        id: new Date().getTime().toString(),
        tarih: new Date().toLocaleString('tr-TR'),
        boyut: JSON.stringify(yedeklemeVerisi).length,
        aciklama: req.body.aciklama || 'Manuel yedekleme'
      };
      
      yedeklemeler.push(yeniYedekleme);
      
      // Yedekleme bilgisini güncelle
      await db.collection("ayarlar").updateOne(
        { tip: 'yedekleme' },
        {
          $set: {
            sonYedekleme: new Date().toLocaleString('tr-TR'),
            yedeklemeler
          }
        }
      );
    } else {
      // Yedekleme bilgisi yoksa oluştur
      await db.collection("ayarlar").insertOne({
        tip: 'yedekleme',
        sonYedekleme: new Date().toLocaleString('tr-TR'),
        otomatikYedekleme: false,
        yedeklemeAraligi: 'haftalik',
        yedeklemeler: [{
          id: new Date().getTime().toString(),
          tarih: new Date().toLocaleString('tr-TR'),
          boyut: JSON.stringify(yedeklemeVerisi).length,
          aciklama: req.body.aciklama || 'Manuel yedekleme'
        }]
      });
    }
    
    res.json({
      message: 'Yedekleme başarıyla oluşturuldu',
      tarih: new Date().toLocaleString('tr-TR')
    });
  } catch (error) {
    console.error('Yedekleme oluşturma hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  setDb,
  getSystemSettings,
  updateSystemSettings,
  getBirimler,
  updateBirimler,
  getBackupInfo,
  createBackup
}; 