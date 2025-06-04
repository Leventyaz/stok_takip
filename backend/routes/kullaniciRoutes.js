const express = require('express');
const router = express.Router();
const kullaniciController = require('../controllers/kullaniciController');

// POST - Kullanıcı girişi
router.post('/login', kullaniciController.login);

// POST - Kullanıcı kaydı
router.post('/register', kullaniciController.register);

// GET - Kullanıcı profili
router.get('/:id', kullaniciController.getProfile);

// PUT - Profil güncelleme
router.put('/:id', kullaniciController.updateProfile);

// PUT - Şifre değiştirme
router.put('/:id/sifre', kullaniciController.changePassword);

// GET - Tüm kullanıcıları getir (sadece admin)
router.get('/', kullaniciController.getAllUsers);

// DELETE - Kullanıcı silme (sadece admin)
router.delete('/:id', kullaniciController.deleteUser);

module.exports = router; 