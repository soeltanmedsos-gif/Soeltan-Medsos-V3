# Laporan Serah Terima: Soeltan Medsos (Web App)

## 1. Fitur Utama (CRUD Features)

Aplikasi ini memiliki sistem manajemen data lengkap untuk Admin:

### A. Manajemen Produk (Services)

- **Create**: Menambah layanan baru (Nama, Kategori, Harga, Min/Max Order).
- **Read**: Melihat daftar layanan yang tersedia dengan filter kategori.
- **Update**: Mengedit harga layanan atau info detail lainnya.
- **Delete**: Menghapus layanan yang sudah tidak aktif.

### B. Manajemen Kategori

- **Update/Delete**: Mengelola kategori layanan.

### C. Manajemen Pesanan (Orders)

- **Read**: Admin dapat melihat semua pesanan masuk.
- **Update**: Mengubah status pesanan manual (Processing -> Success).
- **Update Pembayaran**: Admin kini bisa mengubah status pembayaran manual (Pending -> Paid).

---

## 2. Status Payment Gateway (Midtrans) - _PENTING_

Sistem pembayaran telah dikonfigurasi ke **MODE PRODUKSI (LIVE)**.

- **Status**: ✅ Siap menerima uang asli.
- **Tindakan Diperlukan**: Input **Server Key** & **Client Key** produksi dari dashboard Midtrans ke file `.env` di server Backend.

---

## 3. Cara Deploy (Panduan Instalasi)

Benar, deployment dilakukan **2 KALI** (Backend dulu, baru Frontend).

### Tahap 1: Deploy Backend (Server)

Tujuannya: Agar API & Database online dulu.

1.  Upload folder `backend` ke layanan hosting (Vercel/Railway/VPS).
2.  Set Environment Variables (`DATABASE_URL`, `SUPABASE_KEY`, `MIDTRANS_SERVER_KEY`, dll).
3.  Deploy.
4.  **COPY URL Backend** yang sudah jadi (Contoh: `https://api-soeltan.vercel.app`). Simpan URL ini.

### Tahap 2: Deploy Frontend (Tampilan)

Tujuannya: Agar website bisa diakses user dan terhubung ke Backend tadi.

1.  Buka project `frontend`.
2.  Set Environment Variable:
    - `VITE_API_URL` = (Paste URL Backend dari Tahap 1 tadi).
3.  Deploy Frontend (Vercel/Netlify).
4.  Selesai! Website sudah bisa dibuka.

---

**Kesimpulan:**
Aplikasi sudah **SIAP LIVE**.
Ikuti urutan deploy: **BACKEND** -> **FRONTEND**.
