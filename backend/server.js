const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/AuthRoute');
const productRoutes = require('./routes/ProductRoute');
const paymentRoutes = require('./routes/PaymentRoute');

dotenv.config();
const app = express();

// 1. MIDDLEWARE DASAR
app.use(express.json());

// 2. KONFIGURASI CORS SAPU JAGAT (Pasti Tembus)
app.use(cors()); // Izinkan dasar dulu

app.use((req, res, next) => {
  // Izinkan origin mana saja (localhost atau ngrok)
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  
  // Izinkan semua method
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  
  // Izinkan header khusus ngrok dan auth
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, ngrok-skip-browser-warning');
  
  // Penting untuk Ngrok: bypass warning page secara otomatis
  res.setHeader('ngrok-skip-browser-warning', 'true');

  // Handle request OPTIONS (Preflight) agar tidak diblokir browser
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 3. ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.send('S*CKSOCKS API is running...');
});

// 4. DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('🔥 MongoDB Terhubung!');
        console.log('✅ CORS "Sapu Jagat" Aktif');
    })
    .catch((err) => console.error('❌ Gagal Konek Database:', err));

// 5. RUN SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server S*CKSOCKS jalan di port ${PORT}`);
    console.log(`🔗 Link Ngrok kamu harus diarahkan ke http://localhost:${PORT}`);
});