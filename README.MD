

## 1. User Guide

### Cara Login
1. Buka aplikasi melalui URL frontend (contoh: `http://localhost:3000`).
2. Klik tombol **Login** di halaman utama.
3. Masukkan email dan password yang sudah terdaftar.
4. Klik **Masuk**.
5. Jika berhasil:
   - User biasa diarahkan ke halaman katalog/beranda.
   - Admin diarahkan ke dashboard admin.

### Cara Menggunakan Fitur Admin
Setelah login sebagai admin, masuk ke dashboard admin untuk mengelola:
- **Produk**
  - Tambah produk baru (nama, harga, stok, deskripsi, gambar).
  - Edit data produk.
  - Hapus produk.
- **Kategori**
  - Tambah dan kelola kategori produk.
- **Pesanan**
  - Lihat daftar pesanan user.
  - Ubah status pesanan (misal: pending, paid, processed, shipped, completed).
- **Pembayaran**
  - Monitoring status pembayaran dari gateway.

### Cara Belanja & Pembayaran
1. Login sebagai user.
2. Pilih produk yang diinginkan dari katalog.
3. Klik **Tambah ke Keranjang**.
4. Buka halaman **Keranjang** lalu cek jumlah dan total harga.
5. Klik **Checkout** dan isi data pengiriman.
6. Pilih metode pembayaran yang tersedia.
7. Sistem membuat transaksi dan mengarahkan user ke halaman pembayaran.
8. Selesaikan pembayaran sesuai instruksi yang tampil.
9. Setelah pembayaran sukses, status pesanan otomatis ter-update.

### Screenshot Halaman Utama
Tambahkan screenshot halaman utama aplikasi pada bagian ini.

Contoh:
- `docs/screenshots/homepage.png`

> Catatan: pastikan screenshot menampilkan navbar, daftar produk, dan elemen penting halaman utama.

---

## 2. Technical Documentation

### ERD / Struktur Database
Tabel inti yang digunakan pada sistem online shop:
- `users` (data akun user/admin)
- `categories` (kategori produk)
- `products` (data produk)
- `carts` (keranjang belanja user)
- `cart_items` (detail item di keranjang)
- `orders` (header transaksi/pesanan)
- `order_items` (detail produk per pesanan)
- `payments` (data pembayaran)
- `webhook_logs` (opsional: log callback webhook pembayaran)

Relasi utama:
- `users` 1..* `orders`
- `orders` 1..* `order_items`
- `products` 1..* `order_items`
- `categories` 1..* `products`
- `orders` 1..1 `payments` (atau 1..* tergantung implementasi retry pembayaran)


### Flow Sistem (Checkout & Payment)
Alur checkout dan payment secara umum:
1. User menambahkan produk ke keranjang.
2. User klik checkout dan submit data pengiriman.
3. Backend membuat `order` dan `order_items`.
4. Backend request pembuatan invoice/payment ke Xendit.
5. Xendit mengembalikan `invoice_url` atau `payment_reference`.
6. Frontend mengarahkan user ke halaman pembayaran Xendit.
7. Setelah user membayar, Xendit mengirim webhook ke backend.
8. Backend memverifikasi webhook (`callback token` / signature).
9. Backend update status pembayaran dan status order.
10. Frontend menampilkan status terbaru ke user.

### Cara Setup Project
Langkah umum setup lokal:
1. Clone repository:
   - `git clone <url-repo>`
   - `cd Ujikom-OnlineShop`
2. Setup backend:
   - Masuk folder backend.
   - Install dependency: `npm install`
   - Salin file env: `.env.example` menjadi `.env` (jika tersedia).
   - Isi konfigurasi database dan Xendit.
   - Jalankan migrasi/seed (jika ada).
   - Jalankan server: `npm run dev`
3. Setup frontend:
   - Masuk folder frontend.
   - Install dependency: `npm install`
   - Salin file env: `.env.example` menjadi `.env` (jika tersedia).
   - Isi URL API backend.
   - Jalankan frontend: `npm run dev`
4. Akses aplikasi di URL yang tampil pada terminal frontend.

### Cara Konfigurasi Xendit & Webhook
1. Buat akun Xendit dan ambil kredensial:
   - `XENDIT_SECRET_KEY`
   - `XENDIT_PUBLIC_KEY` (jika dipakai)
2. Simpan kredensial di file `.env` backend.
3. Tentukan endpoint webhook di backend, contoh:
   - `POST /api/payments/webhook/xendit`
4. Daftarkan URL webhook tersebut di dashboard Xendit.
5. Simpan callback token dari Xendit ke env, contoh:
   - `XENDIT_WEBHOOK_TOKEN=your_callback_token`
6. Di endpoint webhook, validasi token/header dari Xendit sebelum update transaksi.
7. Uji webhook menggunakan:
   - fitur test webhook di dashboard Xendit, atau
   - tunneling lokal (contoh: ngrok) agar endpoint lokal bisa diakses publik.

Contoh variabel environment (backend):
- `XENDIT_SECRET_KEY=...`
- `XENDIT_WEBHOOK_TOKEN=...`
- `XENDIT_SUCCESS_REDIRECT_URL=...`
- `XENDIT_FAILURE_REDIRECT_URL=...`

> Keamanan: jangan pernah commit `.env` berisi secret key ke repository publik.
