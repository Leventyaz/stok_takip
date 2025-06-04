const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
const { router, setDb } = require('./routes');

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

async function startServer() {
  try {
    // MongoDB'ye bağlan
    await client.connect();
    console.log("MongoDB'ye bağlanılıyor...");
    
    // Ping ile bağlantıyı test et
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB bağlantısı başarılı!");
    
    // Veritabanı ve koleksiyonları oluştur
    const db = client.db("stok_takip");
    
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
    
    try {
      await db.createCollection("kullanicilar");
      console.log("kullanicilar koleksiyonu oluşturuldu");
    } catch (error) {
      if (error.code !== 48) { // 48: collection already exists
        throw error;
      }
    }
    
    try {
      await db.createCollection("ayarlar");
      console.log("ayarlar koleksiyonu oluşturuldu");
    } catch (error) {
      if (error.code !== 48) { // 48: collection already exists
        throw error;
      }
    }
    
    try {
      await db.createCollection("raporlar");
      console.log("raporlar koleksiyonu oluşturuldu");
    } catch (error) {
      if (error.code !== 48) { // 48: collection already exists
        throw error;
      }
    }

    // Router'a veritabanı referansını geçir
    setDb(db);

    // API route'larını kullan
    app.use('/api', router);

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

// Server'ı başlat
startServer().catch(console.error); 