# 🔧 Xendit Integration - Troubleshooting & Testing Guide

## ✅ **Status Saat Ini (Sudah Diperbaiki)**

### Backend:
- ✅ Xendit initialized successfully
- ✅ API Key: `xnd_development_Rs4T...` (TEST KEY)
- ✅ PaymentController dengan error handling
- ✅ Payment routes siap di `/api/payment/create-invoice`

### Frontend:
- ✅ Payment.jsx dengan Xendit integration
- ✅ Error logging di console browser
- ✅ Loading state handling

### Servers Status:
- ✅ Backend: `http://localhost:5000`
- ✅ Frontend: `http://localhost:5174`
- ✅ MongoDB: Connected ✓

---

## 🚀 **Langkah Testing**

### Step 1: Pastikan Kedua Server Running
```bash
# Terminal 1 - Backend
cd backend
node server.js
# Output: "Server is running on port 5000" + "✅ Xendit initialized"

# Terminal 2 - Frontend
cd frontend
node node_modules/vite/bin/vite.js
# Output: "VITE ready" + URL (bisa 5173 atau 5174)
```

### Step 2: Buka Frontend di Browser
```
http://localhost:5174
```

### Step 3: Simulasi Pembayaran
1. **Tambah Produk ke Cart**
   - Pilih produk, klik add to cart
   
2. **Checkout**
   - Buka cart, klik checkout
   
3. **Masuk Payment Page**
   - Isi alamat pengiriman di modal
   - Click continue
   
4. **Pilih Payment Method**
   - Pilih "E-Wallet (QRIS)" atau "Virtual Account"
   
5. **Klik "Confirm & Pay with Xendit"**
   - Button akan jadi "Processing..."
   - Buka **Developer Console** (F12)

### Step 4: Debug di Browser Console
Lihat output di console untuk:
```
📤 Sending payment request: { amount, customer_name, ... }
📥 Backend response: { success: true, data: { invoiceUrl, ... } }
```

---

## 🐛 **Troubleshooting - Jika Ada Error**

### Error 1: "Unable to connect to remote server"
**Solusi:**
- Pastikan backend running: `node server.js`
- Check apakah di port 5000
- Coba test: `curl http://localhost:5000`

### Error 2: "❌ Gagal membuat invoice: Invalid secret key"
**Solusi:**
- API key di .env file tidak valid
- Ganti dengan API key baru dari https://dashboard.xendit.co
- Pastikan format: `xnd_development_xxx` atau `xnd_production_xxx`

### Error 3: "❌ Gagal membuat invoice: Email validation error"
**Solusi:**
- Email customer tidak valid
- Check di Payment.jsx apakah shipping info memiliki email valid
- Atau gunakan default: `noemail@example.com`

### Error 4: "Network request failed"
**Solusi:**
- Backend tidak berjalan
- Check firewall settings
- Coba ping: `curl http://localhost:5000`

---

## 📊 **Request/Response Format**

### Request ke Backend (dari Frontend):
```json
{
  "amount": 52000,
  "description": "Order SKN-123456",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "customer_phone": "081234567890",
  "tracking_number": 123456,
  "payment_method": "E-Wallet"
}
```

### Success Response (dari Backend):
```json
{
  "success": true,
  "message": "Invoice berhasil dibuat",
  "data": {
    "invoiceId": "63f1a2b3c4d5e6f7g8h9i0j1",
    "invoiceUrl": "https://app.xendit.co/web/invoices/63f1a2b3c4d5e6f7g8h9i0j1",
    "invoiceCode": "SKN-123456",
    "amount": 52000,
    "status": "PENDING"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Gagal membuat invoice",
  "error": "Invalid secret key provided..."
}
```

---

## 🧪 **Test Command**

Untuk test API tanpa frontend, gunakan:

```powershell
$body = @{
  amount=50000
  description="Test"
  customer_name="John"
  customer_email="john@test.com"
  customer_phone="081234567890"
  tracking_number="123456"
  payment_method="E-Wallet"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/payment/create-invoice" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

---

## 📍 **Key Files Updated**

1. **backend/controllers/PaymentController.js**
   - Xendit integration dengan error handling
   - Port URL updated ke 5174

2. **backend/routes/PaymentRoute.js**
   - Payment endpoints setup

3. **backend/server.js**
   - Import payment routes

4. **backend/.env**
   - XENDIT_API_KEY sudah ter-setup

5. **frontend/src/Pages/Payment.jsx**
   - Integration dengan Xendit API
   - Console logging untuk debug
   - Error messages lebih detail

---

## ✨ **Flow Summary**

```
Frontend Button Click
    ↓
Generate Tracking Number (SKN-XXXXXX)
    ↓
Send to Backend: POST /api/payment/create-invoice
    ↓
Backend Create Invoice via Xendit API
    ↓
Xendit Generate Payment URL
    ↓
Return invoiceUrl to Frontend
    ↓
Frontend: window.location.href = invoiceUrl
    ↓
Browser Redirect ke Xendit Payment Page
    ↓
User Bayar (test: click "Test Payment")
    ↓
Xendit Redirect ke Success URL: http://localhost:5174/order-success
    ↓
Show Order Success Page
```

---

## 🎯 **Next Steps**

1. **Test sekarang** dengan flow di atas
2. **Capture error** jika ada dan share di console output
3. **Integrasi Database** - Simpan order ke MongoDB saat payment sukses
4. **Setup Webhook** - Handle payment status updates
5. **Go Live** - Ganti API key dari development ke production

---

## 📞 **Support**

Jika error masih terjadi:
1. Check browser console (F12)
2. Check backend console untuk error logs
3. Klik "Test Payment" di Xendit payment page untuk simulasi
4. Review API key di https://dashboard.xendit.co

---

**Status: ✅ READY TO TEST**
