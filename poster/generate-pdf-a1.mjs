import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';

const workspaceDir = 'C:\\Users\\User\\Documents\\Dashboard-information-web';
const ksmLogoBase64 = fs.readFileSync(path.join(workspaceDir, 'public', 'ksm_logo.jpg')).toString('base64');
const adtecLogoBase64 = fs.readFileSync(path.join(workspaceDir, 'public', 'app_icon.png')).toString('base64');

// Cipta dokumen PDF bersaiz A1 sebenar (594mm x 841mm, Portrait)
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: [594, 841],
  compress: true,
});

const W = 594;
const H = 841;

// Palet Warna Tema Gelap Eksklusif (RGB)
const C = {
  bgMain: [7, 11, 25],
  bgHeader: [19, 24, 54],
  bgCard: [15, 23, 42],
  bgInner: [23, 33, 56],
  bgMock: [11, 17, 32],
  bgMockBar: [30, 41, 59],
  white: [255, 255, 255],
  textMain: [248, 250, 252],
  textSec: [203, 213, 225],
  textMuted: [148, 163, 184],
  indigo: [99, 102, 241],
  indigoLight: [129, 140, 248],
  indigoDark: [49, 46, 129],
  violet: [139, 92, 246],
  cyan: [6, 182, 212],
  cyanLight: [34, 211, 238],
  emerald: [16, 185, 129],
  emeraldLight: [52, 211, 153],
  amber: [245, 158, 11],
  amberLight: [251, 191, 36],
  rose: [239, 68, 68],
  roseLight: [248, 113, 113],
  borderSubtle: [51, 65, 85],
};

function setFill(rgb) {
  doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}
function setStroke(rgb, width = 0.4) {
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  doc.setLineWidth(width);
}
function setText(rgb, size = 12, style = 'normal') {
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  doc.setFont('helvetica', style);
  doc.setFontSize(size);
}

function drawCard(x, y, w, h, accentRgb = C.indigo, titleNum = '01', kicker = '', title = '') {
  // Kotak Kad Utama
  setFill(C.bgCard);
  setStroke(accentRgb, 0.55);
  doc.roundedRect(x, y, w, h, 4.5, 4.5, 'FD');

  // Jalur Aksen Atas
  setFill(accentRgb);
  doc.roundedRect(x, y, w, 2.2, 2, 2, 'F');

  if (title) {
    // Kotak Nombor Seksyen
    setFill(C.bgInner);
    setStroke(accentRgb, 0.45);
    doc.roundedRect(x + 6, y + 6, 11, 11, 2.5, 2.5, 'FD');
    setText(accentRgb, 12, 'bold');
    doc.text(titleNum, x + 11.5, y + 13, { align: 'center' });

    // Kicker & Tajuk
    setText(C.textMuted, 8.5, 'bold');
    doc.text(kicker.toUpperCase(), x + 20, y + 10);
    setText(C.textMain, 14.5, 'bold');
    doc.text(title, x + 20, y + 16);

    // Garis Pemisah
    setStroke(C.borderSubtle, 0.35);
    doc.line(x + 6, y + 20, x + w - 6, y + 20);
  }
}

function drawWrappedText(text, x, y, maxW, fontSize, rgb = C.textSec, style = 'normal', lineHeightFactor = 1.38) {
  setText(rgb, fontSize, style);
  const lines = doc.splitTextToSize(text, maxW);
  const lineH = fontSize * 0.3527 * lineHeightFactor;
  lines.forEach((line, i) => {
    doc.text(line, x, y + i * lineH);
  });
  return y + lines.length * lineH;
}

// ============================================================================
// 0. LATAR BELAKANG & BINGKAI LUAR A1
// ============================================================================
setFill(C.bgMain);
doc.rect(0, 0, W, H, 'F');

// Grid Halus Dekoratif
setStroke([18, 28, 52], 0.2);
for (let gx = 14; gx < W; gx += 16) {
  doc.line(gx, 0, gx, H);
}
for (let gy = 14; gy < H; gy += 16) {
  doc.line(0, gy, W, gy);
}

// Bingkai Luar
setStroke(C.indigo, 0.6);
doc.roundedRect(9, 9, W - 18, H - 18, 6, 6, 'S');

// ============================================================================
// 1. HEADER UTAMA RASMI (y = 14mm, h = 116mm)
// ============================================================================
const hx = 14, hy = 14, hw = 566, hh = 116;
setFill(C.bgHeader);
setStroke(C.indigoLight, 0.8);
doc.roundedRect(hx, hy, hw, hh, 5.5, 5.5, 'FD');

// Jalur Atas Header
setFill(C.indigo);
doc.roundedRect(hx, hy, hw, 3, 2, 2, 'F');

// Kad Logo Kiri (KSM)
setFill(C.white);
doc.roundedRect(hx + 8, hy + 7, 66, 32, 3.5, 3.5, 'F');
doc.addImage(ksmLogoBase64, 'JPEG', hx + 13, hy + 8.5, 56, 29);

// Kad Logo Kanan (ADTEC Melaka)
setFill(C.white);
doc.roundedRect(hx + hw - 74, hy + 7, 66, 32, 3.5, 3.5, 'F');
doc.addImage(adtecLogoBase64, 'JPEG', hx + hw - 69, hy + 9.5, 56, 27);

