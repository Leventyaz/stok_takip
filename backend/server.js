const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function startServer() {
  try {
    // MongoDB'ye bağlan
    await client.connect();
    console.log("MongoDB'ye bağlanılıyor...");
    
    // Ping ile bağlantıyı test et
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB bağlantısı başarılı!");
    
    // Veritabanı ve koleksiyonları oluştur
    db = client.db("stok_takip");
    
    try {
      await db.createCollection("stoks");
      console.log("stoks koleksiyonu oluşturuldu");
    } catch (error) {
      if (error.code !== 48) { // 48: collection already exists
        throw error;
      }
    }
    
    try {
      await db.createCollection("hareketler");
      console.log("hareketler koleksiyonu oluşturuldu");
    } catch (error) {
      if (error.code !== 48) { // 48: collection already exists
        throw error;
      }
    }

    // Server'ı başlat
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });

  } catch (error) {
    console.error("Başlangıç hatası:", error);
    process.exit(1);
  }
}

// Uygulama kapandığında bağlantıyı kapat
process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB bağlantısı kapatıldı');
  }
  process.exit(0);
});

// Routes
// Test endpoint
app.get('/api/test', async (req, res) => {
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

// Tüm stokları getir
app.get('/api/stoklar', async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    console.log('Stoklar isteniyor...');
    const stoklar = await db.collection("stoks").find({}).toArray();
    console.log('Bulunan stoklar:', stoklar);
    res.json(stoklar);
  } catch (error) {
    console.error('Stok getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// Yeni stok ekle
app.post('/api/stoklar', async (req, res) => {
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
});

// Stok güncelle
app.put('/api/stoklar/:id', async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const { ObjectId } = require('mongodb');
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
});

// Stok sil
app.delete('/api/stoklar/:id', async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const { ObjectId } = require('mongodb');
    const stokId = new ObjectId(req.params.id);
    
    await db.collection("stoks").deleteOne({ _id: stokId });
    res.json({ message: 'Stok silindi' });
  } catch (error) {
    console.error('Stok silme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// Stok girişi
app.post('/api/stoklar/:id/giris', async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const { ObjectId } = require('mongodb');
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
});

// Stok çıkışı
app.post('/api/stoklar/:id/cikis', async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const { ObjectId } = require('mongodb');
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
});

// Hareketleri getir
app.get('/api/hareketler', async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    const hareketler = await db.collection("hareketler")
      .find({})
      .sort({ tarih: -1 })
      .limit(20)
      .toArray();
      
    res.json(hareketler);
  } catch (error) {
    console.error('Hareket getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
});

// Server'ı başlat
startServer().catch(console.error); 