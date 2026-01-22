# Cara Menjalankan & Mengelola Dev Server

## 🚀 Cara Menjalankan Server

Jalankan script ini untuk memulai backend dan frontend sekaligus:

```cmd
start-dev.bat
```

**Apa yang terjadi:**

- Backend akan berjalan di `http://localhost:3001`
- Frontend akan berjalan di `http://localhost:5173`
- Console logs akan tersimpan ke folder `logs/` (tidak tampil di terminal)

---

## 🛑 Cara Menghentikan Server

Jalankan script ini untuk menghentikan semua server:

```cmd
stop-dev.bat
```

**Atau:**

- Tekan `Ctrl+C` di terminal `start-dev.bat`
- Tutup semua window terminal yang terbuka

---

## 📋 Melihat Log

Log disimpan di folder `logs/` untuk:

- `backend.log` - Log backend (API errors, requests, database)
- `frontend.log` - Log frontend (build errors, warnings)

### Cara lihat log:

**Option 1: Buka di VS Code/NotePad**

```
Buka file: logs\backend.log atau logs\frontend.log
```

**Option 2: Command Line (Windows)**

```cmd
type logs\backend.log
type logs\frontend.log
```

**Option 3: Monitor Real-Time (PowerShell)**

```powershell
Get-Content logs\backend.log -Wait
Get-Content logs\frontend.log -Wait
```

---

## ⚠️ Troubleshooting

**Server tidak mau stop?**

```cmd
# Kill manual port 3001 (Backend)
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Kill manual port 5173 (Frontend)
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

**Ingin lihat console seperti biasa (tanpa log file)?**
Edit `start-dev.bat`, hapus bagian `>> ..\logs\...`
