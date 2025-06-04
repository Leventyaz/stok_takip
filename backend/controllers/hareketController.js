let db;

const setDb = (database) => {
  db = database;
};

// Tüm hareketleri getir
const getAllMovements = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    // Limit parametresi
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    
    const hareketler = await db.collection("hareketler")
      .find({})
      .sort({ tarih: -1 })
      .limit(limit)
      .toArray();
      
    res.json(hareketler);
  } catch (error) {
    console.error('Hareket getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir ürünün hareketlerini getir
const getMovementsByProduct = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const urunId = req.params.id;
    
    const hareketler = await db.collection("hareketler")
      .find({ urunId: urunId })
      .sort({ tarih: -1 })
      .toArray();
    
    res.json(hareketler);
  } catch (error) {
    console.error('Ürün hareketleri getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// İşlem tipine göre hareketleri getir (GİRİŞ, ÇIKIŞ, GÜNCELLEME)
const getMovementsByType = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const { type } = req.params;
    
    if (!['GİRİŞ', 'ÇIKIŞ', 'GÜNCELLEME'].includes(type)) {
      return res.status(400).json({ message: 'Geçersiz işlem tipi' });
    }
    
    const hareketler = await db.collection("hareketler")
      .find({ islemTipi: type })
      .sort({ tarih: -1 })
      .limit(20)
      .toArray();
    
    res.json(hareketler);
  } catch (error) {
    console.error('İşlem tipine göre hareket getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Tarih aralığına göre hareketleri getir
const getMovementsByDateRange = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Başlangıç ve bitiş tarihleri gerekli' });
    }
    
    const hareketler = await db.collection("hareketler")
      .find({
        tarih: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ tarih: -1 })
      .toArray();
    
    res.json(hareketler);
  } catch (error) {
    console.error('Tarih aralığına göre hareket getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Son 30 gündeki hareketleri getir
const getRecentMovements = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const sonOtuzGun = new Date();
    sonOtuzGun.setDate(sonOtuzGun.getDate() - 30);
    const sonOtuzGunString = sonOtuzGun.toLocaleDateString('tr-TR');
    
    const hareketler = await db.collection("hareketler")
      .find({ 
        tarih: { $gte: sonOtuzGunString }
      })
      .sort({ tarih: -1 })
      .toArray();
    
    res.json(hareketler);
  } catch (error) {
    console.error('Son hareketleri getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  setDb,
  getAllMovements,
  getMovementsByProduct,
  getMovementsByType,
  getMovementsByDateRange,
  getRecentMovements
}; 