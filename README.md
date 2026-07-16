# Expense Tracker

Aplikasi web untuk mencatat dan melacak pengeluaran harian, dibangun dengan React.

🔗 **Demo langsung:** https://expense-tracker-angga7.vercel.app


<img width="1920" height="1080" alt="Cuplikan layar dari 2026-07-16 17-48-12" src="https://github.com/user-attachments/assets/2460b594-c65c-4246-9262-7e2a0f31f681" />

## Fitur

- Tambah / hapus catatan pengeluaran & pemasukan
- Visualisasi data dengan grafik (Recharts)
- Konversi mata uang real-time via API, diamankan lewat serverless proxy (Vercel)
- Data tersimpan otomatis di browser (localStorage) — tidak hilang saat refresh
- Tampilan glassmorphism dengan dua tema warna
- Responsif untuk mobile & desktop

## Teknologi

- React
- JavaScript
- CSS (glassmorphism design system)
- Recharts
- Vite
- Vercel Serverless Functions (proxy untuk currency exchange API)

## Menjalankan secara lokal

```
# clone repositori
git clone https://github.com/AnggaNurSalimDev/expense-tracker.git
cd expense-tracker

# install dependency
npm install

# jalankan mode development
npm run dev
```

Buka `http://localhost:5173` di browser.

> Catatan: fitur konversi mata uang membutuhkan API key. Buat file `.env` sesuai contoh di `.env.example` (jika ada) sebelum menjalankan proxy secara lokal.

## Catatan Pengembangan

Proyek ini dibuat sebagai bagian dari portofolio frontend, dengan fokus pada:
- Penanganan state dan data flow di React
- Integrasi API pihak ketiga secara aman (API key tidak diekspos ke client)
- Desain UI kustom (bukan template siap pakai)