// Teks Institusi Tengah
setFill([40, 48, 107]);
setStroke(C.indigoLight, 0.4);
doc.roundedRect(W / 2 - 96, hy + 7, 192, 8.5, 4, 4, 'FD');
setText([224, 231, 255], 10, 'bold');
doc.text('PAMERAN INOVASI & PROJEK TAHUN AKHIR TVET  •  ADTEC MELAKA 2026', W / 2, hy + 12.6, { align: 'center' });

setText(C.cyanLight, 12.5, 'bold');
doc.text('KEMENTERIAN SUMBER MANUSIA (KESUMA)  •  JABATAN TENAGA MANUSIA (JTM)', W / 2, hy + 24, { align: 'center' });

setText(C.white, 17, 'bold');
doc.text('PUSAT LATIHAN TEKNOLOGI TINGGI (ADTEC) MELAKA  •  PROTON INSTITUTE', W / 2, hy + 34, { align: 'center' });

// Garis Pemisah Header
setStroke(C.borderSubtle, 0.4);
doc.line(hx + 8, hy + 43, hx + hw - 8, hy + 43);

// Lencana Kategori Projek
setFill(C.indigoDark);
setStroke(C.cyanLight, 0.45);
doc.roundedRect(W / 2 - 118, hy + 47, 236, 8, 4, 4, 'FD');
setText(C.amberLight, 9.8, 'bold');
doc.text('SISTEM PENGURUSAN MAKLUMAT DIGITAL & KOMUNITI PINTAR BERASASKAN AI & CLOUD', W / 2, hy + 52.3, { align: 'center' });

// Tajuk Utama Projek
setText(C.white, 43, 'bold');
doc.text('DASHBOARD ADTEC MELAKA', W / 2, hy + 70.5, { align: 'center' });

// Subtajuk Projek
setText(C.textSec, 13, 'bold');
doc.text(
  'Platform Web Progresif (PWA) Sehenti bagi Pengurusan Barang Tercicir (Lost & Found) Pintar, Hebahan Maklumat Rasmi Kolej,',
  W / 2,
  hy + 79.5,
  { align: 'center' }
);
doc.text(
  'Pemesejan Langsung 1-ke-1 & Pembantu Maya AI (AdtecBot) Berasaskan Pangkalan Data Masa Nyata (Supabase Realtime)',
  W / 2,
  hy + 86,
  { align: 'center' }
);

// Bar Metadata (4 Kolum)
setStroke(C.borderSubtle, 0.4);
doc.line(hx + 8, hy + 91, hx + hw - 8, hy + 91);

const metaItems = [
  { lbl: 'PEMBANGUN / KUMPULAN PROJEK', val: 'Warga Inovasi TVET ADTEC Melaka' },
  { lbl: 'PENYELIA / PENASIHAT PROJEK', val: 'Pensyarah Penyelia Projek ADTEC Melaka' },
  { lbl: 'BIDANG / KLUSTER INOVASI', val: 'Teknologi Maklumat, AI & Kampus Pintar' },
  { lbl: 'TEKNOLOGI TERAS SISTEM', val: 'React 19 • Supabase • Google Gemini AI' },
];
const metaW = (hw - 16 - 18) / 4;
metaItems.forEach((m, idx) => {
  const mx = hx + 8 + idx * (metaW + 6);
  const my = hy + 94.5;
  setFill(C.bgCard);
  setStroke(C.borderSubtle, 0.35);
  doc.roundedRect(mx, my, metaW, 17, 3, 3, 'FD');
  setText(C.cyanLight, 8.2, 'bold');
  doc.text(m.lbl, mx + 4.5, my + 6);
  setText(C.white, 11, 'bold');
  doc.text(m.val, mx + 4.5, my + 13);
});

// ============================================================================
// 2. BARIS 1: PENGENALAN, PERNYATAAN MASALAH & OBJEKTIF (y = 136mm, h = 148mm)
// ============================================================================
const r1y = 136, r1h = 148, col3w = 184;

// --- KAD 01: PENGENALAN & ABSTRAK ---
drawCard(14, r1y, col3w, r1h, C.indigo, '01', 'Ringkasan Eksekutif Projek', 'PENGENALAN & ABSTRAK');

let cy1 = r1y + 26.5;
cy1 = drawWrappedText(
  'Dashboard ADTEC Melaka (PROTON Institute) ialah sebuah ekosistem digital bersepadu yang dibangunkan khusus untuk memodenkan cara penyampaian maklumat rasmi serta pengurusan kebajikan pelajar dan kakitangan di dalam kampus.',
  20,
  cy1,
  col3w - 12,
  10.5,
  C.textSec
);
cy1 += 3;
cy1 = drawWrappedText(
  'Sebelum ini, urusan pelaporan barang tercicir (Lost & Found) serta pengumuman penting kolej bergantung kepada papan kenyataan fizikal dan kumpulan sembang tidak berstruktur. Sistem ini menyelesaikan jurang tersebut melalui pangkalan data awan masa nyata (Supabase PostgreSQL), pengesahan keselamatan berlapis (OTP E-mel & RLS), serta kecerdasan buatan (Google Gemini AI).',
  20,
  cy1,
  col3w - 12,
  10.5,
  C.textSec
);

// Kotak Fokus Utama dalam Kad 01
setFill(C.bgInner);
setStroke(C.cyan, 0.35);
doc.roundedRect(20, r1y + 83.5, col3w - 12, 18.5, 2.5, 2.5, 'FD');
setText(C.cyanLight, 9.5, 'bold');
doc.text('TERAS TRANSFORMASI DIGITAL KAMPUS:', 24, r1y + 90);
setText(C.textSec, 9.2, 'normal');
doc.text('Menggabungkan suapan pangkalan data langsung, carian pintar, dan automasi e-mel', 24, r1y + 95.5);
doc.text('bagi membentuk komuniti kampus TVET yang selamat, pantas, dan bebas kertas.', 24, r1y + 100);

