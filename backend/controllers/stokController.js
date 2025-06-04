const { ObjectId } = require('mongodb');

let db;

const setDb = (database) => {
  db = database;
};

// Tüm stokları getir
const getAllStocks = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    let query = {};
    
    // Kritik stok filtresi
    if (req.query.critical === 'true') {
      query = { $expr: { $lte: ["$miktar", "$minStok"] } };
    }
    
    // Limit parametresi
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    
    const stoklar = await db.collection("stoks")
      .find(query)
      .limit(limit)
      .toArray();
    
    res.json(stoklar);
  } catch (error) {
    console.error('Stok getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Tek bir stok getir
const getStockById = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const stokId = new ObjectId(req.params.id);
    
    const stok = await db.collection("stoks").findOne({ _id: stokId });
    
    if (!stok) {
      return res.status(404).json({ message: 'Stok bulunamadı' });
    }
    
    res.json(stok);
  } catch (error) {
    console.error('Stok getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Yeni stok ekle
const createStock = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const stok = {
      ...req.body,
      tarih: new Date().toLocaleDateString('tr-TR')
    };
    
    const result = await db.collection("stoks").insertOne(stok);
    const yeniStok = { ...stok, _id: result.insertedId };
    
    // Hareket kaydı oluştur
    const hareket = {
      tarih: new Date().toLocaleString('tr-TR'),
      urunAdi: stok.ad,
      urunId: result.insertedId.toString(),
      islemTipi: 'GİRİŞ',
      miktar: stok.miktar,
      oncekiStok: 0,
      yeniStok: stok.miktar,
      aciklama: 'Yeni ürün girişi'
    };
    
    await db.collection("hareketler").insertOne(hareket);
    
    res.status(201).json(yeniStok);
  } catch (error) {
    console.error('Stok ekleme hatası:', error);
    res.status(400).json({ message: error.message });
  }
};

// Stok güncelle
const updateStock = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const stokId = new ObjectId(req.params.id);
    
    const stok = await db.collection("stoks").findOne({ _id: stokId });
    const oncekiMiktar = stok.miktar;
    const yeniMiktar = req.body.miktar;
    
    const result = await db.collection("stoks").findOneAndUpdate(
      { _id: stokId },
      { $set: req.body },
      { returnDocument: 'after' }
    );

    if (oncekiMiktar !== yeniMiktar) {
      const hareket = {
        tarih: new Date().toLocaleString('tr-TR'),
        urunAdi: result.value.ad,
        urunId: stokId.toString(),
        islemTipi: 'GÜNCELLEME',
        miktar: Math.abs(yeniMiktar - oncekiMiktar),
        oncekiStok: oncekiMiktar,
        yeniStok: yeniMiktar,
        aciklama: 'Manuel güncelleme'
      };
      
      await db.collection("hareketler").insertOne(hareket);
    }

    res.json(result.value);
  } catch (error) {
    console.error('Stok güncelleme hatası:', error);
    res.status(400).json({ message: error.message });
  }
};

// Stok sil
const deleteStock = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const stokId = new ObjectId(req.params.id);
    
    await db.collection("stoks").deleteOne({ _id: stokId });
    res.json({ message: 'Stok silindi' });
  } catch (error) {
    console.error('Stok silme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Stok girişi
const stockEntry = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const stokId = new ObjectId(req.params.id);
    
    const stok = await db.collection("stoks").findOne({ _id: stokId });
    const girisMiktari = parseInt(req.body.miktar);
    const oncekiMiktar = stok.miktar;
    const yeniMiktar = oncekiMiktar + girisMiktari;

    const result = await db.collection("stoks").findOneAndUpdate(
      { _id: stokId },
      { $set: { miktar: yeniMiktar } },
      { returnDocument: 'after' }
    );

    const hareket = {
      tarih: new Date().toLocaleString('tr-TR'),
      urunAdi: stok.ad,
      urunId: stokId.toString(),
      islemTipi: 'GİRİŞ',
      miktar: girisMiktari,
      oncekiStok: oncekiMiktar,
      yeniStok: yeniMiktar,
      aciklama: req.body.aciklama || 'Stok girişi'
    };
    
    await db.collection("hareketler").insertOne(hareket);

    res.json(result.value);
  } catch (error) {
    console.error('Stok giriş hatası:', error);
    res.status(400).json({ message: error.message });
  }
};

// Stok çıkışı
const stockExit = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const stokId = new ObjectId(req.params.id);
    
    const stok = await db.collection("stoks").findOne({ _id: stokId });
    const cikisMiktari = parseInt(req.body.miktar);
    const oncekiMiktar = stok.miktar;
    const yeniMiktar = oncekiMiktar - cikisMiktari;

    if (yeniMiktar < 0) {
      return res.status(400).json({ message: 'Yetersiz stok' });
    }

    const result = await db.collection("stoks").findOneAndUpdate(
      { _id: stokId },
      { $set: { miktar: yeniMiktar } },
      { returnDocument: 'after' }
    );

    const hareket = {
      tarih: new Date().toLocaleString('tr-TR'),
      urunAdi: stok.ad,
      urunId: stokId.toString(),
      islemTipi: 'ÇIKIŞ',
      miktar: cikisMiktari,
      oncekiStok: oncekiMiktar,
      yeniStok: yeniMiktar,
      aciklama: req.body.aciklama || 'Stok çıkışı'
    };
    
    await db.collection("hareketler").insertOne(hareket);

    res.json(result.value);
  } catch (error) {
    console.error('Stok çıkış hatası:', error);
    res.status(400).json({ message: error.message });
  }
};

// Ürüne ait hareketleri getir
const getStockMovements = async (req, res) => {
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

module.exports = {
  setDb,
  getAllStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  stockEntry,
  stockExit,
  getStockMovements
}; 