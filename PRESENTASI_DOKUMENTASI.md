# 📱 Dokumentasi Lengkap Proyek S*CK Socks E-Commerce Platform
## Untuk Presentasi

---

## 📋 Daftar Isi
1. [Ringkasan Proyek](#ringkasan-proyek)
2. [Teknologi & Bahasa Pemrograman](#teknologi--bahasa-pemrograman)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [Backend - REST API](#backend---rest-api)
5. [Frontend - User Interface](#frontend---user-interface)
6. [Database & Data Models](#database--data-models)
7. [Fitur Utama](#fitur-utama)
8. [Alur Kerja Sistem](#alur-kerja-sistem)
9. [Integrasi Payment Gateway](#integrasi-payment-gateway)
10. [Dependencies & Library](#dependencies--library)

---

## 🎯 Ringkasan Proyek

### Apa itu S*CK Socks?
**S*CK Socks** (Skena Socks) adalah platform e-commerce full-stack untuk menjual **kaos kaki premium berkualitas tinggi** dengan target pasar streetwear enthusiast urban.

### Target Pengguna
- 👥 **Pelanggan**: Membeli produk, cek resi, history order
- 👨‍💼 **Admin**: Kelola inventory, update status order, manajemen produk

### Tagline & Positioning
- **"Step Into The Future"** - Positioning premium brand
- **Material**: 100% Cotton Bamboo (ramah lingkungan)
- **Teknologi**: Anti-slip technology
- **Design**: Limited edition streetwear minimalist

### Fitur Utama Platform
✅ User registration & login dengan JWT authentication  
✅ Browse & filter koleksi produk  
✅ Shopping cart dengan localStorage persistence  
✅ Checkout dengan shipping information  
✅ Payment gateway integration (Xendit)  
✅ Order tracking real-time  
✅ User profile management (edit data, ganti password)  
✅ Admin dashboard untuk inventory & order management  

---

## 🛠️ Teknologi & Bahasa Pemrograman

### Bahasa Pemrograman yang Digunakan

| Layer | Bahasa | Framework | Version |
|-------|--------|-----------|---------|
| **Backend** | JavaScript | Node.js + Express.js | 5.2.1 |
| **Frontend** | JavaScript (JSX) | React | 19.2.0 |
| **Database** | JSON Document | MongoDB | (latest) |
| **Styling** | CSS | Tailwind CSS | 4.1.18 |

> **Catatan**: Semua code ditulis dengan **JavaScript/ECMAScript** dalam syntax modern (ES6+)

---

### Backend Stack (Server Side)

#### Core Framework
- **Node.js**: JavaScript runtime untuk menjalankan server di backend
- **Express.js v5.2.1**: Web framework untuk membuat REST API
- **MongoDB**: NoSQL database untuk menyimpan data
- **Mongoose v9.1.5**: ODM (Object Data Mapper) untuk MongoDB

#### Authentication & Security
- **JWT (jsonwebtoken v9.0.3)**: Token-based authentication
- **bcryptjs v3.0.3**: Password hashing dengan algorithm bcrypt
- **CORS**: Cross-Origin Resource Sharing untuk keamanan

#### API & External Services
- **Axios v1.14.0**: HTTP client untuk API calls
- **Xendit API v7.0.0**: Payment gateway integration

#### Utilities
- **dotenv v17.2.3**: Load environment variables dari .env file
- **body-parser**: JSON parsing middleware

---

### Frontend Stack (Client Side)

#### Core Framework
- **React 19.2.0**: Progressive UI library, component-based architecture
- **React Router DOM v7.12.0**: Client-side routing untuk SPA (Single Page Application)
- **Vite v7.2.4**: Modern build tool dan development server

#### Styling & UI
- **Tailwind CSS v4.1.18**: Utility-first CSS framework
- **Dark Theme**: Background #0f0f0f dengan accent color #a3fb2e (lime green)
- **Responsive Design**: Mobile-first approach

#### HTTP Communication
- **Axios v1.13.2**: Promise-based HTTP client

#### Development Tools
- **ESLint**: Static code analysis untuk code quality

---

### Environment & Tools
- **Package Manager**: NPM (npm)
- **Development Server**: Vite (localhost:5173/5174) untuk frontend
- **Backend Server**: Express (localhost:5000)
- **Version Control**: Git (kemungkinan)

---

## 🏗️ Arsitektur Sistem

### Diagram Arsitektur

```
┌─────────────────────────────────────┐
│  FRONTEND (React + Vite SPA)        │
│  Port: localhost:5173/5174          │
│  - React Components                 │
│  - Routing (React Router)           │
│  - State Management (localStorage)  │
│  - Styling (Tailwind CSS)           │
└──────────────┬──────────────────────┘
               │ AXIOS HTTP CALLS
               │ REST API Requests
               │
┌──────────────▼──────────────────────┐
│  BACKEND (Express.js REST API)      │
│  Port: localhost:5000               │
│  - Controllers (Business Logic)     │
│  - Routes (API Endpoints)           │
│  - Middleware (Auth, CORS)          │
│  - Models (Mongoose Schemas)        │
└──────────────┬──────────────────────┘
               │ MONGOOSE ODM
               │ Database Operations
               │
┌──────────────▼──────────────────────┐
│  DATABASE (MongoDB)                 │
│  Collections:                       │
│  - Users (user accounts)            │
│  - Products (inventory)             │
│  - Orders (transactions)            │
└─────────────────────────────────────┘

    ┌────────────────────┐
    │ XENDIT PAYMENT API │
    │ (Redirect HTTPS)   │
    └──────────┬─────────┘
               │
        Express.js Server
        (Invoice & Webhooks)
```

### Karakteristik Arsitektur

1. **Three-Tier Architecture**
   - Presentation Layer: React Frontend
   - Business Logic Layer: Express.js Backend
   - Data Layer: MongoDB Database

2. **REST API Communication**
   - Frontend → Backend: HTTP/HTTPS requests dengan JSON payload
   - Backend → Database: Mongoose queries

3. **Separation of Concerns**
   - Frontend: UI/UX, client-side validation, presentasi data
   - Backend: Authentication, authorization, business logic, payment processing
   - Database: Data persistence, indexing

4. **Stateless Backend**
   - Setiap request independent
   - Authentication via JWT token di header
   - Scalable design

---

## 🔌 Backend - REST API

### Server Setup (server.js)

```javascript
// Framework: Express.js
// Port: 5000
// Database: MongoDB
// CORS: Enabled untuk frontend (localhost:5173, localhost:5174)
```

**Middleware yang digunakan:**
- `express.json()`: Parse JSON request body
- `cors()`: Handle cross-origin requests
- Custom auth middleware: Verify JWT token
- Debug middleware: Log semua requests

---

### API Endpoints

#### 1️⃣ AUTHENTICATION (`/api/auth`)

**POST /api/auth/register**
- **Deskripsi**: Buat akun user baru
- **Public**: Ya
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**: User ID, success message
- **Process**:
  1. Validasi input (username & email unik)
  2. Hash password dengan bcryptjs
  3. Simpan user ke MongoDB

**POST /api/auth/login**
- **Deskripsi**: Login dan dapatkan JWT token
- **Public**: Ya
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**: JWT token, user data (id, username, email)
- **Process**:
  1. Cari user by email
  2. Verify password dengan bcryptjs.compare()
  3. Generate JWT token (valid 1 hari)
  4. Return token + user info

**GET /api/auth/profile**
- **Deskripsi**: Ambil data profile user yang sedang login
- **Protected**: ✅ JWT required
- **Response**: User data (id, username, email)

**PUT /api/auth/update**
- **Deskripsi**: Update username atau email user
- **Protected**: ✅ JWT required
- **Request Body**: username atau email baru

**PUT /api/auth/password**
- **Deskripsi**: Ganti password
- **Protected**: ✅ JWT required
- **Request Body**: 
  ```json
  {
    "oldPassword": "current_password",
    "newPassword": "new_password"
  }
  ```

---

#### 2️⃣ PRODUCTS (`/api/products`)

**GET /api/products**
- **Deskripsi**: Ambil semua produk
- **Public**: Ya
- **Response**: Array of products dengan fields (name, price, stock, image, description)

**GET /api/products/:id**
- **Deskripsi**: Ambil detail 1 produk by ID
- **Public**: Ya
- **Response**: Single product object

**POST /api/products**
- **Deskripsi**: Tambah produk baru (admin only)
- **Protected**: ✅ JWT required (admin)
- **Request Body**:
  ```json
  {
    "name": "Crew Socks Limited Edition",
    "price": 79000,
    "description": "100% Cotton Bamboo",
    "category": "Crew Socks",
    "image": "https://...",
    "stock": 50
  }
  ```

**PUT /api/products/:id**
- **Deskripsi**: Update data produk
- **Protected**: ✅ JWT required (admin)

**DELETE /api/products/:id**
- **Deskripsi**: Hapus produk
- **Protected**: ✅ JWT required (admin)

---

#### 3️⃣ PAYMENT & ORDERS (`/api/payment`)

**POST /api/payment/create-invoice**
- **Deskripsi**: Buat Xendit invoice untuk pembayaran
- **Public**: Ya (kecuali user harus terdaftar)
- **Request Body**:
  ```json
  {
    "amount": 89000,
    "customerName": "Budi Santoso",
    "email": "budi@gmail.com",
    "phone": "081234567890",
    "city": "Jakarta",
    "address": "Jl. Merdeka No. 123",
    "resi": "SKN-882910",
    "paymentMethod": "CC"
  }
  ```
- **Response**: `invoice_url` (redirect ke Xendit payment page)
- **Process**:
  1. Validasi data pelanggan
  2. Create Xendit invoice via API
  3. Dapatkan invoice URL
  4. Frontend redirect user ke payment page

**GET /api/payment/invoice-status/:invoiceId**
- **Deskripsi**: Cek status invoice
- **Response**: Invoice status (PENDING, PAID, EXPIRED, dll)

**POST /api/payment/webhook**
- **Deskripsi**: Receive payment status callback dari Xendit
- **Private**: Xendit server hanya
- **Process**:
  1. Xendit post status perubahan
  2. Update order payment status di database
  3. Set order status ke "On Process" jika PAID

**POST /api/payment/create-order**
- **Deskripsi**: Buat order record setelah pembayaran sukses
- **Protected**: ✅ JWT required
- **Request Body**: Order details dengan items

**GET /api/payment/all-orders**
- **Deskripsi**: Ambil semua orders (admin hanya)
- **Protected**: ✅ JWT required (admin)
- **Response**: Array of all orders

**GET /api/payment/user-orders/:userId**
- **Deskripsi**: Ambil order history user tertentu
- **Protected**: ✅ JWT required
- **Response**: Array of user's orders

**GET /api/payment/order/:resi**
- **Deskripsi**: Ambil order by tracking number (public tracking)
- **Public**: Ya
- **Response**: Order details (customer info, items, status)

**PUT /api/payment/update-order-status/:orderId**
- **Deskripsi**: Update status order (admin only)
- **Protected**: ✅ JWT required (admin)
- **Request Body**:
  ```json
  {
    "status": "Shipped"
  }
  ```

---

### Authentication Flow (JWT)

```
REGISTRATION/LOGIN
        │
        ▼
   User Input
   (email, password)
        │
        ▼
   Backend Verification
   ├─ Find user by email
   └─ Compare password (bcrypt)
        │
        ▼
   Generate JWT Token
   ├─ Payload: { userId, iat, exp }
   ├─ Secret: 'RAHASIA_NEGARA'
   └─ Expiration: 1 day
        │
        ▼
   Return Token to Frontend
        │
        ▼
   Frontend Store in localStorage
   ├─ "token": JWT string
   └─ "user": { id, username, email }
        │
        ▼
   Subsequent API Requests
   ├─ Header: "Authorization: Bearer <token>"
   └─ Backend verify token in middleware
```

**Middleware Auth (auth.js)**:
```javascript
- Extract token dari Authorization header
- Verify token signature & expiration
- Attach user data ke req.user
- Return 401 if invalid/expired
```

---

## 🎨 Frontend - User Interface

### Tech Stack
- **Framework**: React 19.2.0 (JSX syntax)
- **Routing**: React Router DOM v7.12.0
- **Build Tool**: Vite v7.2.4
- **Styling**: Tailwind CSS + custom CSS
- **Design**: Dark theme (#0f0f0f bg, #a3fb2e accent)

### Page Structure (React Router)

#### 👤 Customer Pages (dengan Navbar & Footer)
- **`/`** - **Home**: Hero section, featured products
- **`/collection`** - **Katalog Lengkap**: Grid products dengan filter kategori
- **`/detail-product/:id`** - **Detail Produk**: Deskripsi, harga, stock, "Add to Cart"
- **`/cart`** - **Shopping Cart**: Review items, qty control, checkout button
- **`/payment`** - **Pembayaran**: Select payment method, create invoice, redirect ke Xendit
- **`/order-success`** - **Konfirmasi Order**: Success message, tracking number
- **`/track-package`** - **Tracking Paket**: Input resi, cek status real-time
- **`/profile`** - **Profile User**: Edit data, ganti password, order history

#### 🔐 Authentication Pages (tanpa Navbar)
- **`/auth`** - **Login**: Email/password login form
- **`/register`** - **Register**: Buat akun baru
- **`/forgot-password`** - **Lupa Password**: Reset password functionality

#### 🏢 Admin Pages (protected, special layout)
- **`/admin-login`** - **Admin Login**: Separate authentication untuk admin
- **`/dashboard-admin`** - **Admin Dashboard**: 
  - **Inventory Tab**: Add/edit/delete products, manage stock
  - **Orders Tab**: View orders, update status, track shipments

---

### Key Components

#### 1. NavbarComponents.jsx
**Fungsi**: Navigation bar di setiap halaman customer
- Logo & brand name
- Menu navigation (Home, Collection, dll)
- Shopping cart badge (dynamic count)
- User dropdown (username, profile, logout)
- Responsive hamburger menu untuk mobile

**State Management**: 
- Cart count synced dari localStorage
- Event listener untuk update cart across tabs

#### 2. Cart.jsx
**Fungsi**: Shopping cart management
- Tampilkan semua items di cart
- Quantity increment/decrement per item
- Remove item button
- Calculate subtotal & total
- Shipping info modal
- Checkout button (redirect ke payment)

**Features**:
- Persistent storage (localStorage)
- Real-time calculation
- Form validation untuk shipping data

#### 3. Auth.jsx
**Fungsi**: Login form
- Email input field
- Password input field
- Login button
- Link ke register & forgot password
- Error handling & validation
- Auto-redirect jika sudah login

#### 4. Katalog / Collection
**Fungsi**: Product listing
- Grid layout 4 kolom (responsive)
- Filter by category
- Search functionality
- Product cards dengan:
  - Image thumbnail
  - Product name
  - Price
  - Stock availability badge
  - Hover effect (zoom, overlay)
  - "View Details" button

#### 5. Payment.jsx
**Fungsi**: Checkout interface
- Display order summary (items, quantity, price)
- Enter/verify shipping information
- Select payment method dropdown
- Admin fee calculation (Rp 2000)
- Generate tracking number (SKN-XXXXXX)
- "Pay Now" button → call create-invoice API
- Redirect ke Xendit payment page

#### 6. TrackPackage.jsx
**Fungsi**: Order tracking
- Input field untuk tracking number
- Fetch dari API `/order/:resi`
- Display:
  - Customer info (name, address, phone, email)
  - Order items (product, qty, price)
  - Order status (On Process → Shipped → Out for Delivery → Delivered)
  - Payment status
  - Total amount
- Auto-refresh every 5 detik

#### 7. Profile.jsx
**Fungsi**: User account management
- Tab 1: Edit Profile (username, email)
- Tab 2: Change Password (old + new)
- Tab 3: Order History (display UserOrderHistory component)
- Form validation & error handling

#### 8. DashboardAdmin.jsx
**Fungsi**: Admin central hub
- Sidebar navigation (Inventory ↔ Orders tabs)
- Auth gate (redirect to /admin-login if unauthorized)
- Dynamic content rendering

**Sub-components**:
- **Inventory.jsx**: Product CRUD
  - Add new product form
  - Product list dengan edit/delete buttons
  - Stock management
  
- **OrderList.jsx**: Order management
  - Display all orders in table
  - Show customer details
  - Status update dropdown
  - Sort/filter capabilities

---

### State Management Strategy

**localStorage** (Persistent):
```javascript
"token" → JWT token string
"user" → { id, username, email }
"cart" → [{ productId, name, price, qty, image }, ...]
```

**sessionStorage** (Temporary):
```javascript
"shippingInfo" → { name, address, phone, city }
```

**Component State** (React useState):
```javascript
// Lokal state untuk form, loading, modal visibility, dll
const [isLoading, setIsLoading] = useState(false);
const [cartItems, setCartItems] = useState([]);
```

**Events** (Cross-tab sync):
```javascript
// Custom events untuk sync data antar tab/component
window.addEventListener('cartUpdated', handleCartUpdate);
window.dispatchEvent(new Event('cartUpdated'));
```

---

### Styling Approach

**Tailwind CSS**:
- Utility-first CSS framework
- Pre-built classes (p-4, m-2, flex, grid, shadows, dll)
- Responsive breakpoints (sm, md, lg, xl)

**Theme**:
- Background: Dark (#0f0f0f)
- Primary accent: Lime green (#a3fb2e)
- Text: White/light gray
- Borders: Subtle dark gray

**Responsive Design**:
```
Mobile (< 640px) → 1 column
Tablet (640-1024px) → 2 columns
Desktop (> 1024px) → 4 columns
```

---

## 💾 Database & Data Models

### MongoDB Collections

#### 1. Users Collection
```javascript
{
  _id: ObjectId (auto-generated),
  username: String (unique, required),
  email: String (unique, required, validated),
  password: String (bcryptjs hashed, 10 salt rounds)
}
```
**Purpose**: User authentication & profile
**Indexes**: username (unique), email (unique)

---

#### 2. Products Collection
```javascript
{
  _id: ObjectId (auto-generated),
  name: String (required),
  price: Number (required, positive),
  description: String (product details),
  category: String (e.g., "Crew Socks", "Ankle Socks"),
  image: String (URL to product image),
  stock: Number (default: 0, quantity available),
  createdAt: Date (auto timestamp)
}
```
**Purpose**: Product inventory
**Categories**: 
- Crew Socks
- Ankle Socks  
- Limited Drop

**Validation**: Price > 0, stock >= 0

---

#### 3. Orders Collection
```javascript
{
  _id: ObjectId (auto-generated),
  resi: String (unique tracking number, e.g., "SKN-882910"),
  date: String (order date),
  customer: {
    name: String (customer full name),
    email: String (customer email),
    phone: String (phone number),
    city: String (delivery city),
    address: String (full address),
    userId: ObjectId (ref to User, nullable for guest checkout)
  },
  items: [
    {
      productId: ObjectId (ref to Product),
      name: String (product name snapshot),
      price: Number (price at time of purchase),
      qty: Number (quantity ordered),
      image: String (product image URL)
    }
  ],
  totalPaid: Number (total payment amount including fee),
  status: String (Enum: "On Process", "Shipped", "Out for Delivery", "Delivered"),
  invoiceId: String (Xendit invoice ID),
  paymentMethod: String (payment type: CC, GCash, etc),
  paymentStatus: String (Enum: "PENDING", "PAID", "FAILED"),
  createdAt: Date (auto timestamp),
  updatedAt: Date (last update timestamp)
}
```
**Purpose**: Order transactions & tracking
**Indexes**: resi (unique), invoiceId, userId
**Status Flow**: On Process → Shipped → Out for Delivery → Delivered

---

### Database Connection
```javascript
// MongoDB URI
mongodb://localhost:27017/ujikomtest

// Mongoose connection
mongoose.connect(MONGO_URI)

// ODM: Mongoose v9.1.5
// Schema validation & type checking
// Auto-timestamp support
// Query helpers & middleware
```

---

## 🎯 Fitur Utama

### 1. User Registration & Authentication

**Register Flow**:
1. User input username, email, password
2. Frontend validate input (min length, email format)
3. POST ke `/api/auth/register`
4. Backend:
   - Check username & email tidak duplicate
   - Hash password dengan bcryptjs (10 rounds)
   - Save user ke MongoDB
5. Response: Success message
6. Redirect ke login page

**Login Flow**:
1. User input email & password
2. POST ke `/api/auth/login`
3. Backend:
   - Find user by email
   - Compare password dengan bcrypt.compare()
   - Generate JWT token (exp: 1 hari)
4. Response: token + user data
5. Frontend store di localStorage
6. Redirect ke home page

**JWT Token**:
- Stored in localStorage as `"token"`
- Attached ke setiap API request di header: `Authorization: Bearer <token>`
- Valid 1 hari, auto-logout after expiration

---

### 2. Product Browsing & Filtering

**Features**:
- Display all products dalam grid layout
- Filter by category (Crew Socks, Ankle Socks, Limited Drop)
- Search functionality (search by name)
- Product cards hover effects
- Stock availability badges
- Price display dengan currency format

**Responsive**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 4 columns

---

### 3. Shopping Cart

**Features**:
- Add products to cart (qty selector)
- View all cart items
- Increment/decrement quantity
- Remove item from cart
- Calculate subtotal (qty × price)
- Persistent storage (localStorage)
- Real-time cart count badge di navbar
- Clear cart after successful order

**Cart Data Structure**:
```javascript
[
  {
    productId: "...",
    name: "Crew Socks",
    price: 79000,
    qty: 2,
    image: "..."
  },
  // ... more items
]
```

---

### 4. Checkout & Payment

**Checkout Steps**:
1. Review cart items & calculate total
2. Enter shipping info (name, address, phone, city)
3. Select payment method (CC, GCash, etc)
4. System generate tracking number (SKN-XXXXXX)
5. Calculate admin fee (Rp 2000)
6. POST ke `/api/payment/create-invoice`
7. Receive Xendit invoice URL
8. Redirect ke payment gateway

**Payment Methods** (via Xendit):
- Credit/debit cards
- E-wallets (GCash, OVO, Dana, LinkAja)
- Bank transfers
- Virtual accounts

**Payment Status**:
- PENDING: Awaiting payment
- PAID: Payment successful
- FAILED: Payment failed

---

### 5. Order Tracking

**Features**:
- Input tracking number (resi) on `/track-package`
- Fetch order details from API
- Display real-time order status
- Show customer info, items, total paid
- Auto-refresh every 5 detik untuk live update

**Status Flow**:
```
On Process 
    ↓
Shipped 
    ↓
Out for Delivery 
    ↓
Delivered
```

---

### 6. User Profile Management

**Features**:
- View & edit profile (username, email)
- Change password (requires old password verification)
- View order history
- Tab-based interface
- Form validation & error handling

---

### 7. Admin Dashboard

**Inventory Management**:
- View all products dalam table
- Add new product (form dengan image URL)
- Edit product (update name, price, stock, description)
- Delete product
- Real-time stock level viewing

**Order Management**:
- View all orders dalam table format
- See customer details (name, address, phone, email)
- View order items & amounts
- Update order status (dropdown: On Process → Shipped → Out for Delivery → Delivered)
- Track order history
- Admin fee visibility

---

## 🔄 Alur Kerja Sistem

### Alur Umum Pembelian

```
START (Customer)
    │
    ▼
Register / Login
    │
    ├─ New User → /register → Create account → Login
    └─ Existing User → /auth → Input email & password → JWT token
    │
    ▼
Browse Products (/collection)
    │
    ├─ Filter by category
    ├─ Search products
    └─ Click "View Details"
    │
    ▼
View Product Detail (/detail-product/:id)
    │
    ├─ Read description, see image
    ├─ Check stock availability
    └─ Select qty → "Add to Cart"
    │
    ▼
Continue Shopping / Go to Cart
    │
    ▼
Review Cart (/cart)
    │
    ├─ View all items
    ├─ Adjust quantities
    ├─ Remove items
    └─ Calculate subtotal
    │
    ▼
Checkout (/payment)
    │
    ├─ Enter shipping info
    ├─ Select payment method
    ├─ Review total (subtotal + admin fee)
    └─ Click "Pay Now"
    │
    ▼
Xendit Payment Gateway (External)
    │
    ├─ Frontend POST /api/payment/create-invoice
    ├─ Backend create invoice with Xendit API
    ├─ Receive invoice_url
    └─ Redirect user to Xendit page
    │
    ▼
Customer Pay (on Xendit)
    │
    ├─ Select payment method
    ├─ Enter payment details
    └─ Confirm payment
    │
    ▼
Xendit Callback (Webhook)
    │
    ├─ Payment status → Backend webhook
    ├─ Update order paymentStatus to "PAID"
    └─ Create order in database
    │
    ▼
Order Success (/order-success)
    │
    ├─ Display tracking number (resi)
    ├─ Show order summary
    └─ Clear cart & session storage
    │
    ▼
Order Tracking (/track-package)
    │
    ├─ Input tracking number
    ├─ Fetch order details
    ├─ View status updates
    └─ Auto-refresh every 5 seconds
    │
    ▼
User Profile (/profile)
    │
    ├─ View order history
    ├─ See order statuses
    └─ Edit profile if needed
    │
    ▼
Admin Updates Status (Admin Dashboard)
    │
    ├─ Update status: On Process → Shipped → Out for Delivery → Delivered
    └─ Changes reflected real-time
    │
    ▼
Order Delivered
    │
    ▼
END
```

---

### Admin Workflow

```
Admin Login (/admin-login)
    │
    ├─ Email & password (separate auth)
    └─ Get JWT token
    │
    ▼
Dashboard Admin (/dashboard-admin)
    │
    ├─── TAB 1: INVENTORY ───────────────┐
    │    ├─ View all products            │
    │    ├─ Add new product              │
    │    ├─ Edit product details         │
    │    ├─ Manage stock levels          │
    │    └─ Delete product               │
    │                                    │
    │    ├─── TAB 2: ORDERS ───────────┐ │
    │         ├─ View all orders       │ │
    │         ├─ See order details     │ │
    │         ├─ Update order status   │ │
    │         └─ Track shipments       │ │
    │                                  │ │
    │    └──────────────────────────────┘ │
    │                                      │
    └──────────────────────────────────────┘
```

---

## 💳 Integrasi Payment Gateway

### Xendit - Provider Pembayaran

#### Konfigurasi

**What is Xendit?**
- Platform pembayaran Indonesia
- Support multiple payment methods (e-wallet, bank transfer, CC)
- API-based integration
- Webhook support untuk notifikasi status

**Setup**:
```
API Key: Disimpan di .env sebagai XENDIT_API_KEY
Base URL: https://api.xendit.co/v2
Auth: HTTP Basic Auth (API Key as username + empty password)
```

---

#### Invoice Creation Flow

**Step 1: Frontend Calls API**
```javascript
POST /api/payment/create-invoice
{
  amount: 89000,
  customerName: "Budi Santoso",
  email: "budi@gmail.com",
  phone: "081234567890",
  city: "Jakarta",
  address: "Jl. Merdeka No. 123",
  resi: "SKN-882910",
  paymentMethod: "CC"
}
```

**Step 2: Backend Processing**
```javascript
1. Validate input (name min 2 chars, amount >= 1000)
2. HTTP POST to Xendit API: /v2/invoices
3. Payload:
   {
     external_id: "SKN-882910",
     amount: 89000,
     payer_email: "budi@gmail.com",
     description: "Order SKN-882910",
     items: [{
       name: "Product Purchase",
       quantity: 1,
       price: 89000
     }],
     success_redirect_url: "http://localhost:5174/order-success",
     failure_redirect_url: "http://localhost:5174/payment"
   }
4. Receive response:
   {
     invoice_id: "...",
     invoice_url: "https://checkout.xendit.co/...",
     status: "PENDING"
   }
```

**Step 3: Frontend Redirect**
```javascript
window.location.href = invoice_url
// Customer directed ke Xendit payment page
```

---

#### Payment Methods Available

| Method | Type | Status |
|--------|------|--------|
| **Credit/Debit Card** | Card Payment | ✅ Available |
| **GCash** | E-wallet | ✅ Available (PH) |
| **OVO** | E-wallet | ✅ Available |
| **Dana** | E-wallet | ✅ Available |
| **LinkAja** | E-wallet | ✅ Available |
| **Bank Transfer** | Direct Transfer | ✅ Available |
| **Virtual Account** | VA Payment | ✅ Available |

---

#### Webhook Handling

**What is Webhook?**
- Server-to-server callback untuk notifikasi real-time
- Xendit sends POST request ke backend ketika payment status berubah
- Backend update database accordingly

**Webhook Endpoint**: `POST /api/payment/webhook`

**Callback Payload** (dari Xendit):
```javascript
{
  id: "invoice_id_123",
  external_id: "SKN-882910",
  invoice_url: "https://...",
  amount: 89000,
  payer_email: "budi@gmail.com",
  status: "PAID", // PAID, EXPIRED, PENDING, etc
  payment_method: "CREDIT_CARD",
  paid_at: "2024-04-07T10:30:00Z"
}
```

**Backend Process**:
```javascript
1. Receive webhook from Xendit
2. Verify signature (security)
3. Find order by external_id (resi number)
4. Update order.paymentStatus = "PAID"
5. Update order.status = "On Process" (jika PAID)
6. Save to database
7. Send confirmation response to Xendit
```

---

#### Security

**API Authentication**:
- HTTP Basic Auth: `Authorization: Basic <base64(API_KEY:)>`
- All requests over HTTPS only
- API Key stored di `.env` (never in code)

**Webhook Verification**:
- Validate event source (Xendit servers)
- Signature verification
- Idempotency check (prevent duplicate processing)

---

## 📦 Dependencies & Library

### Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **express** | 5.2.1 | Web framework untuk REST API |
| **mongoose** | 9.1.5 | MongoDB ODM (Object-Document Mapper) |
| **bcryptjs** | 3.0.3 | Password hashing algorithm |
| **jsonwebtoken** | 9.0.3 | JWT token generation & verification |
| **cors** | 2.8.6 | Cross-Origin Resource Sharing middleware |
| **axios** | 1.14.0 | Promise-based HTTP client (for Xendit API) |
| **xendit-node** | 7.0.0 | Xendit API SDK |
| **dotenv** | 17.2.3 | Load environment variables |
| **body-parser** | (built-in) | JSON/form parsing |

**Installed via**: `npm install` dalam folder backend/

---

### Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| **react** | 19.2.0 | UI library (component-based) |
| **react-router-dom** | 7.12.0 | Client-side routing (SPA) |
| **vite** | 7.2.4 | Modern build tool & dev server |
| **tailwindcss** | 4.1.18 | Utility-first CSS framework |
| **axios** | 1.13.2 | HTTP client for API calls |
| **eslint** | (dev) | Code quality linter |
| **@vitejs/plugin-react** | (dev) | Vite plugin untuk React |

**Installed via**: `npm install` dalam folder frontend/

---

### Version Control & Project Management

- **Git**: Version control system
- **package.json**: Dependency management & scripts
- **package-lock.json**: Lock file untuk reproducible installs

---

## 🚀 Cara Menjalankan Proyek

### Persiapan

1. **Install Node.js** (LTS version)
2. **MongoDB Server** running (atau cloud MongoDB)

### Backend Setup

```bash
cd backend
npm install
# Create .env file dengan:
# MONGO_URI=mongodb://localhost:27017/ujikomtest
# XENDIT_API_KEY=your_api_key

npm start
# Server berjalan di http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Dev server berjalan di http://localhost:5173 atau 5174
```

### Testing

- **API Testing**: Gunakan Postman, Insomnia, atau file `test-api.bat`
- **Manual Testing**: Akses via browser `http://localhost:5173`

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Languages | JavaScript (100%) |
| Total Endpoints | 15+ REST API |
| Collections (DB) | 3 (Users, Products, Orders) |
| Frontend Pages | 10+ pages |
| Admin Features | 2 (Inventory, Orders) |
| Payment Methods | 7+ |
| Authentication | JWT + bcrypt |
| Response Format | JSON |

---

## 🎓 Key Concepts & Technologies Explained

### REST API (Representational State Transfer)
- HTTP-based API architecture
- Uses standard methods: GET, POST, PUT, DELETE
- Stateless communication (JWT for state)
- JSON format for request/response

### JWT (JSON Web Tokens)
- Token-based authentication
- Self-contained (no server-side session storage)
- Expires after time period
- Used for authorization on protected endpoints

### MongoDB
- NoSQL database (document-oriented)
- Flexible schema (JSON-like documents)
- Scalable & performant
- Cloud or local deployment

### React
- Component-based UI library
- Reusable, composable components
- Virtual DOM for efficient rendering
- Hooks (useState, useEffect) for state management

### Tailwind CSS
- Utility-first CSS framework
- Pre-built classes for rapid development
- Responsive design with breakpoints
- Customizable theme & colors

---

## 📞 Support & Contact

- **Environment**: Development (localhost)
- **Documentation**: XENDIT_SETUP.md, XENDIT_TESTING.md
- **Testing**: test-xendit.js, test-payment.html, test-api.bat

---

**Dokumentasi ini dibuat untuk keperluan presentasi.**  
**Last Updated: April 7, 2026**
