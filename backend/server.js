const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/AuthRoute');
const productRoutes = require('./routes/ProductRoute');
const paymentRoutes = require('./routes/PaymentRoute');

dotenv.config();
const app = express();

// CREATE UPLOADS FOLDER IF NOT EXISTS
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MULTER CONFIGURATION
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp_originalname
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    // Accept image files only
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// 1. MIDDLEWARE DASAR
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// AGGRESSIVE CORS HANDLING - HANDLE EARLY
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow any origin
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning, x-ngrok-skip-browser-warning');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // Ngrok bypass headers
  res.setHeader('ngrok-skip-browser-warning', 'true');
  res.setHeader('x-ngrok-skip-browser-warning', 'true');
  
  // Handle preflight requests IMMEDIATELY
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS preflight request from:', origin);
    return res.status(200).send();
  }
  
  next();
});

// SERVE STATIC FILES FROM UPLOADS FOLDER WITH CORS HEADERS
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
}, express.static(uploadsDir));

// Extra CORS layer - second pass after routes
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning', 'x-ngrok-skip-browser-warning']
}));

// FILE UPLOAD ENDPOINT (for immediate use)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  try {
    // Construct base URL: ALWAYS prioritize ngrok headers first
    let baseUrl;
    const forwardedHost = req.headers['x-forwarded-host'];
    const forwardedProto = req.headers['x-forwarded-proto'] || 'https';
    
    if (forwardedHost) {
      // We're behind ngrok - use ngrok URL
      baseUrl = `${forwardedProto}://${forwardedHost}`;
    } else {
      // No ngrok: use actual request host (backend URL)
      baseUrl = `${req.protocol === 'http' ? 'http' : 'https'}://${req.get('host')}`;
    }
    
    // Build complete file URL
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    
    console.log('✅ File uploaded:', req.file.filename);
    console.log('🔗 File URL:', fileUrl);
    
    res.json({ 
      message: 'File uploaded successfully', 
      imageUrl: fileUrl, 
      filename: req.file.filename 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error processing upload' });
  }
});

// Make multer available globally for use in routes
app.locals.upload = upload;

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
        console.log('✅ CORS Aktif');
        console.log('📁 Static files served from /uploads');
    })
    .catch((err) => console.error('❌ Gagal Konek Database:', err));

// 5. RUN SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server S*CKSOCKS jalan di port ${PORT}`);
    console.log(`🔗 Link Ngrok kamu harus diarahkan ke http://localhost:${PORT}`);
});