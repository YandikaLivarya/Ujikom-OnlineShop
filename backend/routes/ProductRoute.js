const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Route untuk mendapatkan semua produk
router.get('/', ProductController.getAllProducts);
// Route untuk menambahkan produk baru
router.post('/', ProductController.addproduct);
// Route untuk memperbarui produk berdasarkan ID
router.put('/:id', ProductController.updateProduct);
// Route untuk menghapus produk berdasarkan ID
router.delete('/:id', ProductController.deleteProduct);
// Route untuk mendapatkan produk berdasarkan ID
router.get('/:id', ProductController.getProductById);

module.exports = router;