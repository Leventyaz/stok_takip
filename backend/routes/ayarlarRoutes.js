const express = require('express');
const router = express.Router();
const ayarlarController = require('../controllers/ayarlarController');

// GET - Sistem ayarlarını getir
router.get('/', ayarlarController.getSystemSettings);

// PUT - Sistem ayarlarını güncelle
router.put('/', ayarlarController.updateSystemSettings);

// GET - Birimleri getir
router.get('/birimler', ayarlarController.getBirimler);

// PUT - Birimleri güncelle
router.put('/birimler', ayarlarController.updateBirimler);

// GET - Yedekleme bilgilerini getir
router.get('/yedekleme', ayarlarController.getBackupInfo);

// POST - Yedekleme oluştur
router.post('/yedekleme', ayarlarController.createBackup);

module.exports = router; 