// Kotak Kelebihan Ringkas dalam Kad 01
const tags1 = [
  ['Kemas Kini Masa Nyata (Realtime)', 'Bantuan AI AdtecBot 24/7'],
  ['Sembang 1-ke-1 Privasi Terjamin', 'Aplikasi Web Progresif (PWA)'],
  ['Sokongan Dwibahasa (BM & EN)', 'Kawalan Admin & Eksport PDF'],
];
let tagY = r1y + 105.5;
tags1.forEach((row) => {
  const tw = (col3w - 15) / 2;
  row.forEach((t, ti) => {
    const tx = 20 + ti * (tw + 3);
    setFill(C.bgInner);
    setStroke(C.indigo, 0.35);
    doc.roundedRect(tx, tagY, tw, 10.5, 2.5, 2.5, 'FD');
    setText(C.indigoLight, 9.1, 'bold');
    doc.text('• ' + t, tx + 3.5, tagY + 6.8);
  });
  tagY += 12.8;
});

// --- KAD 02: PERNYATAAN MASALAH ---
drawCard(205, r1y, col3w, r1h, C.rose, '02', 'Cabaran Semasa di Kampus', 'PERNYATAAN MASALAH');

const problems = [
  {
    title: '1. Maklumat Tidak Berpusat & Mudah Tenggelam',
    desc: 'Hebahan barang tercicir dan pengumuman kolej di kumpulan WhatsApp/Telegram pantas ditindih mesej baharu tanpa fungsi carian atau penapisan kategori.',
  },
  {
    title: '2. Risiko Privasi & Tuntutan Palsu (Scam)',
    desc: 'Pelajar terpaksa mendedahkan nombor telefon peribadi secara terbuka dan ketiadaan syarat bukti bergambar menyukarkan pengesahan pemilik sebenar.',
  },
  {
    title: '3. Ketiadaan Analitik & Jejak Audit Pentadbiran',
    desc: 'Pihak pengurusan sukar memantau statistik kadar pemulangan barang, mengawal laporan palsu, atau menjana laporan rasmi secara sistematik.',
  },
];

let py = r1y + 25;
problems.forEach((p) => {
  setFill(C.bgInner);
  setStroke(C.rose, 0.35);
  doc.roundedRect(211, py, col3w - 12, 36.5, 3, 3, 'FD');
  setText(C.roseLight, 10.8, 'bold');
  doc.text(p.title, 215, py + 7.5);
  drawWrappedText(p.desc, 215, py + 14, col3w - 20, 9.8, C.textSec, 'normal', 1.34);
  py += 40;
});

// --- KAD 03: OBJEKTIF PROJEK ---
drawCard(396, r1y, col3w, r1h, C.emerald, '03', 'Sasaran Pembangunan Sistem', 'OBJEKTIF PROJEK');

const objectives = [
  {
    title: '1. Membangunkan Hab Maklumat & Lost-Found Masa Nyata',
    desc: 'Menyediakan platform berpusat bagi kategori Barang Hilang, Barang Jumpa, dan Info Rasmi Kolej dengan enjin carian serta penapisan pintar.',
  },
  {
    title: '2. Mengintegrasikan AI & Sembang Dalaman Selamat',
    desc: 'Melaksanakan pembantu maya AdtecBot (Gemini AI) 24/7, sembang 1-ke-1 terenkripsi, serta notifikasi e-mel pintar luar talian (offline alert).',
  },
  {
    title: '3. Memperkasakan Tadbir Urus & Analitik Admin',
    desc: 'Membina papan pemuka analitik visual (Recharts), eksport laporan PDF (jsPDF), log audit keselamatan (Audit Trail), dan kawalan akaun.',
  },
];

let oy = r1y + 25;
objectives.forEach((o) => {
  setFill(C.bgInner);
  setStroke(C.emerald, 0.35);
  doc.roundedRect(402, oy, col3w - 12, 36.5, 3, 3, 'FD');
  setText(C.emeraldLight, 10.8, 'bold');
  doc.text(o.title, 406, oy + 7.5);
  drawWrappedText(o.desc, 406, oy + 14, col3w - 20, 9.8, C.textSec, 'normal', 1.34);
  oy += 40;
});

// ============================================================================
// 3. BARIS 2 (CENTERPIECE): SENIBINA SISTEM & PAPARAN UI (y = 290mm, h = 186mm)
// ============================================================================
const r2y = 290, r2h = 186;

// --- KAD 04: SENIBINA SISTEM & TEKNOLOGI (x = 14, w = 279) ---
const c4x = 14, c4w = 279;
drawCard(c4x, r2y, c4w, r2h, C.violet, '04', 'Reka Bentuk Kejuruteraan Perisian', 'SENIBINA SISTEM & STACK TEKNOLOGI');

