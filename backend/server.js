const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/AuthRoute');
const productRoutes = require('./routes/ProductRoute');
const paymentRoutes = require('./routes/PaymentRoute');

dotenv.config();
const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOptions));

// Debug middleware
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} from ${req.get('origin')}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);

// KODE LAMA (Sebelum diperbaiki)
//



const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ujikomtest';
// KODE YANG BENAR (Baru)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🔥 MongoDB Terhubung!'))
    .catch((err) => console.error('❌ Gagal Konek Database:', err));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });