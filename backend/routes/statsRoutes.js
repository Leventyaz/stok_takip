const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// GET - Genel istatistikleri getir
router.get('/', statsController.getGeneralStats);

// GET - Kategori bazlı stok istatistikleri
router.get('/kategoriler', statsController.getCategoryStats);

// GET - Aylık stok giriş-çıkış istatistikleri
router.get('/aylik', statsController.getMonthlyStats);

// GET - En çok hareket gören ürünler
router.get('/aktif-urunler', statsController.getMostActiveProducts);

module.exports = router; 