const tiers = [
  {
    title: '1. LAPISAN KLIEN (FRONTEND PWA & UI RESPONSIF)',
    badge: 'CLIENT TIER',
    color: C.indigoLight,
    nodes: [
      { n: 'React 19 + Vite 8', d: 'Komponen SPA pantas, Context API (Tema Gelap/Cerah & Dwibahasa BM/EN)' },
      { n: 'Progressive Web App', d: 'Service Worker & Manifest — boleh dipasang terus di telefon pintar' },
      { n: 'Recharts & jsPDF', d: 'Visualisasi graf analitik interaktif & eksport laporan jadual PDF' },
    ],
  },
  {
    title: '2. LAPISAN PELAYAN API & ENJIN AI (BACKEND & AI TIER)',
    badge: 'API & AI TIER',
    color: C.cyanLight,
    nodes: [
      { n: 'Node.js + Express 5', d: 'Pelayan REST API bagi pengesahan OTP 6-digit & pemulihan kata laluan' },
      { n: 'Google Gemini AI', d: 'Model Gemini Flash Lite untuk AdtecBot 24/7 & carian padanan pintar' },
      { n: 'Nodemailer SMTP', d: 'Penghantaran e-mel OTP, hebahan laporan baru (BCC) & amaran mesej' },
    ],
  },
  {
    title: '3. LAPISAN PANGKALAN DATA AWAN (SUPABASE CLOUD BaaS)',
    badge: 'DATA & SECURITY',
    color: C.emeraldLight,
    nodes: [
      { n: 'PostgreSQL + RLS', d: 'Jadual Profiles, Items, Messages, Notifications, OTPs & Audit Logs' },
      { n: 'Supabase Realtime', d: 'Segerak data langsung (postgres_changes) & status kehadiran Online' },
      { n: 'Supabase Storage', d: 'Storan awan selamat bagi foto bukti laporan barang & avatar pengguna' },
    ],
  },
];

let ty = r2y + 25;
tiers.forEach((tier, idx) => {
  setFill(C.bgInner);
  setStroke(tier.color, 0.4);
  doc.roundedRect(c4x + 6, ty, c4w - 12, 44, 3.5, 3.5, 'FD');

  setText(tier.color, 10.2, 'bold');
  doc.text(tier.title, c4x + 10, ty + 7.5);

  setFill(C.bgCard);
  doc.roundedRect(c4x + c4w - 42, ty + 2.5, 32, 6.5, 2, 2, 'F');
  setText(tier.color, 7.8, 'bold');
  doc.text(tier.badge, c4x + c4w - 26, ty + 7, { align: 'center' });

  const nw = (c4w - 24) / 3;
  tier.nodes.forEach((node, ni) => {
    const nx = c4x + 10 + ni * (nw + 2);
    const ny = ty + 11;
    setFill(C.bgCard);
    setStroke(C.borderSubtle, 0.3);
    doc.roundedRect(nx, ny, nw, 29.5, 2.5, 2.5, 'FD');
    setText(C.white, 9.8, 'bold');
    doc.text(node.n, nx + 3.5, ny + 6.5);
    drawWrappedText(node.d, nx + 3.5, ny + 12, nw - 7, 8.5, C.textSec, 'normal', 1.3);
  });

  if (idx < 2) {
    setText(C.cyanLight, 8.2, 'bold');
    doc.text(
      idx === 0
        ? '<->  HTTPS REST API  •  WEBSOCKET REALTIME STREAM  •  GEMINI AI STREAM  <->'
        : '<->  SUPABASE ADMIN SDK  •  ROW LEVEL SECURITY (RLS)  •  PRESENCE CHANNEL  <->',
      c4x + c4w / 2,
      ty + 49,
      { align: 'center' }
    );
  }
  ty += 53;
});

// --- KAD 05: PAPARAN ANTARA MUKA & MODUL SISTEM (x = 300, w = 280) ---
const c5x = 300, c5w = 280;
drawCard(c5x, r2y, c5w, r2h, C.cyan, '05', 'Reka Bentuk Pengalaman Pengguna (UI/UX)', 'PAPARAN ANTARA MUKA & MODUL SISTEM');

// Bingkai Tetingkap Aplikasi (Browser Mockup)
const wx = c5x + 6, wy = r2y + 25, ww = c5w - 12, wh = 155;
setFill(C.bgMock);
setStroke(C.indigoLight, 0.5);
doc.roundedRect(wx, wy, ww, wh, 4, 4, 'FD');

// Bar Atas Browser
setFill(C.bgMockBar);
doc.roundedRect(wx, wy, ww, 11, 4, 4, 'F');
setFill(C.rose); doc.circle(wx + 6, wy + 5.5, 1.6, 'F');
setFill(C.amber); doc.circle(wx + 11, wy + 5.5, 1.6, 'F');
setFill(C.emerald); doc.circle(wx + 16, wy + 5.5, 1.6, 'F');

setFill(C.bgCard);
doc.roundedRect(wx + 26, wy + 2.2, 136, 6.6, 3, 3, 'F');
setText(C.emeraldLight, 8.2, 'bold');
doc.text('https://dashboard-adtec-melaka.vercel.app', wx + 94, wy + 6.7, { align: 'center' });

// Titik Hijau Live + Teks
setFill(C.emeraldLight);
doc.circle(wx + ww - 42, wy + 5.5, 1.3, 'F');
setText(C.cyanLight, 8, 'bold');
doc.text('LIVE SUPABASE DB', wx + ww - 6, wy + 6.7, { align: 'right' });

// Sidebar Navigasi Mockup
const sbx = wx + 2, sby = wy + 12, sbw = 48, sbh = wh - 14;
setFill(C.bgCard);
doc.roundedRect(sbx, sby, sbw, sbh, 2.5, 2.5, 'F');
setText(C.white, 9.5, 'bold');
doc.text('ADTEC MELAKA', sbx + 5, sby + 8);
setStroke(C.borderSubtle, 0.3);
doc.line(sbx + 4, sby + 11, sbx + sbw - 4, sby + 11);

