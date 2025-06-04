const express = require('express');
const router = express.Router();
const hareketController = require('../controllers/hareketController');

// GET - Tüm hareketleri getir
router.get('/', hareketController.getAllMovements);

// GET - Ürün bazlı hareketleri getir
router.get('/urun/:id', hareketController.getMovementsByProduct);

// GET - İşlem tipine göre hareketleri getir
router.get('/tip/:type', hareketController.getMovementsByType);

// GET - Tarih aralığına göre hareketleri getir
router.get('/tarih', hareketController.getMovementsByDateRange);

// GET - Son 30 gündeki hareketleri getir
router.get('/son-hareketler', hareketController.getRecentMovements);

module.exports = router; 