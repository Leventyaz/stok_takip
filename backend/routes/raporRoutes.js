const express = require('express');
const router = express.Router();
const raporController = require('../controllers/raporController');

// GET - Stok değer raporu
router.get('/stok-deger', raporController.getStokDegerRaporu);

// GET - Hareket raporu
router.get('/hareketler', raporController.getHareketRaporu);

// GET - Kritik stok raporu
router.get('/kritik-stok', raporController.getKritikStokRaporu);

// GET - Kategori raporu
router.get('/kategoriler', raporController.getKategoriRaporu);

// GET - Tüm raporları getir
router.get('/', raporController.getAllReports);

// POST - Rapor kaydet
router.post('/kaydet', raporController.saveReport);

module.exports = router; 