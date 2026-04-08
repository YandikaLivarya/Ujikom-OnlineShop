# 📁 File Upload Setup - Inventory Images

## ✅ What's Been Updated

### Backend Changes
- ✅ `server.js` - Added multer configuration & static file serving
- ✅ `backend/.gitignore` - Ignores uploads folder & node_modules

### Frontend Changes  
- ✅ `ModalAddProduct.jsx` - File input UI + upload functionality

---

## 🚀 Installation Steps (REQUIRED)

### Step 1: Install Multer in Backend

Run this command in the backend folder:

```bash
cd c:\Users\Lenovo\Desktop\belajar\backend
npm install multer
```

This installs the file upload package.

---

### Step 2: Restart Backend Server

```bash
npm start
```

The server will create an `uploads` folder automatically on first run.

---

## 🎯 How to Use

### Adding/Editing Products with Image Upload

1. **Click "+ Add New Sock"** button in Inventory
2. **Fill in basic info**: Name, Price, Stock, Category
3. **Choose image file** - Click the dashed box to select an image
4. **Click "📤 Upload Foto"** - Waits for upload to complete
5. **See preview** - Image preview shows after upload
6. **Click "Publish Product"** or "Update Product" - Saves to database

### File Requirements
- **Accepted formats**: JPG, PNG, GIF, WebP
- **Max file size**: 5 MB
- **Recommended**: 500x500px or larger

---

## 📋 File Upload Flow

```
User selects file
          ↓
Front-end shows preview
          ↓
User clicks "Upload Foto"
          ↓
File sent to /api/upload endpoint
          ↓
Backend saves to uploads/ folder
          ↓
Server returns image URL
          ↓
Form fills with image URL
          ↓
User clicks "Publish Product"
          ↓
Product saved to database with image URL
```

---

## 📍 Where Files Are Stored

**Local Development:**
- `backend/uploads/` folder on your computer
- Files accessible at: `http://localhost:5000/uploads/filename.jpg`

**With Ngrok:**
- Same folder, but accessible via ngrok URL
- Example: `https://xxxx.ngrok-free.app/uploads/filename.jpg`

---

## 🔄 Both File Upload & URL Input Supported

User can either:
1. **Choose file** (new way) - Better for inventory admin
2. **Paste URL** - Still works for external images (fallback)

---

## ⚠️ Troubleshooting

### "Failed to upload" error
- Check file size (max 5MB)
- Verify image format (JPG, PNG, GIF, WebP only)
- Make sure backend is running

### Uploaded file not showing
- Hard refresh browser (Ctrl+Shift+R)
- Check that backend is serving static files
- Check browser console (F12) for errors

### Can't install multer
- Make sure you're in backend folder: `cd backend`
- Check npm is installed: `npm --version`
- Delete `node_modules` and `package-lock.json`, then `npm install`

---

## 📦 Backend File Structure (After Upload)

```
backend/
├── uploads/                    ← New! Auto-created folder
│   ├── 1712500123456_sock1.jpg
│   ├── 1712500234567_sock2.png
│   └── ...
├── server.js                   ← Updated with multer config
├── package.json                ← Add: npm install multer
├── controllers/
├── routes/
└── models/
```

---

## 🎉 You're All Set!

1. ✅ Run: `npm install multer` in backend
2. ✅ Restart backend: `npm start`
3. ✅ Test upload in Inventory → Add New Product
4. ✅ Choose file → Upload → Publish!

Bisa pilih file langsung sekarang! 📸✨