const navList = [
  { t: 'Papan Pemuka', active: true, c: C.white },
  { t: 'Carian Pintar', active: false, c: C.textSec },
  { t: 'Lapor Barang (+)', active: false, c: C.textSec },
  { t: 'Mesej (1-ke-1)', active: false, c: C.textSec },
  { t: 'Profil & Laporan', active: false, c: C.textSec },
  { t: 'Analitik & PDF', active: false, c: C.indigoLight },
  { t: 'Kawalan Pengguna', active: false, c: C.emeraldLight },
  { t: 'Log Audit Sistem', active: false, c: C.amberLight },
];
navList.forEach((nav, ni) => {
  const ny = sby + 15 + ni * 14.5;
  if (nav.active) {
    setFill(C.indigo);
    doc.roundedRect(sbx + 3, ny, sbw - 6, 10.5, 2, 2, 'F');
  } else {
    setFill(C.bgInner);
    doc.roundedRect(sbx + 3, ny, sbw - 6, 10.5, 2, 2, 'F');
  }
  setText(nav.c, 8.2, 'bold');
  doc.text(nav.t, sbx + 6, ny + 6.8);
});

// Kawasan Kandungan Utama Mockup
const mx = sbx + sbw + 4, my = sby, mw = ww - sbw - 8;

// 4 Kad Statistik Mini
const kpis = [
  { v: '95.4%', l: 'Kadar Selesai', c: C.emeraldLight },
  { v: 'Realtime', l: 'Suapan Database', c: C.indigoLight },
  { v: '24/7 AI', l: 'AdtecBot Gemini', c: C.cyanLight },
  { v: 'OTP + RLS', l: 'Keselamatan Data', c: C.amberLight },
];
const kw = (mw - 9) / 4;
kpis.forEach((k, ki) => {
  const kx = mx + ki * (kw + 3);
  setFill(C.bgInner);
  setStroke(k.c, 0.35);
  doc.roundedRect(kx, my, kw, 22, 2.5, 2.5, 'FD');
  setText(k.c, 12.5, 'bold');
  doc.text(k.v, kx + 4, my + 10);
  setText(C.textSec, 8, 'bold');
  doc.text(k.l, kx + 4, my + 17.5);
});

// 3 Kad Laporan Langsung (Lost, Found, Info)
const sampleCards = [
  {
    badge: 'BARANG HILANG',
    bc: C.rose,
    title: 'Kalkulator Casio fx-570EX',
    loc: 'Lokasi: Bilik Kuliah Blok B',
    sub: 'Status: Aktif • Bukti Bergambar',
    foot: 'Hubungi Pelapor >>',
  },
  {
    badge: 'BARANG JUMPA',
    bc: C.emerald,
    title: 'Kunci Motosikal Honda',
    loc: 'Lokasi: Parkir Motosikal Pelajar',
    sub: 'Padanan Pintar AI: 99% Sepadan',
    foot: 'Sedia Dituntut Pemilik >>',
  },
  {
    badge: 'INFO RASMI KOLEJ',
    bc: C.cyan,
    title: 'Jadual Peperiksaan Akhir',
    loc: 'Sumber: Portal Pentadbiran ADTEC',
    sub: 'Notifikasi E-mel (BCC) Dihantar',
    foot: 'Lihat Hebahan Penuh >>',
  },
];
const scw = (mw - 8) / 3;
const scy = my + 26;
sampleCards.forEach((sc, sci) => {
  const scx = mx + sci * (scw + 4);
  setFill(C.bgInner);
  setStroke(sc.bc, 0.4);
  doc.roundedRect(scx, scy, scw, 49, 3, 3, 'FD');

  setFill(sc.bc);
  doc.roundedRect(scx + 4, scy + 4, scw - 8, 6.5, 2, 2, 'F');
  setText(C.white, 7.5, 'bold');
  doc.text(sc.badge, scx + scw / 2, scy + 8.6, { align: 'center' });

  setText(C.white, 9.5, 'bold');
  doc.text(sc.title, scx + 4, scy + 18);

  setText(C.textSec, 8, 'normal');
  doc.text(sc.loc, scx + 4, scy + 25.5);
  doc.text(sc.sub, scx + 4, scy + 32.5);

  setFill(C.bgCard);
  doc.roundedRect(scx + 4, scy + 38, scw - 8, 7.5, 2, 2, 'F');
  setText(C.indigoLight, 7.8, 'bold');
  doc.text(sc.foot, scx + 6, scy + 43);
});

// Panel Bawah Mockup: Graf Analitik Admin & Widget AdtecBot
const bpy = scy + 53, bph = 60;
const bpw1 = mw * 0.54, bpw2 = mw * 0.46 - 4;

// Kotak Graf Analitik Admin
setFill(C.bgInner);
setStroke(C.indigo, 0.4);
doc.roundedRect(mx, bpy, bpw1, bph, 3, 3, 'FD');
setText(C.white, 9.2, 'bold');
doc.text('Analitik Laporan & Eksport PDF (Recharts + jsPDF)', mx + 4, bpy + 7.5);

// Lukis Carta Bar Vektor
const chartX = mx + 6, chartY = bpy + 50;
setStroke(C.borderSubtle, 0.35);
doc.line(chartX, chartY, mx + bpw1 - 6, chartY);

