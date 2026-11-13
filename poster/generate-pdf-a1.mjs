import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');

const bannerLogoBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'official_banner_logos.jpg'));
const bannerLogoBase64 = bannerLogoBuffer.toString('base64');

// Tangkapan skrin sebenar sistem web projek
const webPreviewBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'dashboard_preview.png'));
const webPreviewBase64 = webPreviewBuffer.toString('base64');

// Gambar rasmi ketiga-tiga ahli kumpulan
const member1Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member1.jpg'));
const member1Base64 = member1Buffer.toString('base64');

const member2Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member2.jpg'));
const member2Base64 = member2Buffer.toString('base64');

const member3Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member3.jpg'));
const member3Base64 = member3Buffer.toString('base64');

const TARGET_URL = 'https://dashboard-information-nu.vercel.app';

// Cipta dokumen PDF bersaiz A1 sebenar (594mm x 841mm, Portrait)
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: [594, 841],
  compress: true,
});

const W = 594;
const H = 841;

// Palet Warna Minimalis & Eksklusif (RGB)
const C = {
  bgMain: [9, 14, 29],
  bgCard: [15, 23, 42],
  bgCardInner: [30, 41, 59],
  white: [255, 255, 255],
  textMain: [248, 250, 252],
  textSec: [203, 213, 225],
  textMuted: [148, 163, 184],
  indigo: [99, 102, 241],
  indigoLight: [129, 140, 248],
  indigoDark: [49, 46, 129],
  cyan: [56, 189, 248],
  emerald: [16, 185, 129],
  rose: [244, 63, 94],
  amber: [245, 158, 11],
  borderCard: [51, 65, 85],
  borderSubtle: [30, 41, 59],
};

function setFill(rgb) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}
function setStroke(rgb, width = 0.5) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  doc.setLineWidth(width);
}
function setText(rgb, size = 12, style = 'normal') {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  doc.setFont('helvetica', style);
  doc.setFontSize(size);
}

function drawWrappedText(text, x, y, maxW, fontSize, rgb = C.textSec, style = 'normal', lineHeightFactor = 1.4) {
  setText(rgb, fontSize, style);
  const lines = doc.splitTextToSize(text, maxW);
  const lineH = fontSize * 0.3527 * lineHeightFactor;
  lines.forEach((line, i) => {
    doc.text(line, x, y + i * lineH);
  });
  return y + lines.length * lineH;
}

// 0. Latar Belakang & Bingkai
setFill(C.bgMain);
doc.rect(0, 0, W, H, 'F');

// Bingkai Luar Elegan
setStroke(C.indigo, 0.7);
doc.roundedRect(12, 12, W - 24, H - 24, 7, 7, 'S');

// ============================================================================
// 1. HEADER BESAR, BERSIH & BERPRESTIJ + AHLI BERGAMBAR & PENYELIA ATAS SEKALI (y = 18mm, h = 142mm)
// ============================================================================
const hx = 18, hy = 18, hw = 558, hh = 142;
setFill(C.bgCard);
setStroke(C.indigo, 0.8);
doc.roundedRect(hx, hy, hw, hh, 6, 6, 'FD');

// Top Accent Gradient Bar
setFill(C.indigo);
doc.roundedRect(hx, hy, hw, 3.5, 2, 2, 'F');

// Kotak Putih Logo Rasmi Gabungan (JTM • Jata Negara • PROTON Institute)
const bannerW = 146, bannerH = 29;
const bx = W / 2 - bannerW / 2;
const by = hy + 7;
setFill(C.white);
doc.roundedRect(bx - 6, by - 2, bannerW + 12, bannerH + 4, 3.5, 3.5, 'F');
doc.addImage(bannerLogoBase64, 'JPEG', bx, by, bannerW, bannerH);

// Institusi Pill Badge
setFill(C.bgCardInner);
setStroke(C.indigoLight, 0.4);
doc.roundedRect(W / 2 - 105, hy + 40, 210, 9, 4, 4, 'FD');
setText(C.cyan, 11, 'bold');
doc.text('PUSAT LATIHAN TEKNOLOGI TINGGI (ADTEC) MELAKA', W / 2, hy + 46.2, { align: 'center' });

// Tajuk Utama Poster
setText(C.white, 36, 'bold');
doc.text('DASHBOARD ADTEC MELAKA', W / 2, hy + 60.5, { align: 'center' });

// Subtajuk
setText(C.textSec, 15, 'bold');
doc.text('Hab Maklumat Digital & Sistem Lost & Found Pintar Berasaskan AI', W / 2, hy + 69.5, { align: 'center' });

