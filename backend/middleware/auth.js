const jwt = require('jsonwebtoken');

// Kimlik doğrulama için middleware
const auth = (req, res, next) => {
  try {
    // Authorization header'ından token al
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Kimlik doğrulama başarısız: Token bulunamadı' });
    }
    
    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli-anahtar');
    
    // Kullanıcı bilgilerini request'e ekle
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Kimlik doğrulama hatası:', error);
    res.status(401).json({ message: 'Kimlik doğrulama başarısız: Geçersiz token' });
  }
};

// Admin yetkisi kontrolü için middleware
const adminAuth = (req, res, next) => {
  try {
    // Önce normal auth kontrolünü yap
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Kimlik doğrulama başarısız: Token bulunamadı' });
    }
    
    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli-anahtar');
    
    // Kullanıcı bilgilerini request'e ekle
    req.user = decoded;
    
    // Admin kontrolü
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }
    
    next();
  } catch (error) {
    console.error('Kimlik doğrulama hatası:', error);
    res.status(401).json({ message: 'Kimlik doğrulama başarısız: Geçersiz token' });
  }
};

module.exports = { auth, adminAuth }; 