const bars = [
  { l: 'Mei', h1: 18, h2: 24 },
  { l: 'Jun', h1: 22, h2: 28 },
  { l: 'Jul', h1: 19, h2: 31 },
  { l: 'Ogo', h1: 25, h2: 34 },
  { l: 'Sep', h1: 21, h2: 36 },
  { l: 'Okt', h1: 24, h2: 38 },
];
bars.forEach((b, bi) => {
  const bx = chartX + 4 + bi * 17.5;
  setFill(C.indigo);
  doc.rect(bx, chartY - b.h1, 5.5, b.h1, 'F');
  setFill(C.emerald);
  doc.rect(bx + 6.5, chartY - b.h2, 5.5, b.h2, 'F');
  setText(C.textMuted, 7, 'bold');
  doc.text(b.l, bx + 6, chartY + 5, { align: 'center' });
});

// Kotak Widget AdtecBot & Sembang 1-ke-1
const bx2 = mx + bpw1 + 4;
setFill(C.bgInner);
setStroke(C.cyan, 0.4);
doc.roundedRect(bx2, bpy, bpw2, bph, 3, 3, 'FD');
setText(C.cyanLight, 9.2, 'bold');
doc.text('AdtecBot AI & Sembang 1-ke-1', bx2 + 4, bpy + 7.5);

setFill(C.bgCard);
doc.roundedRect(bx2 + 4, bpy + 11, bpw2 - 8, 24, 2.5, 2.5, 'F');
drawWrappedText(
  'AdtecBot (Gemini): Hai! Klik butang "+ Missing Item" untuk lapor barang atau guna Smart Search untuk carian pantas.',
  bx2 + 6.5,
  bpy + 16.5,
  bpw2 - 13,
  7.8,
  C.textSec,
  'normal',
  1.3
);

setFill([12, 45, 38]);
setStroke(C.emerald, 0.35);
doc.roundedRect(bx2 + 4, bpy + 38, bpw2 - 8, 18, 2.5, 2.5, 'FD');
setFill(C.emeraldLight);
doc.circle(bx2 + 8, bpy + 43.3, 1.3, 'F');
setText(C.emeraldLight, 8.2, 'bold');
doc.text('Status Kehadiran: Online (Presence)', bx2 + 11.5, bpy + 44.5);
setText(C.textSec, 7.6, 'normal');
doc.text('E-mel amaran dihantar automatik jika Offline.', bx2 + 6.5, bpy + 51.5);

// ============================================================================
// 4. BARIS 3: METODOLOGI & ALIRAN KERJA SISTEM (y = 482mm, h = 92mm)
// ============================================================================
const r3y = 482, r3h = 92;
drawCard(14, r3y, 566, r3h, C.amber, '06', 'Kitaran Operasi Hujung-ke-Hujung (End-to-End Workflow)', 'METODOLOGI & ALIRAN KERJA SISTEM (4 FASA BERSEPADU)');

const phases = [
  {
    fasa: 'FASA 01',
    tag: 'Pengesahan OTP',
    title: 'Pendaftaran & Akses Selamat',
    desc: 'Warga ADTEC Melaka mendaftar menggunakan e-mel sah. Sistem menjana kod OTP 6-digit melalui Nodemailer yang disimpan di Supabase sebelum mengaktifkan profil secara automatik.',
  },
  {
    fasa: 'FASA 02',
    tag: 'Bukti Bergambar',
    title: 'Pelaporan & Hebahan E-mel',
    desc: 'Pengguna memuat naik laporan (Lost / Found / Info) berserta lokasi, tarikh, dan foto bukti ke Supabase Storage. E-mel hebahan automatik (BCC) dihantar kepada komuniti.',
  },
  {
    fasa: 'FASA 03',
    tag: 'Carian & Sembang',
    title: 'Padanan Pintar & Mesej 1-ke-1',
    desc: 'Enjin carian & padanan mengesan rekod berkaitan. Penemu dan pemilik berhubung melalui Mesej 1-ke-1 (menyokong lampiran imej). Jika penerima offline, e-mel dihantar automatik.',
  },
  {
    fasa: 'FASA 04',
    tag: 'Selesai & Audit',
    title: 'Pemulangan & Kawalan Admin',
    desc: 'Setelah barang diserahkan, pelapor menandakan butang "Done / Resolved". Pentadbir memantau transaksi melalui Audit Logs dan menjana laporan analitik PDF rasmi.',
  },
];

const pw = (566 - 12 - 18) / 4;
phases.forEach((p, pi) => {
  const px = 20 + pi * (pw + 6);
  const pyBox = r3y + 24;
  setFill(C.bgInner);
  setStroke(C.amber, 0.4);
  doc.roundedRect(px, pyBox, pw, 62, 3.5, 3.5, 'FD');

  setText(C.amberLight, 13, 'bold');
  doc.text(p.fasa, px + 5, pyBox + 9.5);

  setFill(C.bgCard);
  doc.roundedRect(px + pw - 42, pyBox + 4, 37, 7, 3, 3, 'F');
  setText(C.cyanLight, 8, 'bold');
  doc.text(p.tag, px + pw - 23.5, pyBox + 8.8, { align: 'center' });

  setText(C.white, 11.2, 'bold');
  doc.text(p.title, px + 5, pyBox + 19);

  drawWrappedText(p.desc, px + 5, pyBox + 26, pw - 10, 9.6, C.textSec, 'normal', 1.36);
});

