# 🔧 Fix CORS Errors with Ngrok - RESTART GUIDE

## ❌ Problem
- Frontend: `http://localhost:5173`
- Backend/Ngrok: `https://122e-...ngrok-free.app`
- **CORS preflight failing** - OPTIONS request rejected

## ✅ Solution
Updated CORS middleware in backend to handle Ngrok properly

---

## 🚀 FULL RESTART (Must Do This!)

### **Step 1: Kill All Services**

In **PowerShell as Admin**:
```powershell
# Kill all node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill ngrok
Get-Process ngrok -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait 3 seconds
Start-Sleep -Seconds 3

Write-Host "✅ All services stopped" -ForegroundColor Green
```

---

### **Step 2: Start Services (30 seconds setup)**

**Terminal 1 - Ngrok:**
```bash
cd c:\Users\Lenovo\Desktop\belajar
.\ngrok http 5000
```
⏳ Wait for ngrok to start, copy the URL like: `https://122e-...ngrok-free.app`

**Terminal 2 - Backend:**
```bash
cd c:\Users\Lenovo\Desktop\belajar\backend
npm start
```
Wait for: `🚀 Server S*CKSOCKS jalan di port 5000`

**Terminal 3 - Frontend:**
```bash
cd c:\Users\Lenovo\Desktop\belajar\frontend
npm run dev
```
Wait for: `VITE v7.2.4  ready in X ms`

---

### **Step 3: Browser Testing**

1. **Hard Refresh**: `Ctrl+Shift+R` on `http://localhost:5173`
2. **Open DevTools**: `F12` → Console
3. **Go to Admin Inventory**
4. **Check Console** for the CORS error

**Should see now:**
```
✅ OPTIONS preflight request from: http://localhost:5173
```

**NOT:**
```
❌ Access to XMLHttpRequest blocked by CORS policy
```

---

## 🧪 Quick Diagnostic Checklist

- [ ] Backend console shows: `✅ CORS "Sapu Jagat" Aktif`
- [ ] Ngrok shows tunnel is active
- [ ] Frontend loads without errors
- [ ] Browser console has NO red CORS errors
- [ ] Admin Inventory loads products successfully
- [ ] OrderList loads orders successfully

---

## 🔍 If Still Getting Error

### **Check Backend Console Output**

Should show when you access admin pages:
```
✅ OPTIONS preflight request from: http://localhost:5173
🔧 Handling GET /api/products request
```

**If you don't see this**, backend is not running or not restarted properly.

---

### **Double Check CORS Headers**

In Browser DevTools with Network tab open:

1. Open **F12** → **Network** tab
2. Refresh page
3. Look for request to `/api/products`
4. Click it, go to **Response Headers**
5. Should see:
   ```
   access-control-allow-origin: http://localhost:5173
   access-control-allow-methods: GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD
   access-control-allow-headers: Origin, X-Requested-With, Content-Type, Accept, Authorization, ...
   ```

**If NOT present**, backend not restarted properly.

---

## ⚡ What Changed in Backend

Updated `server.js`:
- ✅ CORS middleware now handles OPTIONS requests FIRST
- ✅ Headers set more explicitly
- ✅ Ngrok headers added (`ngrok-skip-browser-warning`)
- ✅ Double CORS layer for redundancy
- ✅ Better logging for debugging

---

## 🎯 Expected Result After Restart

✅ Admin Inventory pages load  
✅ Products list shows  
✅ Orders list shows  
✅ No CORS errors in console  
✅ File upload still works  

---

## 🆘 If Restart Doesn't Work

1. **Delete node_modules** in backend:
   ```bash
   cd backend
   rmdir /s /q node_modules
   npm install
   npm start
   ```

2. **Check if port 5000 is free**:
   ```powershell
   netstat -ano | findstr :5000
   # If something is running, kill it:
   taskkill /PID <PID> /F
   ```

3. **Restart ngrok** - Sometimes ngrok tunnel drops

---

## 📝 Files Modified

- `backend/server.js` - CORS middleware updated ✓
- `frontend/src/Components/ModalAddProduct.jsx` - Already has NGROK_HEADERS ✓
- All pages already use NGROK_HEADERS constant ✓

---

## ✨ Key Points

🔑 **CORS preflight requests (OPTIONS)** must be handled BEFORE any other logic  
🔑 **Origin header** must match request origin  
🔑 **Ngrok bypass header** included for tunnel compatibility  
🔑 **Restart backend** for changes to take effect  

---

**Status: CORS Fix Applied** ✅

Silakan restart semua services sesuai urutan, dann cek console untuk confirm!
