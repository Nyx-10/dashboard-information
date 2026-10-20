# Dashboard ADTEC Melaka (PROTON Institute)

Sistem Pengurusan Maklumat Digital, Lost & Found Pintar, serta Komuniti untuk Pusat Latihan Teknologi Tinggi (ADTEC) Melaka / Institut Teknologi Automotif Termaju PROTON.

## 📁 Struktur Direktori (Folder Structure)

```text
Dashboard-information-web/
├── api/                  # Express & Node.js backend (Pengesahan OTP, e-mel SMTP, dan notifikasi pintar)
├── database/             # Skrip SQL, migrasi skema pangkalan data & polisi RLS Supabase
├── docs/                 # Dokumen rujukan dalaman (diabaikan oleh git)
├── poster/               # Fail Poster Pameran Projek bersaiz A1 (PDF Vektor, Studio HTML & skrip penjanaan)
├── public/               # Aset statik web (logo rasmi, imej latar belakang, ikon, PWA manifest)
├── scripts/              # Skrip utiliti pembangun & ujian dalaman
├── src/                  # Kod sumber aplikasi React (Vite + React 19)
│   ├── assets/           # Ikon SVG dan aset komponen
│   ├── components/       # Komponen UI boleh guna semula (Topbar, Sidebar, Chatbot, Toast, Kad)
│   ├── context/          # Context API (Bahasa, Tema, Global State)
│   └── pages/            # Halaman paparan utama sistem (Landing, Dashboard, Auth, Admin, Profil, dsb.)
├── index.html            # Entri HTML utama aplikasi
├── package.json          # Senarai kebergantungan (dependencies) & skrip npm
├── vercel.json           # Konfigurasi deployment ke pelayan Vercel
└── vite.config.js        # Konfigurasi Vite & PWA
```

## 🚀 Pemasangan & Menjalankan Projek (Getting Started)

### 1. Pasang Kebergantungan (Install Dependencies)
```bash
npm install
```

### 2. Konfigurasi Fail `.env`
Pastikan pembolehubah persekitaran (environment variables) diisi dengan nilai yang sah:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
VITE_GEMINI_API_KEY=...
EMAIL_USER=...
EMAIL_PASS=...
```

### 3. Jalankan Pelayan Pembangunan (Development Server)
```bash
npm run dev
```

### 4. Membina Versi Pengeluaran (Production Build)
```bash
npm run build
```
