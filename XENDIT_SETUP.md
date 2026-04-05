# 🎯 Xendit Integration Guide

## ✅ Yang Sudah Diimplementasikan

### Backend Files:
- **PaymentController.js** - Handler untuk invoice creation, status check, webhook, dan cancel
- **PaymentRoute.js** - Routing untuk payment endpoints
- **server.js** - Updated dengan payment routes
- **.env** - Added XENDIT_API_KEY

### Frontend Files:
- **Payment.jsx** - Updated dengan Xendit integration

---

## 🔧 Setup Instructions

### 1️⃣ **Backend Setup**

#### Step 1: Install Xendit Package
```bash
cd backend
npm install xendit-node
```

#### Step 2: Get API Key dari Xendit
1. Pergi ke https://dashboard.xendit.co
2. Login dengan akun Anda (buat jika belum ada)
3. Go to **Settings → API Keys**
4. Copy **Secret Key** (development atau production)

#### Step 3: Update .env
Ganti placeholder di `backend/.env`:
```
XENDIT_API_KEY=xnd_development_xxxxxxxxxxxxxx
```

#### Step 4: Update Redirect URLs (Optional)
Di `backend/controllers/PaymentController.js`, update URLs sesuai domain Anda:
- Line 37: `successRedirectUrl` - URL setelah payment sukses
- Line 38: `failureRedirectUrl` - URL jika payment gagal

---

### 2️⃣ **Frontend Setup**

Package.json sudah memiliki dependencies yang diperlukan. Tidak perlu install tambahan.

---

## 🚀 Testing Locally

### Start Backend:
```bash
cd backend
npm start
# Server akan berjalan di http://localhost:5000
```

### Start Frontend:
```bash
cd frontend
npm run dev
# Frontend akan berjalan di http://localhost:5173
```

### Test Payment:
1. Buka aplikasi di `http://localhost:5173`
2. Tambah produk ke cart
3. Checkout dan masuk payment page
4. Pilih payment method (E-Wallet atau VA)
5. Click "Confirm & Pay with Xendit"
6. Akan redirect ke Xendit payment page

### Test Cards (Development Mode):
Gunakan test card berikut:

**E-Wallet (QRIS):**
- Tidak perlu card, cukup scan QRIS

**Virtual Account:**
- BCA: 123456789 (Success)
- Mandiri: 987654321 (Success)

Lihat dokumentasi Xendit untuk test credentials lengkap: https://docs.xendit.co/

---

## 📡 Webhook Setup (Important!)

Untuk production, Anda perlu setup webhook agar payment status ter-update otomatis.

### 1. Setup Webhook di Dashboard Xendit:
1. Login ke https://dashboard.xendit.co
2. Go to **Settings → Callbacks**
3. Tambah webhook URL:
   ```
   https://yourdomain.com/api/payment/webhook
   ```
4. Select event: **Invoice.Paid**

### 2. Backend Webhook Handler:
Handler sudah ada di `PaymentController.js` fungsi `handleWebhook()`.
Update kode untuk save payment status ke database:

```javascript
// Di handleWebhook function, tambahkan:
if (status === 'PAID' || status === 'SETTLED') {
  // Update order di MongoDB
  await Order.findByIdAndUpdate(
    orderId,
    { status: 'Paid', paymentMethod: paymentMethod },
    { new: true }
  );
}
```

---

## 🔌 API Endpoints

### Create Invoice
```
POST http://localhost:5000/api/payment/create-invoice

Body:
{
  "amount": 50000,
  "description": "Order 123456",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "+6281234567890",
  "tracking_number": "123456",
  "payment_method": "E-Wallet" // atau "VA"
}

Response:
{
  "success": true,
  "data": {
    "invoiceId": "63f123abc456",
    "invoiceUrl": "https://app.xendit.co/web/invoices/63f123abc456",
    "invoiceCode": "SKN-123456",
    "amount": 50000,
    "status": "PENDING"
  }
}
```

### Get Invoice Status
```
GET http://localhost:5000/api/payment/invoice-status/{invoiceId}

Response:
{
  "success": true,
  "data": {
    "invoiceId": "63f123abc456",
    "status": "PAID",
    "amount": 50000,
    "paidAmount": 50000,
    "paymentMethod": "EWALLET"
  }
}
```

### Cancel Invoice
```
POST http://localhost:5000/api/payment/cancel-invoice/{invoiceId}

Response:
{
  "success": true,
  "message": "Invoice berhasil dibatalkan",
  "data": {
    "invoiceId": "63f123abc456",
    "status": "EXPIRED"
  }
}
```

---

## 💾 Database Integration (Next Step)

Untuk production, buat Order model di MongoDB:

```javascript
// models/Order.js
const orderSchema = new Schema({
  resi: String,
  invoiceId: String,
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String
  },
  items: Array,
  totalAmount: Number,
  paymentMethod: String,
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED', 'EXPIRED'],
    default: 'PENDING'
  },
  status: {
    type: String,
    enum: ['Pending Payment', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending Payment'
  },
  createdAt: { type: Date, default: Date.now },
  paidAt: Date
});
```

---

## 🐛 Troubleshooting

### Error: "Invalid API Key"
- Check .env file memiliki XENDIT_API_KEY yang benar
- Pastikan key dimulai dengan `xnd_development_` atau `xnd_production_`

### Webhook tidak terima callback
- Pastikan URL webhook public dan dapat diakses dari internet
- Gunakan ngrok untuk testing locally: `ngrok http 5000`
- Update webhook URL di Xendit dashboard

### Payment redirect tidak bekerja
- Check browser console untuk error messages
- Pastikan backend dan frontend berjalan di port yang tepat
- Clear localStorage dan cookies browser

---

## 📚 Resources

- **Xendit Docs**: https://docs.xendit.co/
- **API Reference**: https://xendit.stoplight.io/
- **Dashboard**: https://dashboard.xendit.co

---

## 📝 Notes

- Xendit support Indonesia payment methods: VA, E-Wallet, Credit Card, dll
- Fee terimplementasi otomatis, bisa disesuaikan per metode
- Invoice automatic expire dalam 7 hari (bisa diatur di dashboard)
- Untuk production, gunakan `xnd_production_` API key

---

**Integration selesai! 🎉 Happy coding!**
