# Panduan Lengkap Deploy ke Vercel

Aplikasi ini menggunakan arsitektur Terpisah (Frontend & Backend), jadi kita akan membuat **2 Project** di Vercel agar website berjalan stabil dan cepat.

---

## 1. Persiapan Kode (Wajib)

Sebelum mulai, pastikan kode laptop sudah ada di GitHub:

1.  Buka Terminal (Ctrl+J).
2.  Ketik perintah ini satu per satu:
    ```bash
    git add .
    git commit -m "Update deploy config"
    git push
    ```

---

## 2. Deploy Backend (Server API) - LAKUKAN DULUAN

Backend harus aktif dulu supaya Frontend bisa mengambil data.

1.  Buka Dashboard Vercel: https://vercel.com/dashboard
2.  Klik **Add New...** > **Project**.
3.  Pilih Repository GitHub Anda (`SM-Demo`). Klik **Import**.
4.  **Konfigurasi Project** (PENTING):
    - **Project Name**: `sm-demo-api` (Saran nama, agar mudah dibedakan).
    - **Root Directory**: Klik **Edit**, ketik `backend`, lalu Simpan.
    - **Environment Variables**: Copy semua text di bawah ini dan Paste ke kolom Environment Variables di Vercel:

    ```text
    SUPABASE_URL=https://eoxrtnmoqtoykbqdsxga.supabase.co
    SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVveHJ0bm1vcXRveWticWRzeGdhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODk3ODMzNywiZXhwIjoyMDg0NTU0MzM3fQ.woidq0VaTomNDgNn72ntiWnA0RF5J3PsCdyYVTX1pO8

    MIDTRANS_SERVER_KEY=(Isi Server Key dari Dashboard Midtrans disini)
    MIDTRANS_CLIENT_KEY=(Isi Client Key dari Dashboard Midtrans disini)
    MIDTRANS_IS_PRODUCTION=false

    JWT_SECRET=rahasia_smm_secure_key

    FRONTEND_URL=https://sm-demo-five.vercel.app
    ```

    _(Ganti bagian dalam kurung dengan Key asli Midtrans Anda)_

5.  Klik **Deploy**. Tunggu sampai statusnya **"Ready"**.
6.  **COPY URL** domain backend tersebut (Contoh: `https://sm-demo-api.vercel.app`). Simpan di Notepad.

---

## 3. Deploy Frontend (Tampilan Website)

Sekarang kita update Frontend agar "nyambung" ke Backend tadi.

1.  Kembali ke Dashboard Vercel.
2.  Pilih Project Frontend Anda yang lama (misal: `sm-demo-five`).
3.  Masuk ke menu **Settings** > **General**.
4.  Pastikan **Root Directory** adalah `frontend`. (Jika belum, ubah dan Save).
5.  Masuk ke menu **Environment Variables**.
6.  Tambahkan Variable baru:
    - **Key**: `VITE_API_URL`
    - **Value**: Paste URL Backend yang tadi Anda copy (Contoh: `https://sm-demo-api.vercel.app`).
    - Klik **Save**.
7.  Masuk ke tab **Deployments**.
8.  Klik titik tiga (⋮) pada deployment paling atas -> pilih **Redeploy**.

---

## ✅ Selesai!

Setelah redeploy Frontend selesai:

1.  Buka website Frontend.
2.  Coba login atau lihat produk.
3.  Jika produk muncul, berarti Frontend & Backend sudah tersambung sukses!

---

### Catatan Troubleshooting

- **Error 404 pada Backend**: Jika dibuka di browser `https://sm-demo-api.vercel.app` muncul 404, itu **NORMAL**. Coba akses `https://sm-demo-api.vercel.app/health`, jika muncul `{"status":"ok"}`, berarti Backend hidup.
- **Layar Putih di Frontend**: Pastikan `VITE_API_URL` tidak memiliki garis miring `/` di akhir (contoh: `...vercel.app` SAJA, jangan `...vercel.app/`).
