# 🖨️ Poster Pameran Projek A1 — Dashboard ADTEC Melaka

Direktori ini mengandungi fail poster rasmi bersaiz **A1 Portrait (`594mm × 841mm`)** untuk tujuan cetakan pameran inovasi, Projek Tahun Akhir (PTA), atau pembentangan projek.

## 📁 Senarai Fail

- **`Poster-A1-Dashboard-ADTEC-Melaka.pdf`** — Fail **PDF Vektor Siap Cetak** pada dimensi fizikal sebenar A1 (`594mm × 841mm`). Boleh dihantar terus ke kedai percetakan (*large-format plotter*).
- **`poster-a1.html`** — **Studio Poster Interaktif (HTML/CSS)**. Boleh dibuka dalam pelayar web (*Chrome / Edge*) untuk menyunting teks secara langsung (*Nama Pelajar, Penyelia, URL Kod QR*), menukar tema (*Gelap / Cerah*), dan mencetak ke PDF A1.
- **`generate-pdf-a1.mjs`** — Skrip Node.js (`jsPDF`) untuk menjana semula fail `Poster-A1-Dashboard-ADTEC-Melaka.pdf`.
- **`generate-poster.mjs`** — Skrip Node.js untuk menjana semula fail `poster-a1.html` dengan logo terbenam (*Base64*).

## 🚀 Cara Menjana Semula Poster (Jika Diperlukan)

Jalankan arahan berikut dari direktori utama projek:

```bash
node poster/generate-pdf-a1.mjs
node poster/generate-poster.mjs
```