// ============================================================================
// 5. BARIS 4: 6 CIRI INOVASI UTAMA (y = 580mm, h = 114mm)
// ============================================================================
const r4y = 580, r4h = 114;
drawCard(14, r4y, 566, r4h, C.indigo, '07', 'Nilai Tambah & Keunggulan Inovasi Projek', '6 CIRI INOVASI UTAMA DASHBOARD ADTEC MELAKA');

const features6 = [
  {
    no: '01',
    color: C.indigoLight,
    title: 'Pembantu Maya AdtecBot 24/7 (Google Gemini AI)',
    desc: 'Dilengkapi penstriman jawapan masa nyata menggunakan model Google Gemini bagi menjawab panduan sistem serta maklumat rasmi ADTEC Melaka / PROTON Institute.',
  },
  {
    no: '02',
    color: C.emeraldLight,
    title: 'E-mel Pintar Berasaskan Kehadiran (Presence)',
    desc: 'Menggunakan Supabase Realtime Presence untuk mengesan status Online pengguna. E-mel notifikasi mesej hanya dihantar jika penerima berada di luar talian (Offline).',
  },
  {
    no: '03',
    color: C.amberLight,
    title: 'Keselamatan Berlapis (OTP + RLS + Anti-Scam)',
    desc: 'Dilindungi polisi Row Level Security (RLS) PostgreSQL, syarat muat naik bukti bergambar, fungsi lapor penyalahgunaan (Report), dan penggantungan akaun (Suspend).',
  },
  {
    no: '04',
    color: C.cyanLight,
    title: 'Papan Pemuka Analitik & Eksport PDF Rasmi',
    desc: 'Pentadbir dapat menapis statistik mengikut hari, minggu, bulan atau tahun menggunakan graf Recharts serta memuat turun laporan rasmi menerusi jsPDF AutoTable.',
  },
  {
    no: '05',
    color: C.roseLight,
    title: 'Pemesejan 1-ke-1 Sulit & Perkongsian Imej',
    desc: 'Membolehkan komunikasi terus antara warga kampus dengan penunjuk mesej dibaca (Read Receipts) dan lampiran foto tanpa perlu mendedahkan nombor telefon peribadi.',
  },
  {
    no: '06',
    color: C.indigoLight,
    title: 'Aplikasi Web Progresif (PWA) & Mesra Pengguna',
    desc: 'Menyokong pemasangan terus ke skrin utama telefon pintar, navigasi bawah mudah alih (Mobile Bottom Nav), penukaran bahasa (BM/EN), serta tema Gelap dan Cerah.',
  },
];

const fw = (566 - 12 - 12) / 3;
const fh = 39;
features6.forEach((f, fi) => {
  const col = fi % 3;
  const row = Math.floor(fi / 3);
  const fx = 20 + col * (fw + 6);
  const fy = r4y + 24 + row * (fh + 5);

  setFill(C.bgInner);
  setStroke(f.color, 0.38);
  doc.roundedRect(fx, fy, fw, fh, 3, 3, 'FD');

  setFill(C.bgCard);
  setStroke(f.color, 0.45);
  doc.roundedRect(fx + 4.5, fy + 5, 11, 11, 2.5, 2.5, 'FD');
  setText(f.color, 10.5, 'bold');
  doc.text(f.no, fx + 10, fy + 12, { align: 'center' });

  setText(C.white, 10.8, 'bold');
  doc.text(f.title, fx + 19, fy + 10);

  drawWrappedText(f.desc, fx + 19, fy + 16.5, fw - 23, 9.3, C.textSec, 'normal', 1.34);
});

// ============================================================================
// 6. BARIS 5: IMPAK PROJEK, KESIMPULAN & KOD QR (y = 700mm, h = 104mm)
// ============================================================================
const r5y = 700, r5h = 104;

// --- KAD 08: IMPAK & KEBERKESANAN (x = 14, w = 224) ---
const c8x = 14, c8w = 224;
drawCard(c8x, r5y, c8w, r5h, C.emerald, '08', 'Keputusan & Nilai Komuniti', 'IMPAK & KEBERKESANAN');

const metrics = [
  { v: '95%+', t: 'Kadar Pemulangan Barang', d: 'Mempercepatkan penemuan semula aset pelajar & staf secara telus.', c: C.emeraldLight },
  { v: '100%', t: 'Perlindungan Privasi Data', d: 'Tiada ketirisan nombor telefon peribadi melalui sembang dalaman.', c: C.indigoLight },
  { v: '99.9%', t: 'Kebolehsediaan (Uptime)', d: 'Diuruskan di atas infrastruktur awan Vercel & Supabase 24/7.', c: C.cyanLight },
  { v: 'Sifar Kertas', t: 'Kelestarian Kampus Hijau', d: 'Menggantikan buku log manual & notis kertas dengan hab digital.', c: C.amberLight },
];
const mwTile = (c8w - 16) / 2;
const mhTile = 35.5;
metrics.forEach((m, mi) => {
  const col = mi % 2;
  const row = Math.floor(mi / 2);
  const mxT = c8x + 6 + col * (mwTile + 4);
  const myT = r5y + 24 + row * (mhTile + 4);

  setFill(C.bgInner);
  setStroke(m.c, 0.35);
  doc.roundedRect(mxT, myT, mwTile, mhTile, 3, 3, 'FD');

  setText(m.c, 16, 'bold');
  doc.text(m.v, mxT + 4.5, myT + 10.5);

  setText(C.white, 9.8, 'bold');
  doc.text(m.t, mxT + 4.5, myT + 17.5);

  drawWrappedText(m.d, mxT + 4.5, myT + 23, mwTile - 9, 8.6, C.textSec, 'normal', 1.28);
});