// Garis Pemisah
setStroke(C.borderCard, 0.4);
doc.line(hx + 16, hy + 75.5, hx + hw - 16, hy + 75.5);

// AHLI KUMPULAN BERGAMBAR & PENYELIA (ATAS SEKALI)
const ty = hy + 80, th = 55;

// Kad 1: Ahli Kumpulan Berserta Gambar (Lebar: 372mm)
const t1x = hx + 8, t1w = 372;
setFill(C.bgCardInner);
setStroke(C.indigoLight, 0.45);
doc.roundedRect(t1x, ty, t1w, th, 4, 4, 'FD');
setText(C.cyan, 10.5, 'bold');
doc.text('AHLI KUMPULAN PROJEK', t1x + 8, ty + 7.5);

const slotW = (t1w - 20) / 3; // 117.3mm
const memberData = [
  { img: member1Base64, name: 'MUHAMMAD ADAM DARWISH BIN NOR HAIDIL' },
  { img: member2Base64, name: 'HAZIM AFIQ BIN RAZALI' },
  { img: member3Base64, name: 'MUHAMMAD SYAHMI BIN YAZMIN' },
];

memberData.forEach((m, idx) => {
  const sx = t1x + 6 + idx * (slotW + 4);
  setFill([15, 23, 42]);
  setStroke(C.borderSubtle, 0.4);
  doc.roundedRect(sx, ty + 10.5, slotW, 40, 3, 3, 'FD');

  // Gambar Ahli
  doc.addImage(m.img, 'JPEG', sx + 3.5, ty + 13, 24, 32);
  setStroke(C.cyan, 0.5);
  doc.roundedRect(sx + 3.5, ty + 13, 24, 32, 1.5, 1.5, 'S');

  // Nama Ahli
  drawWrappedText(m.name, sx + 31, ty + 19, slotW - 34, 9.6, C.white, 'bold', 1.25);
  setText(C.cyan, 8.8, 'bold');
  doc.text('Pelajar TVET', sx + 31, ty + 46);
});

// Kad 2: Penyelia Projek & Institusi (Lebar: 164mm)
const t2x = hx + 386, t2w = 164;
setFill(C.bgCardInner);
setStroke(C.indigoLight, 0.45);
doc.roundedRect(t2x, ty, t2w, th, 4, 4, 'FD');

// Blok Penyelia
setText(C.cyan, 10.5, 'bold');
doc.text('PENYELIA PROJEK', t2x + 8, ty + 7.5);
setText(C.white, 12.5, 'bold');
doc.text('Encik Nik Mohd Fairus Bin Ismail', t2x + 8, ty + 17);
setText(C.textMuted, 10, 'normal');
doc.text('Pensyarah Pembimbing ADTEC Melaka', t2x + 8, ty + 24.5);

// Divider
setStroke(C.borderSubtle, 0.4);
doc.line(t2x + 8, ty + 29, t2x + t2w - 8, ty + 29);

// Blok Institusi
setText(C.cyan, 10.5, 'bold');
doc.text('INSTITUSI & SESI', t2x + 8, ty + 37);
setText(C.white, 12.5, 'bold');
doc.text('ADTEC Melaka', t2x + 8, ty + 47);
setText(C.textMuted, 10, 'normal');
doc.text('Inovasi Digital TVET • Sesi 2026', t2x + 44, ty + 47);

// ============================================================================
// 2. BARIS 1: MASALAH VS PENYELESAIAN (y = 170mm, h = 132mm)
// ============================================================================
const r1y = 170, r1h = 132;
const cardW = (hw - 16) / 2; // 271mm

// Kad Kiri: Cabaran & Isu Semasa
const c1x = hx;
setFill(C.bgCard);
setStroke(C.rose, 0.7);
doc.roundedRect(c1x, r1y, cardW, r1h, 5, 5, 'FD');

// Top Accent Bar
setFill(C.rose);
doc.roundedRect(c1x, r1y, cardW, 2.5, 2, 2, 'F');

// Tajuk Seksyen Cabaran
setFill(C.bgCardInner);
setStroke(C.rose, 0.4);
doc.roundedRect(c1x + 10, r1y + 9, 12, 12, 3, 3, 'FD');
setText(C.rose, 14, 'bold');
doc.text('!', c1x + 16, r1y + 18, { align: 'center' });

setText(C.rose, 17.5, 'bold');
doc.text('CABARAN & ISU SEMASA', c1x + 28, r1y + 18);

