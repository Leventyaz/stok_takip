const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantı hatası:', err));

// Stok şeması
const stokSchema = new mongoose.Schema({
  ad: String,
  kategori: String,
  miktar: Number,
  fiyat: Number,
  tarih: { type: String, default: () => new Date().toLocaleDateString('tr-TR') }
});

const Stok = mongoose.model('Stok', stokSchema);

// Hareket şeması
const hareketSchema = new mongoose.Schema({
  tarih: { type: String, default: () => new Date().toLocaleString('tr-TR') },
  urunAdi: String,
  urunId: String,
  islemTipi: String,
  miktar: Number,
  oncekiStok: Number,
  yeniStok: Number,
  aciklama: String
});

const Hareket = mongoose.model('Hareket', hareketSchema);

// Routes
// Tüm stokları getir
app.get('/api/stoklar', async (req, res) => {
  try {
    const stoklar = await Stok.find();
    res.json(stoklar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni stok ekle
app.post('/api/stoklar', async (req, res) => {
  const stok = new Stok(req.body);
  try {
    const yeniStok = await stok.save();
    
    // Hareket kaydı oluştur
    const hareket = new Hareket({
      urunAdi: stok.ad,
      urunId: yeniStok._id,
      islemTipi: 'GİRİŞ',
      miktar: stok.miktar,
      oncekiStok: 0,
      yeniStok: stok.miktar,
      aciklama: 'Yeni ürün girişi'
    });
    await hareket.save();
    
    res.status(201).json(yeniStok);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Stok güncelle
app.put('/api/stoklar/:id', async (req, res) => {
  try {
    const stok = await Stok.findById(req.params.id);
    const oncekiMiktar = stok.miktar;
    const yeniMiktar = req.body.miktar;
    
    const guncelStok = await Stok.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (oncekiMiktar !== yeniMiktar) {
      const hareket = new Hareket({
        urunAdi: guncelStok.ad,
        urunId: guncelStok._id,
        islemTipi: 'GÜNCELLEME',
        miktar: Math.abs(yeniMiktar - oncekiMiktar),
        oncekiStok: oncekiMiktar,
        yeniStok: yeniMiktar,
        aciklama: 'Manuel güncelleme'
      });
      await hareket.save();
    }

    res.json(guncelStok);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Stok sil
app.delete('/api/stoklar/:id', async (req, res) => {
  try {
    await Stok.findByIdAndDelete(req.params.id);
    res.json({ message: 'Stok silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stok girişi
app.post('/api/stoklar/:id/giris', async (req, res) => {
  try {
    const stok = await Stok.findById(req.params.id);
    const girisMiktari = parseInt(req.body.miktar);
    const oncekiMiktar = stok.miktar;
    const yeniMiktar = oncekiMiktar + girisMiktari;

    const guncelStok = await Stok.findByIdAndUpdate(
      req.params.id,
      { miktar: yeniMiktar },
      { new: true }
    );

    const hareket = new Hareket({
      urunAdi: stok.ad,
      urunId: stok._id,
      islemTipi: 'GİRİŞ',
      miktar: girisMiktari,
      oncekiStok: oncekiMiktar,
      yeniStok: yeniMiktar,
      aciklama: req.body.aciklama || 'Stok girişi'
    });
    await hareket.save();

    res.json(guncelStok);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Stok çıkışı
app.post('/api/stoklar/:id/cikis', async (req, res) => {
  try {
    const stok = await Stok.findById(req.params.id);
    const cikisMiktari = parseInt(req.body.miktar);
    const oncekiMiktar = stok.miktar;
    const yeniMiktar = oncekiMiktar - cikisMiktari;

    if (yeniMiktar < 0) {
      return res.status(400).json({ message: 'Yetersiz stok' });
    }

    const guncelStok = await Stok.findByIdAndUpdate(
      req.params.id,
      { miktar: yeniMiktar },
      { new: true }
    );

    const hareket = new Hareket({
      urunAdi: stok.ad,
      urunId: stok._id,
      islemTipi: 'ÇIKIŞ',
      miktar: cikisMiktari,
      oncekiStok: oncekiMiktar,
      yeniStok: yeniMiktar,
      aciklama: req.body.aciklama || 'Stok çıkışı'
    });
    await hareket.save();

    res.json(guncelStok);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Hareketleri getir
app.get('/api/hareketler', async (req, res) => {
  try {
    const hareketler = await Hareket.find().sort({ tarih: -1 }).limit(20);
    res.json(hareketler);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
}); 