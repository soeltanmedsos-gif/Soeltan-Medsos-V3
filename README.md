# Soeltan Medsos - Full Stack Application

Aplikasi web E-Commerce untuk layanan Social Media Marketing (SMM) dengan integrasi pembayaran Midtrans.
Dibangun dengan React (Frontend) dan Express/Node.js (Backend).

## � Fitur Utama

- **Storefront Modern**: Desain premium dengan Dark Mode & Glassmorphism.
- **Shopping Cart**: Keranjang belanja dengan state management.
- **Checkout & Payment**: Integrasi Midtrans Snap (Otomatis cek status).
- **Admin Dashboard**:
  - Manajemen Produk (CRUD, 2-Column Grid).
  - Manajemen Order (Filter Platform, Status, Update Resi).
  - Visual Charts untuk monitoring penjualan.
- **Responsive**: Tampilan optimal di Mobile (Android/iOS) dan Desktop.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Axios.
- **Backend**: Node.js, Express, Supabase (PostgreSQL), Midtrans Client.
- **Database**: PostgreSQL (via Supabase).

## 📦 Instalasi & Menjalankan

### Persiapan

Pastikan sudah menginstall:

- Node.js (v18+)
- PostgreSQL (atau akun Supabase)
- Akun Midtrans (Sandbox/Production)

### 1. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env sesuai konfigurasi database & midtrans Anda
npm run dev
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Akses aplikasi di: `http://localhost:5173`

## 🔑 Konfigurasi Midtrans

1.  Dapatkan **Server Key** dan **Client Key** dari Dashboard Midtrans.
2.  Masukkan Server Key di `backend/.env`.
3.  Masukkan Client Key di `frontend/index.html` (ganti `YOUR_CLIENT_KEY` di tag script Snap) ATAU gunakan environment variable.
4.  Pastikan Mode Sandbox/Production sesuai.

## ⚠️ Troubleshooting

### Error Midtrans / Payment Gagal

Jika Anda menjumpai error seperti:

- `ChunkLoadError`
- `spoofer.js error`
- Pop-up pembayaran tidak muncul atau blank putih.

**Solusi:**

1.  **Matikan AdBlocker**: Extension pemblokir iklan sering memblokir script pembayaran.
2.  **Matikan Extension Lain**: Extension seperti "Location Spoofer", "VPN", atau "Privacy Badger" dapat mengganggu script keamanan Midtrans.
3.  **Gunakan Incognito Mode**: Coba lakukan checkout di Tab Penyamaran (Incognito) untuk memastikan tidak ada cache/extension yang mengganggu.
4.  **Cek Client Key**: Pastikan `data-client-key` di `index.html` sudah benar.

## 📚 Struktur Project

Lihat [CHEAT_SHEET.md](./frontend/CHEAT_SHEET.md) untuk panduan developer lengkap.