const problems = [
  { t: 'Hebahan Terlepas Pandang:', d: 'Maklumat rasmi kolej di WhatsApp cepat tenggelam dan poster kertas mudah koyak atau tercicir.' },
  { t: 'Keciciran Barang Sukar Dijejak:', d: 'Tiada rekod berpusat untuk menjejak barang hilang atau mengesahkan kesahihan pemilik barang.' },
  { t: 'Ketirisan Privasi Pelajar:', d: 'Perkongsian nombor telefon peribadi secara terbuka di grup awam mendedahkan pelajar kepada risiko scam.' },
];

let py = r1y + 33;
problems.forEach((p) => {
  setText(C.rose, 14, 'bold');
  doc.text('x', c1x + 12, py);

  setText(C.white, 13, 'bold');
  doc.text(p.t, c1x + 20, py);

  py = drawWrappedText(p.d, c1x + 20, py + 6, cardW - 32, 11.5, C.textSec, 'normal', 1.35);
  py += 7.5;
});

// Kad Kanan: Penyelesaian Digital Pintar
const c2x = hx + cardW + 16;
setFill(C.bgCard);
setStroke(C.emerald, 0.7);
doc.roundedRect(c2x, r1y, cardW, r1h, 5, 5, 'FD');

// Top Accent Bar
setFill(C.emerald);
doc.roundedRect(c2x, r1y, cardW, 2.5, 2, 2, 'F');

// Tajuk Seksyen Penyelesaian
setFill(C.bgCardInner);
setStroke(C.emerald, 0.4);
doc.roundedRect(c2x + 10, r1y + 9, 12, 12, 3, 3, 'FD');
setText(C.emerald, 13, 'bold');
doc.text('OK', c2x + 16, r1y + 18, { align: 'center' });

setText(C.emerald, 17.5, 'bold');
doc.text('PENYELESAIAN DIGITAL PINTAR', c2x + 28, r1y + 18);

const solutions = [
  { t: 'Hab Digital Berpusat:', d: 'Pengumuman rasmi diurus secara sistematik dan dipaparkan di telefon pintar serta skrin TV Kiosk kolej.' },
  { t: 'Lost & Found Masa Nyata:', d: 'Lapor dan semak barangan tercicir berserta foto, tarikh & lokasi penemuan secara masa nyata.' },
  { t: 'Sembang Selamat & Tertutup:', d: 'Komunikasi tertutup secara terus dalam portal tanpa perlu berkongsi nombor telefon peribadi.' },
];

let sy = r1y + 33;
solutions.forEach((s) => {
  setText(C.emerald, 14, 'bold');
  doc.text('V', c2x + 12, sy);

  setText(C.white, 13, 'bold');
  doc.text(s.t, c2x + 20, sy);

  sy = drawWrappedText(s.d, c2x + 20, sy + 6, cardW - 32, 11.5, C.textSec, 'normal', 1.35);
  sy += 7.5;
});

// ============================================================================
// 3. BARIS 2: 3 CIRI UTAMA (KIRI) + GAMBAR WEBSITE PROJEK (KANAN) (y = 312mm, h = 200mm)
// ============================================================================
const r2y = 312, r2h = 200;
const featW = 265;
const mockW = hw - featW - 16; // 277mm

// 3 CIRI UTAMA BERTINGKAT (KIRI)
const pillars = [
  {
    num: '1',
    title: 'Pusat Maklumat Kampus',
    desc: 'Hebahan rasmi aktiviti kolej, notis pentadbiran dan acara penting terus ke peranti warga kolej serta paparan skrin TV Kiosk kampus.',
    badge: 'TV Kiosk & Web',
    color: C.cyan,
  },
  {
    num: '2',
    title: 'Lost & Found Pintar',
    desc: 'Carian pantas barang tercicir mengikut kategori & lokasi, rekod bukti penemuan teratur, dan sembang pengesahan pemilik selamat.',
    badge: 'Realtime Database',
    color: C.amber,
  },
  {
    num: '3',
    title: 'AdtecBot AI (Gemini)',
    desc: 'Pembantu maya pintar berasaskan Google Gemini yang sedia membantu menjawab sebarang pertanyaan seputar sistem & panduan kampus 24/7.',
    badge: 'Kecerdasan Buatan',
    color: C.indigoLight,
  },
];

