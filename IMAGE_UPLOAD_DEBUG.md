# 🖼️ Image Upload Troubleshooting Guide

## ✅ Checklist Sebelum Upload

- [ ] Backend sudah running: `npm start` (di folder backend)
- [ ] Frontend sudah running: `npm run dev` (di folder frontend)
- [ ] Ngrok sudah running: `.\ngrok http 5000` (di folder root belajar)
- [ ] File size < 5MB
- [ ] File format: JPG, PNG, GIF, WebP

---

## 🔍 Debug Steps

### **Step 1: Check Backend Console**

Saat kamu upload foto, cek terminal backend untuk output:

```
✅ File uploaded: 1712500123456_socks.jpg
🔗 File URL: http://localhost:5000/uploads/1712500123456_socks.jpg
(or https://xxxx-xxx.ngrok-free.app/uploads/1712500123456_socks.jpg)
```

**Jika error, lihat console error message**.

---

### **Step 2: Check Browser Console**

1. Buka DevTools: **F12**
2. Ke tab **Console**
3. Upload foto lagi
4. Lihat error messages atau success logs:

```javascript
📤 Uploading file: socks.jpg
🔗 Upload endpoint: http://localhost:5000/api/upload
✅ Upload response: {imageUrl: "URL", filename: "...", message: "..."}
```

---

### **Step 3: Test Image URL Manually**

1. Copy image URL dari console atau form
2. Buka tab browser baru
3. Paste URL langsung di address bar
4. Lihat apakah foto muncul

**Contoh URL:**
```
http://localhost:5000/uploads/1712500123456_socks.jpg
```

---

## ❌ Common Issues & Fixes

### **Issue 1: "File uploaded" tapi foto tidak muncul**

**Kemungkinan:** URL path salah

**Fix:**
```bash
# Di backend folder
# Pastikan uploads folder ada
ls uploads

# Harus ada file kalau sudah upload
# Contoh output:
# 1712500123456_sock1.jpg
# 1712500234567_sock2.jpg
```

---

### **Issue 2: CORS Error saat load foto**

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Sudah fixed di server.js!** Pastikan sudah:
1. ` npm install cors` (jika belum)
2. Restart backend: `npm start`

---

### **Issue 3: "Failed to upload" alert**

Check console untuk error details:

**Jika error: "Only image files are allowed"**
- Pastikan file benar-benar image
- Coba format lain: JPG → PNG

**Jika error: "File size too large"**
- File > 5MB
- Compress foto dulu

---

### **Issue 4: Backend di Ngrok, tapi foto tidak bisa diakses**

**Masalah:** URL menggunakan localhost padahal seharusnya ngrok

**Fix:** Sudah otomatis di backend (mengambil dari request header)

Tapi pastikan:
1. Frontend mengakses via ngrok URL juga
2. Bukan localhost saat menggunakan ngrok

---

## 🧪 Manual Test

Kalau masih tidak bekerja, test upload via curl:

```bash
# Test upload dengan curl (Windows PowerShell)
$file = Get-Item "C:\Users\Lenovo\Downloads\socks.jpg"
$url = "http://localhost:5000/api/upload"

$form = @{file=$file}
Invoke-WebRequest -Uri $url -Method Post -Form $form

# Harus return JSON dengan imageUrl
```

---

## 📋 Pre-Upload Checklist

```bash
# 1. Check uploads folder exists
cd backend
dir uploads  # Harus ada folder ini

# 2. Check backend is running
# Harus lihat: "🚀 Server S*CKSOCKS jalan di port 5000"

# 3. Test upload endpoint
curl http://localhost:5000/api/upload
# Akan error "File required" tapi itu normal (bukan "Cannot POST")
```

---

## 🎯 What Should Happen

1. **Click "Choose image file"** → Select JPG/PNG
2. **File name shows** → "✓ socks.jpg"
3. **Click "📤 Upload"** → Button shows "⏳ Uploading..."
4. **Alert pops: "✅ Foto berhasil diupload!"**
5. **Image preview shows** → Small thumbnail appears
6. **Image URL displays** → "✓ Image Ready" + filename

---

## 🚀 Quick Fix: Restart Everything

If still not working, try full restart:

```bash
# Terminal 1 - Stop ngrok
Ctrl+C

# Terminal 2 - Stop backend
Ctrl+C

# Terminal 3 - Stop frontend
Ctrl+C

# Wait 5 seconds, then...

# Terminal 1 - Start ngrok
cd c:\Users\Lenovo\Desktop\belajar
.\ngrok http 5000

# Terminal 2 - Start backend
cd c:\Users\Lenovo\Desktop\belajar\backend
npm start

# Terminal 3 - Start frontend
cd c:\Users\Lenovo\Desktop\belajar\frontend
npm run dev

# Browser: Hard refresh Ctrl+Shift+R
# Try upload again
```

---

## 💬 If Still Not Working

Check these files exist:
- `backend/server.js` - Upload endpoint ✓
- `backend/uploads/` - Folder created ✓
- `frontend/src/Components/ModalAddProduct.jsx` - Upload handler ✓

If all files exist and restart doesn't help, share:
1. Browser console error (F12 → Console)
2. Backend terminal output (saat di-upload)
3. Screenshot modal form

Foto bisa masuk! Followup kalau masih error. 📸
