require('dotenv').config();
const axios = require('axios');
const Order = require('../models/Order');

// Xendit API configuration - gunakan HTTP call langsung
const XENDIT_API_KEY = process.env.XENDIT_API_KEY;
const XENDIT_BASE_URL = 'https://api.xendit.co/v2';

if (!XENDIT_API_KEY) {
  console.error('❌ XENDIT_API_KEY tidak ditemukan di .env file!');
}

// Helper untuk axios ke Xendit API
const xenditAPI = axios.create({
  baseURL: XENDIT_BASE_URL,
  headers: {
    'Authorization': `Basic ${Buffer.from(XENDIT_API_KEY + ':').toString('base64')}`,
    'Content-Type': 'application/json'
  }
});

console.log('✅ Xendit API configured');

exports.createInvoice = async (req, res) => {
  try {
    const { 
      amount, 
      description, 
      customer_email, 
      customer_name,
      customer_phone,
      tracking_number,
      payment_method
    } = req.body;

    console.log('📝 Received payment request:', {
      amount,
      customer_name,
      customer_email,
      customer_phone,
      payment_method
    });

    // Validasi minimal
    if (!amount || amount < 1000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Amount minimal 1000' 
      });
    }

    // Validasi nama customer - lebih fleksibel
    if (!customer_name) {
      console.error('❌ Customer name is empty');
      return res.status(400).json({ 
        success: false, 
        message: 'Nama customer harus diisi' 
      });
    }

    const trimmedName = String(customer_name).trim();
    if (trimmedName.length < 2) {
      console.error('❌ Customer name too short:', trimmedName);
      return res.status(400).json({ 
        success: false, 
        message: 'Nama customer minimal 2 karakter' 
      });
    }

    console.log('✅ Nama customer valid:', trimmedName);

    // Detect frontend origin dari request header
    const origin = req.get('origin') || 'http://localhost:5174';
    const successUrl = `${origin}/order-success`;
    const failureUrl = `${origin}/payment`;

    console.log('🌐 Frontend origin:', origin);
    console.log('📍 Redirect URLs:', { successUrl, failureUrl });

    // Format data untuk Xendit API - SIMPLE & STANDARD
    const invoicePayload = {
      external_id: `SKN-${tracking_number}`,
      amount: parseInt(amount),
      payer_email: customer_email || 'customer@example.com',
      description: description || `Order SKN-${tracking_number}`,
      items: [
        {
          name: 'Product Purchase',
          quantity: 1,
          price: parseInt(amount)
        }
      ],
      success_redirect_url: successUrl,
      failure_redirect_url: failureUrl
    };

    // JANGAN specify payment_methods - biarkan Xendit gunakan yang available
    // Xendit akan otomatis show channels yang sudah activated di dashboard

    console.log('📤 Sending to Xendit API:', JSON.stringify(invoicePayload, null, 2));

    // Call Xendit API
    const response = await xenditAPI.post('/invoices', invoicePayload);

    console.log('✅ Invoice created successfully:', response.data.id);
    console.log('📎 Invoice URL:', response.data.invoice_url);

    res.status(200).json({
      success: true,
      message: 'Invoice berhasil dibuat',
      data: {
        invoiceId: response.data.id,
        invoiceUrl: response.data.invoice_url,
        invoiceCode: response.data.external_id,
        amount: response.data.amount,
        status: response.data.status,
      },
    });

  } catch (error) {
    console.error('❌ Error creating invoice');
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('HTTP Status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal membuat invoice',
      error: error.response?.data?.message || error.message || 'Unknown error',
    });
  }
};

// ============================================
// GET INVOICE STATUS
// ============================================
exports.getInvoiceStatus = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: 'Invoice ID diperlukan',
      });
    }

    const response = await xenditAPI.get(`/invoices/${invoiceId}`);

    res.status(200).json({
      success: true,
      data: {
        invoiceId: response.data.id,
        status: response.data.status,
        amount: response.data.amount,
        paidAmount: response.data.paid_amount,
        paymentMethod: response.data.payment_method,
      },
    });

  } catch (error) {
    console.error('❌ Error getting invoice:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil status invoice',
      error: error.message,
    });
  }
};

