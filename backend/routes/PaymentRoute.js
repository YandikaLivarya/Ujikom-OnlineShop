const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/PaymentController');

// ============================================
// PAYMENT ROUTES
// ============================================

// POST: Buat Invoice Xendit
router.post('/create-invoice', paymentController.createInvoice);

// GET: Cek status invoice
router.get('/invoice-status/:invoiceId', paymentController.getInvoiceStatus);

// POST: Webhook dari Xendit
router.post('/webhook', paymentController.handleWebhook);

// POST: Cancel invoice
router.post('/cancel-invoice/:invoiceId', paymentController.cancelInvoice);

// ============================================
// ORDER ROUTES
// ============================================

// POST: Create order
router.post('/create-order', paymentController.createOrder);

// GET: Get all orders (untuk admin)
router.get('/all-orders', paymentController.getAllOrders);

// GET: Get order by resi (untuk track package)
router.get('/order/:resi', paymentController.getOrderByResi);

// GET: Get orders by user ID (untuk user order history)
router.get('/user-orders/:userId', paymentController.getUserOrders);

// PUT: Update order status (untuk admin)
router.put('/update-order-status/:orderId', paymentController.updateOrderStatus);

module.exports = router;
