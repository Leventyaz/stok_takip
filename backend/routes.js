const express = require('express');
const router = express.Router();
const stokController = require('./controllers/stokController');
const hareketController = require('./controllers/hareketController');
const statsController = require('./controllers/statsController');
const raporController = require('./controllers/raporController');
const ayarlarController = require('./controllers/ayarlarController');
const kullaniciController = require('./controllers/kullaniciController');

// Alt router'ları import et
const stokRoutes = require('./routes/stokRoutes');
const hareketRoutes = require('./routes/hareketRoutes');
const statsRoutes = require('./routes/statsRoutes');
const raporRoutes = require('./routes/raporRoutes');
const ayarlarRoutes = require('./routes/ayarlarRoutes');
const kullaniciRoutes = require('./routes/kullaniciRoutes');

// Veritabanı referansını saklamak için
let db;

// Veritabanı referansını ayarlamak için fonksiyon
const setDb = (database) => {
  db = database;
  
  // Tüm controller'lara veritabanı referansını gönder
  stokController.setDb(database);
  hareketController.setDb(database);
  statsController.setDb(database);
  raporController.setDb(database);
  ayarlarController.setDb(database);
  kullaniciController.setDb(database);
};

// Test endpoint
router.get('/test', async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    res.json({ 
      message: 'API çalışıyor',
      timestamp: new Date().toISOString(),
      dbStatus: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message,
      timestamp: new Date().toISOString(),
      dbStatus: 'disconnected'
    });
  }
});

// Alt router'ları kullan
router.use('/stoklar', stokRoutes);
router.use('/hareketler', hareketRoutes);
router.use('/stats', statsRoutes);
router.use('/raporlar', raporRoutes);
router.use('/ayarlar', ayarlarRoutes);
router.use('/kullanicilar', kullaniciRoutes);

// Kategoriler
router.get('/kategoriler', async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const kategoriler = await db.collection("stoks").distinct("kategori");
    res.json(kategoriler);
  } catch (error) {
    console.error('Kategori getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/kategoriler/:kategori/stoklar', async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const { kategori } = req.params;
    const stoklar = await db.collection("stoks")
      .find({ kategori: kategori })
      .toArray();
      
    res.json(stoklar);
  } catch (error) {
    console.error('Kategori bazlı stok getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// Arama endpoint'i
router.get('/arama', async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Arama terimi gerekli' });
    }
    
    const aramaRegex = new RegExp(q.toString(), 'i');
    
    const sonuclar = await db.collection("stoks")
      .find({ 
        $or: [
          { ad: aramaRegex },
          { kategori: aramaRegex },
          { aciklama: aramaRegex }
        ]
      })
      .limit(20)
      .toArray();
    
    res.json(sonuclar);
  } catch (error) {
    console.error('Arama hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = { router, setDb }; 