// ============================================
// WEBHOOK - Handle Payment Notification
// ============================================
exports.handleWebhook = async (req, res) => {
  try {
    const {
      id,
      status,
      external_id,
      amount,
      payment_method,
    } = req.body;

    console.log('📌 Webhook received:', {
      invoiceId: id,
      status: status,
      externalId: external_id,
      amount: amount,
      payment_method: payment_method
    });

    // Update order status di database berdasarkan invoice status
    if (status === 'PAID' || status === 'SETTLED') {
      console.log('✅ Payment successful:', external_id);
      
      try {
        // Cari order berdasarkan invoiceId
        const order = await Order.findOneAndUpdate(
          { invoiceId: id },
          { 
            paymentStatus: 'PAID',
            updatedAt: Date.now(),
            status: 'Shipped' // Ubah status order ke Shipped saat bayar
          },
          { new: true }
        );

        if (order) {
          console.log('✅ Order updated successfully:', {
            resi: order.resi,
            paymentStatus: order.paymentStatus,
            status: order.status
          });
        } else {
          console.warn('⚠️ Order not found with invoiceId:', id);
        }
      } catch (updateError) {
        console.error('❌ Error updating order:', updateError.message);
      }

    } else if (status === 'EXPIRED') {
      console.log('⏰ Invoice expired:', external_id);
      
      try {
        const order = await Order.findOneAndUpdate(
          { invoiceId: id },
          { 
            paymentStatus: 'FAILED',
            updatedAt: Date.now()
          },
          { new: true }
        );

        if (order) {
          console.log('✅ Order marked as payment expired:', order.resi);
        }
      } catch (updateError) {
        console.error('❌ Error marking order as expired:', updateError.message);
      }

    } else if (status === 'PENDING') {
      console.log('⏳ Payment pending:', external_id);
      // Jangan ubah apapun, tetap tunggu
    }

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
    });

  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message,
    });
  }
};

// ============================================
// CANCEL INVOICE
// ============================================
exports.cancelInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        message: 'Invoice ID diperlukan',
      });
    }

    const response = await xenditAPI.post(`/invoices/${invoiceId}/expire`);

    res.status(200).json({
      success: true,
      message: 'Invoice berhasil dibatalkan',
      data: {
        invoiceId: response.data.id,
        status: response.data.status,
      },
    });

  } catch (error) {
    console.error('❌ Error canceling invoice:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal membatalkan invoice',
      error: error.message,
    });
  }
};

// ============================================
// CREATE ORDER
// ============================================
exports.createOrder = async (req, res) => {
  try {
    const {
      resi,
      customer,
      items,
      totalPaid,
      invoiceId,
      paymentMethod
    } = req.body;

    if (!resi || !customer || !items || !totalPaid) {
      return res.status(400).json({
        success: false,
        message: 'Data order tidak lengkap'
      });
    }

    const order = new Order({
      resi,
      date: new Date().toLocaleDateString('id-ID'),
      customer,
      items,
      totalPaid,
      invoiceId,
      paymentMethod,
      status: 'On Process',
      paymentStatus: 'PENDING'
    });

    await order.save();

    console.log('✅ Order created:', resi);

    res.status(201).json({
      success: true,
      message: 'Order berhasil dibuat',
      data: order
    });

  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal membuat order',
      error: error.message
    });
  }
};

// ============================================
// GET ALL ORDERS
// ============================================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
      total: orders.length
    });

  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data orders',
      error: error.message
    });
  }
};

// ============================================
// UPDATE ORDER STATUS
// ============================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak boleh kosong'
      });
    }

    const validStatus = ['On Process', 'Shipped', 'Out for Delivery', 'Delivered'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status tidak valid'
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, updatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    console.log('✅ Order status updated:', order.resi, 'to', status);

    res.status(200).json({
      success: true,
      message: 'Status order berhasil diperbarui',
      data: order
    });

  } catch (error) {
    console.error('❌ Error updating order status:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui status order',
      error: error.message
    });
  }
};

// ============================================
// GET ORDER BY RESI (Untuk Track Package)
// ============================================
exports.getOrderByResi = async (req, res) => {
  try {
    const { resi } = req.params;

    if (!resi) {
      return res.status(400).json({
        success: false,
        message: 'Resi tidak boleh kosong'
      });
    }

    const order = await Order.findOne({ resi: resi.toUpperCase() });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('❌ Error fetching order by resi:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data order',
      error: error.message
    });
  }
};

// ============================================
// GET ORDERS BY USER ID (Untuk User History)
// ============================================
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID diperlukan'
      });
    }

    const orders = await Order.find({ 'customer.userId': userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
      total: orders.length
    });

  } catch (error) {
    console.error('❌ Error fetching user orders:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data order user',
      error: error.message
    });
  }
};
