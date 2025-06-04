const express = require('express');
const router = express.Router();
const stokController = require('../controllers/stokController');

// GET - Tüm stokları getir
router.get('/', stokController.getAllStocks);

// GET - Tek bir stok getir
router.get('/:id', stokController.getStockById);

// POST - Yeni stok ekle
router.post('/', stokController.createStock);

// PUT - Stok güncelle
router.put('/:id', stokController.updateStock);

// DELETE - Stok sil
router.delete('/:id', stokController.deleteStock);

// POST - Stok girişi
router.post('/:id/giris', stokController.stockEntry);

// POST - Stok çıkışı
router.post('/:id/cikis', stokController.stockExit);

// GET - Ürün hareketleri
router.get('/:id/hareketler', stokController.getStockMovements);

module.exports = router; 