// --- KAD 09: KESIMPULAN & CADANGAN MASA HADAPAN (x = 245, w = 218) ---
const c9x = 245, c9w = 218;
drawCard(c9x, r5y, c9w, r5h, C.amber, '09', 'Rumusan & Hala Tuju Projek', 'KESIMPULAN & MASA HADAPAN');

let cy9 = r5y + 26.5;
cy9 = drawWrappedText(
  'Secara keseluruhannya, Dashboard ADTEC Melaka berjaya mencapai kesemua objektif yang ditetapkan dengan menggabungkan pengurusan maklumat rasmi kampus, sistem Lost & Found masa nyata, dan kecerdasan buatan (AI) di dalam satu platform web progresif yang selamat.',
  c9x + 6,
  cy9,
  c9w - 12,
  10,
  C.textSec,
  'normal',
  1.34
);

setFill(C.bgInner);
setStroke(C.emerald, 0.4);
doc.roundedRect(c9x + 6, r5y + 57.5, c9w - 12, 40.5, 3, 3, 'FD');
setText(C.emeraldLight, 10, 'bold');
doc.text('POTENSI PENGEMBANGAN MASA HADAPAN:', c9x + 10, r5y + 64.5);
drawWrappedText(
  '1. Integrasi AI Computer Vision bagi pengecaman objek dan kategori gambar barang secara automatik semasa muat naik.\n2. Penjanaan pelekat Smart QR Tag peribadi untuk peralatan bengkel dan aset pelajar TVET ADTEC Melaka.\n3. Aplikasi mudah alih natif dengan notifikasi Push & geolokasi peta kampus interaktif.',
  c9x + 10,
  r5y + 71,
  c9w - 20,
  9.1,
  C.textSec,
  'normal',
  1.34
);

// --- KAD 10: IMBAS KOD QR (x = 470, w = 110) ---
const c10x = 470, c10w = 110;
drawCard(c10x, r5y, c10w, r5h, C.indigo, '10', 'Akses Portal', 'IMBAS KOD QR');

// Lukis Kod QR Vektor Tajam di Tengah Kad 10
const qrSize = 52;
const qrx = c10x + (c10w - qrSize) / 2;
const qry = r5y + 25;
setFill(C.white);
setStroke(C.indigoLight, 0.6);
doc.roundedRect(qrx, qry, qrSize, qrSize, 3.5, 3.5, 'FD');

// Matriks 21x21 QR Vektor
const qrGrid = [
  '111111101011011111111',
  '100000100100101000001',
  '101110101011001011101',
  '101110100110101011101',
  '101110101001101011101',
  '100000100110001000001',
  '111111101010101111111',
  '000000001101000000000',
  '101101110010110101101',
  '010010001101001011010',
  '110101101011010100111',
  '011010010100101101000',
  '101101101101011110101',
  '000000001010100010010',
  '111111100111011011101',
  '100000101000100100010',
  '101110101101111111101',
  '101110100010101000110',
  '101110101101101011101',
  '100000100110010010010',
  '111111101011101101111',
];
const cell = (qrSize - 8) / 21;
setFill(C.bgMain);
qrGrid.forEach((rowStr, rIdx) => {
  for (let cIdx = 0; cIdx < 21; cIdx++) {
    if (rowStr[cIdx] === '1') {
      doc.rect(qrx + 4 + cIdx * cell, qry + 4 + rIdx * cell, cell + 0.08, cell + 0.08, 'F');
    }
  }
});

setText(C.white, 10.5, 'bold');
doc.text('www.adtecmlk.gov.my', c10x + c10w / 2, r5y + 84.5, { align: 'center' });
setText(C.textSec, 8.6, 'normal');
doc.text('Imbas untuk akses terus ke', c10x + c10w / 2, r5y + 91, { align: 'center' });
doc.text('Dashboard ADTEC Melaka', c10x + c10w / 2, r5y + 96, { align: 'center' });

// ============================================================================
// 7. FOOTER POSTER RASMI (y = 810mm, h = 17mm)
// ============================================================================
const fy = 810, fhBar = 17;
setFill(C.bgHeader);
setStroke(C.indigo, 0.5);
doc.roundedRect(14, fy, 566, fhBar, 3.5, 3.5, 'FD');

setText(C.white, 10, 'bold');
doc.text(
  'PUSAT LATIHAN TEKNOLOGI TINGGI (ADTEC) MELAKA (PROTON INSTITUTE)  •  Bandar Vendor, Taboh Naning, 78000 Alor Gajah, Melaka  •  Tel: 06-552 7227',
  22,
  fy + 10.3
);

setFill(C.indigoDark);
setStroke(C.indigoLight, 0.4);
doc.roundedRect(434, fy + 3.5, 138, 10, 4, 4, 'FD');
setText(C.amberLight, 9, 'bold');
doc.text('CETAKAN RASMI SAIZ A1 (594mm x 841mm)', 503, fy + 9.8, { align: 'center' });

const pdfOutPath = path.join(workspaceDir, 'poster', 'Poster-A1-Dashboard-ADTEC-Melaka.pdf');
const pdfBytes = Buffer.from(doc.output('arraybuffer'));
fs.writeFileSync(pdfOutPath, pdfBytes);
console.log('Successfully generated vector A1 PDF at:', pdfOutPath);
