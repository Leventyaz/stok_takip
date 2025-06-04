const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

let db;

const setDb = (database) => {
  db = database;
};

// Kullanıcı girişi
const login = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const { email, sifre } = req.body;
    
    if (!email || !sifre) {
      return res.status(400).json({ message: 'Email ve şifre gerekli' });
    }
    
    // Kullanıcıyı bul
    const kullanici = await db.collection("kullanicilar").findOne({ email });
    
    if (!kullanici) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }
    
    // Şifreyi kontrol et
    const sifreEslesti = await bcrypt.compare(sifre, kullanici.sifre);
    
    if (!sifreEslesti) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }
    
    // JWT token oluştur
    const token = jwt.sign(
      { 
        id: kullanici._id,
        email: kullanici.email,
        ad: kullanici.ad,
        rol: kullanici.rol
      },
      process.env.JWT_SECRET || 'gizli-anahtar',
      { expiresIn: '1d' }
    );
    
    // Kullanıcı bilgilerini döndür (şifre hariç)
    const { sifre: _, ...kullaniciBilgileri } = kullanici;
    
    res.json({
      ...kullaniciBilgileri,
      token
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Kullanıcı kaydı
const register = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const { ad, email, sifre, rol = 'kullanici' } = req.body;
    
    if (!ad || !email || !sifre) {
      return res.status(400).json({ message: 'Ad, email ve şifre gerekli' });
    }
    
    // Email'in daha önce kullanılıp kullanılmadığını kontrol et
    const mevcutKullanici = await db.collection("kullanicilar").findOne({ email });
    
    if (mevcutKullanici) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
    }
    
    // Şifreyi hashle
    const hashedSifre = await bcrypt.hash(sifre, 10);
    
    // Yeni kullanıcı oluştur
    const yeniKullanici = {
      ad,
      email,
      sifre: hashedSifre,
      rol,
      olusturmaTarihi: new Date().toLocaleString('tr-TR'),
      sonGiris: null,
      aktif: true
    };
    
    const result = await db.collection("kullanicilar").insertOne(yeniKullanici);
    
    // JWT token oluştur
    const token = jwt.sign(
      { 
        id: result.insertedId,
        email,
        ad,
        rol
      },
      process.env.JWT_SECRET || 'gizli-anahtar',
      { expiresIn: '1d' }
    );
    
    // Kullanıcı bilgilerini döndür (şifre hariç)
    const { sifre: _, ...kullaniciBilgileri } = yeniKullanici;
    
    res.status(201).json({
      ...kullaniciBilgileri,
      _id: result.insertedId,
      token
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Kullanıcı bilgilerini getir
const getProfile = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Kullanıcı ID\'si gerekli' });
    }
    
    // Kullanıcıyı bul
    const kullanici = await db.collection("kullanicilar").findOne({ _id: new ObjectId(id) });
    
    if (!kullanici) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    // Şifreyi çıkar
    const { sifre, ...kullaniciBilgileri } = kullanici;
    
    res.json(kullaniciBilgileri);
  } catch (error) {
    console.error('Profil getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Profil güncelleme
const updateProfile = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const { id } = req.params;
    const { ad, email, telefon, adres, fotograf } = req.body;
    
    if (!id) {
      return res.status(400).json({ message: 'Kullanıcı ID\'si gerekli' });
    }
    
    // Güncelleme verilerini hazırla
    const guncellenenVeriler = {};
    
    if (ad) guncellenenVeriler.ad = ad;
    if (email) guncellenenVeriler.email = email;
    if (telefon !== undefined) guncellenenVeriler.telefon = telefon;
    if (adres !== undefined) guncellenenVeriler.adres = adres;
    if (fotograf !== undefined) guncellenenVeriler.fotograf = fotograf;
    
    // Son güncelleme tarihi ekle
    guncellenenVeriler.sonGuncelleme = new Date().toLocaleString('tr-TR');
    
    // Kullanıcıyı güncelle
    const result = await db.collection("kullanicilar").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: guncellenenVeriler },
      { returnDocument: 'after' }
    );
    
    if (!result.value) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    // Şifreyi çıkar
    const { sifre, ...kullaniciBilgileri } = result.value;
    
    res.json(kullaniciBilgileri);
  } catch (error) {
    console.error('Profil güncelleme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Şifre değiştirme
const changePassword = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    const { id } = req.params;
    const { mevcutSifre, yeniSifre } = req.body;
    
    if (!id || !mevcutSifre || !yeniSifre) {
      return res.status(400).json({ message: 'Kullanıcı ID\'si, mevcut şifre ve yeni şifre gerekli' });
    }
    
    // Kullanıcıyı bul
    const kullanici = await db.collection("kullanicilar").findOne({ _id: new ObjectId(id) });
    
    if (!kullanici) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    // Mevcut şifreyi kontrol et
    const sifreEslesti = await bcrypt.compare(mevcutSifre, kullanici.sifre);
    
    if (!sifreEslesti) {
      return res.status(401).json({ message: 'Mevcut şifre yanlış' });
    }
    
    // Yeni şifreyi hashle
    const hashedSifre = await bcrypt.hash(yeniSifre, 10);
    
    // Şifreyi güncelle
    await db.collection("kullanicilar").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          sifre: hashedSifre,
          sonGuncelleme: new Date().toLocaleString('tr-TR')
        } 
      }
    );
    
    res.json({ message: 'Şifre başarıyla güncellendi' });
  } catch (error) {
    console.error('Şifre değiştirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Tüm kullanıcıları getir (sadece admin)
const getAllUsers = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    // Sadece admin erişebilir kontrolü yapılabilir
    // if (req.user.rol !== 'admin') {
    //   return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    // }
    
    const kullanicilar = await db.collection("kullanicilar").find({}).toArray();
    
    // Şifreleri çıkar
    const kullaniciListesi = kullanicilar.map(kullanici => {
      const { sifre, ...kullaniciBilgileri } = kullanici;
      return kullaniciBilgileri;
    });
    
    res.json(kullaniciListesi);
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

// Kullanıcı silme (sadece admin)
const deleteUser = async (req, res) => {
  try {
    if (!db) {
      throw new Error('Veritabanı bağlantısı henüz hazır değil');
    }
    
    // Sadece admin erişebilir kontrolü yapılabilir
    // if (req.user.rol !== 'admin') {
    //   return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    // }
    
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Kullanıcı ID\'si gerekli' });
    }
    
    const result = await db.collection("kullanicilar").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    res.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  setDb,
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUser
}; 