const fCardH = 61;
pillars.forEach((p, idx) => {
  const fy = r2y + idx * (fCardH + 8.5);
  setFill(C.bgCard);
  setStroke(p.color, 0.55);
  doc.roundedRect(hx, fy, featW, fCardH, 4, 4, 'FD');

  // Ikon Kotak
  setFill(C.bgCardInner);
  setStroke(p.color, 0.4);
  doc.roundedRect(hx + 8, fy + 8, 16, 16, 3, 3, 'FD');
  setText(p.color, 15, 'bold');
  doc.text(p.num, hx + 16, fy + 19.5, { align: 'center' });

  // Tajuk Ciri
  setText(C.white, 15.5, 'bold');
  doc.text(p.title, hx + 30, fy + 16);

  // Badge Kanan
  setText(p.color, 10.5, 'bold');
  doc.text(p.badge, hx + featW - 10, fy + 16, { align: 'right' });

  // Penerangan
  drawWrappedText(p.desc, hx + 10, fy + 30, featW - 20, 11.2, C.textSec, 'normal', 1.35);
});

// GAMBAR WEBSITE PROJEK / BROWSER MOCKUP (KANAN)
const mockX = hx + featW + 16;
setFill(C.bgCard);
setStroke(C.indigoLight, 0.7);
doc.roundedRect(mockX, r2y, mockW, r2h, 5, 5, 'FD');

// Browser Bar Atas
const bBarH = 15;
setFill(C.bgMain);
doc.roundedRect(mockX + 4, r2y + 4, mockW - 8, bBarH, 3, 3, 'F');

// Browser Dots (Red, Yellow, Green)
setFill(C.rose);
doc.circle(mockX + 12, r2y + 11.5, 2.4, 'F');
setFill(C.amber);
doc.circle(mockX + 19, r2y + 11.5, 2.4, 'F');
setFill(C.emerald);
doc.circle(mockX + 26, r2y + 11.5, 2.4, 'F');

// Browser URL Pill
setFill(C.bgCardInner);
setStroke(C.cyan, 0.4);
doc.roundedRect(mockX + 34, r2y + 6.5, mockW - 46, 10, 2.5, 2.5, 'FD');
setText(C.cyan, 9.6, 'bold');
doc.text('https://dashboard-information-nu.vercel.app', mockX + 34 + (mockW - 46) / 2, r2y + 13.5, { align: 'center' });

// Masukkan Tangkapan Skrin Sebenar Web Projek
const imgW = mockW - 12;
const imgH = 158;
doc.addImage(webPreviewBase64, 'PNG', mockX + 6, r2y + 22, imgW, imgH);

// Kapsyen Bawah Mockup
setText(C.white, 11.5, 'bold');
doc.text('Paparan Antaramuka Laman Web Sebenar Sistem', mockX + 8, r2y + r2h - 7);
setText(C.cyan, 10.5, 'bold');
doc.text('Akses Responsif Web & PWA', mockX + mockW - 8, r2y + r2h - 7, { align: 'right' });

// ============================================================================
// 4. BARIS 3: METRIK KELEBIHAN & HERO SCAN KOD QR (y = 522mm, h = 264mm)
// ============================================================================
const r3y = 522, r3h = 264;
const metW = 314;
const qrCardW = hw - metW - 16; // 228mm

// Kad Kiri: 4 Metrik Kelebihan (2x2 Grid)
setFill(C.bgCard);
setStroke(C.indigo, 0.6);
doc.roundedRect(hx, r3y, metW, r3h, 5, 5, 'FD');

// Accent Line
setFill(C.indigo);
doc.roundedRect(hx, r3y, metW, 2.5, 2, 2, 'F');

// Tajuk Metrik
setText(C.white, 17.5, 'bold');
doc.text('KELEBIHAN UTAMA & NILAI TAMBAH', hx + 16, r3y + 19);

const stats = [
  { h: '100% Realtime', sub: 'Pangkalan Data Awan', d: 'Dikuasakan Supabase PostgreSQL & WebSockets untuk kemas kini data secara langsung.', c: C.cyan },
  { h: 'Kawalan Selamat', sub: 'Peranan & Privasi', d: 'Pengesahan OTP e-mel rasmi dan polisi RLS melindungi data pelajar.', c: C.emerald },
  { h: 'Mesra Semua Skrin', sub: 'Sokongan PWA', d: 'Boleh dipasang pada telefon pintar (Android/iOS) dan skrin TV Kiosk.', c: C.amber },
  { h: 'Kampus Hijau', sub: 'Sifar Kertas Notis', d: 'Menggantikan buku log manual dan mengurangkan pembaziran kertas buangan.', c: C.indigoLight },
];

const tileW = (metW - 32) / 2; // 141mm
const tileH = 104;

stats.forEach((st, sidx) => {
  const col = sidx % 2;
  const row = Math.floor(sidx / 2);
  const tx = hx + 12 + col * (tileW + 8);
  const ty = r3y + 30 + row * (tileH + 10);

  setFill(C.bgCardInner);
  setStroke(st.c, 0.4);
  doc.roundedRect(tx, ty, tileW, tileH, 4, 4, 'FD');

  setText(st.c, 15.5, 'bold');
  doc.text(st.h, tx + 10, ty + 16);

  setText(C.white, 12.5, 'bold');
  doc.text(st.sub, tx + 10, ty + 26);

  drawWrappedText(st.d, tx + 10, ty + 37, tileW - 18, 10.5, C.textSec, 'normal', 1.35);
});

// Kad Kanan: HERO SCAN KOD QR (BESAR & SANGAT JELAS)
const qCardX = hx + metW + 16;
setFill([20, 29, 52]);
setStroke(C.indigoLight, 1.0);
doc.roundedRect(qCardX, r3y, qrCardW, r3h, 6, 6, 'FD');

// Top Accent Pill
setFill(C.indigo);
doc.roundedRect(qCardX + qrCardW / 2 - 50, r3y - 6, 100, 13, 6.5, 6.5, 'F');
setText(C.white, 11, 'bold');
doc.text('IMBAS UNTUK CUBA', qCardX + qrCardW / 2, r3y + 3, { align: 'center' });

// Kotak Putih Kod QR (Sangat Kontras)
const qrBoxSize = 110;
const qbx = qCardX + (qrCardW - qrBoxSize) / 2;
const qby = r3y + 19;

setFill(C.white);
setStroke(C.indigoLight, 0.8);
doc.roundedRect(qbx, qby, qrBoxSize, qrBoxSize, 6, 6, 'FD');

// Lukis Kod QR Vektor Sebenar (Resolusi Tajam)
const qrData = QRCode.create(TARGET_URL, { errorCorrectionLevel: 'M' });
const qrN = qrData.modules.size;
const qrRenderSize = qrBoxSize - 16; // 94mm
const cell = qrRenderSize / qrN;
const qrStartX = qbx + 8;
const qrStartY = qby + 8;

setFill(C.bgMain);
for (let r = 0; r < qrN; r++) {
  for (let c = 0; c < qrN; c++) {
    if (qrData.modules.get(r, c)) {
      doc.rect(qrStartX + c * cell, qrStartY + r * cell, cell + 0.05, cell + 0.05, 'F');
    }
  }
}

// URL Badge
setFill(C.bgCard);
setStroke(C.cyan, 0.5);
doc.roundedRect(qCardX + 14, r3y + 142, qrCardW - 28, 16, 4, 4, 'FD');
setText(C.cyan, 12.5, 'bold');
doc.text('dashboard-information-nu.vercel.app', qCardX + qrCardW / 2, r3y + 152.5, { align: 'center' });

// Arahan Scan
setText(C.white, 15.5, 'bold');
doc.text('Halakan Kamera Telefon Anda', qCardX + qrCardW / 2, r3y + 176, { align: 'center' });
doc.text('Untuk Uji Sistem Sekarang', qCardX + qrCardW / 2, r3y + 185, { align: 'center' });

setText(C.textMuted, 11.5, 'normal');
doc.text('Akses serta-merta tanpa perlu memasang sebarang aplikasi.', qCardX + qrCardW / 2, r3y + 201, { align: 'center' });
doc.text('Boleh dicuba sebagai Pelawat (Guest Mode).', qCardX + qrCardW / 2, r3y + 209, { align: 'center' });

// ============================================================================
// 5. FOOTER POSTER (y = 796mm, h = 22mm)
// ============================================================================
const fy = 796, fh = 22;
setFill(C.bgCard);
setStroke(C.indigo, 0.5);
doc.roundedRect(hx, fy, hw, fh, 4, 4, 'FD');

setText(C.textSec, 12, 'normal');
doc.text(
  'PUSAT LATIHAN TEKNOLOGI TINGGI (ADTEC) MELAKA (PROTON INSTITUTE)  •  Bandar Vendor, Taboh Naning, 78000 Alor Gajah, Melaka  •  Tel: 06-552 7227',
  W / 2,
  fy + 14,
  { align: 'center' }
);

const pdfOutPath = path.join(workspaceDir, 'poster', 'Poster-A1-Dashboard-ADTEC-Melaka.pdf');
const pdfBytes = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(pdfOutPath, pdfBytes);
console.log('Successfully generated clean, minimalist vector A1 PDF with 3 Member Photos at:', pdfOutPath);
