import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');

const bannerLogoBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'official_banner_logos.jpg'));
const bannerLogoBase64 = `data:image/jpeg;base64,${bannerLogoBuffer.toString('base64')}`;

// Tangkapan skrin sebenar sistem web (Dashboard & Lost/Found)
const webPreviewBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'dashboard_preview.png'));
const webPreviewBase64 = `data:image/png;base64,${webPreviewBuffer.toString('base64')}`;

// Gambar rasmi ketiga-tiga ahli kumpulan
const member1Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member1.jpg'));
const member1Base64 = `data:image/jpeg;base64,${member1Buffer.toString('base64')}`;

const member2Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member2.jpg'));
const member2Base64 = `data:image/jpeg;base64,${member2Buffer.toString('base64')}`;

const member3Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member3.jpg'));
const member3Base64 = `data:image/jpeg;base64,${member3Buffer.toString('base64')}`;

const projectUrl = 'https://dashboard-information-nu.vercel.app';
const rawQrSvg = await QRCode.toString(projectUrl, {
  type: 'svg',
  margin: 1,
  color: { dark: '#0F172A', light: '#FFFFFF' },
  errorCorrectionLevel: 'M',
});
const qrSvg = rawQrSvg.replace(/<svg\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg"[^>]*>/, '<svg id="qrSvg" width="240" height="240" viewBox="0 0 31 31" shape-rendering="crispEdges">');

const htmlContent = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Poster Pameran A1 — Dashboard ADTEC Melaka</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@600;700&display=swap" rel="stylesheet">
  <style>
    /* ==========================================================================
       KONFIGURASI CETAKAN A1 SEBENAR (594mm x 841mm - PORTRAIT)
       ========================================================================== */
    @page {
      size: 594mm 841mm;
      margin: 0mm;
    }

    :root {
      --poster-w: 2245px;
      --poster-h: 3178px;

      /* Palet Warna Minimalis & Eksklusif (Tema Gelap) */
      --bg-base: #060913;
      --bg-canvas: #090e1d;
      --bg-card: rgba(15, 23, 42, 0.88);
      --bg-card-inner: rgba(30, 41, 59, 0.7);
      --border-card: rgba(99, 102, 241, 0.28);
      --border-subtle: rgba(255, 255, 255, 0.1);

      --text-main: #f8fafc;
      --text-sub: #cbd5e1;
      --text-muted: #94a3b8;

      --primary: #6366f1;
      --primary-glow: rgba(99, 102, 241, 0.25);
      --cyan: #38bdf8;
      --emerald: #10b981;
      --rose: #f43f5e;
      --amber: #f59e0b;
    }

    [data-poster-theme="light"] {
      --bg-base: #e2e8f0;
      --bg-canvas: #f8fafc;
      --bg-card: #ffffff;
      --bg-card-inner: #f1f5f9;
      --border-card: rgba(99, 102, 241, 0.2);
      --border-subtle: rgba(0, 0, 0, 0.08);

      --text-main: #0f172a;
      --text-sub: #334155;
      --text-muted: #64748b;

      --primary-glow: rgba(99, 102, 241, 0.1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg-base);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* TOOLBAR INTERAKTIF */
    .preview-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      width: 100%;
      background: rgba(10, 15, 29, 0.94);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      padding: 12px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }

    .toolbar-group {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.06);
      padding: 4px 6px;
      border-radius: 10px;
    }

    .toolbar-btn {
      background: transparent;
      border: 1px solid transparent;
      color: #e2e8f0;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13.5px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .toolbar-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    .toolbar-btn.active {
      background: var(--primary);
      color: #ffffff;
    }

    .toolbar-btn-primary {
      background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .toolbar-btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
    }

    .toolbar-input {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #38bdf8;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13.5px;
      font-family: 'JetBrains Mono', monospace;
      width: 320px;
    }

    /* KANVAS POSTER SAIZ A1 (594mm x 841mm) */
    .poster-viewport {
      padding: 30px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      width: 100%;
    }

    .poster-scale-wrapper {
      transform-origin: top center;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
      border-radius: 8px;
    }

    .poster-canvas {
      width: var(--poster-w);
      height: var(--poster-h);
      background: var(--bg-canvas);
      position: relative;
      padding: 50px 65px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      box-sizing: border-box;
    }

    /* Radial Glow Accents (Latar Belakang Halus) */
    .poster-canvas::before {
      content: '';
      position: absolute;
      top: -200px;
      left: 15%;
      width: 900px;
      height: 900px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.16) 0%, transparent 70%);
      pointer-events: none;
    }

    .poster-canvas::after {
      content: '';
      position: absolute;
      bottom: -150px;
      right: 10%;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    /* BORDER FRAME MINIMALIS */
    .poster-border-frame {
      position: absolute;
      inset: 22px;
      border: 1.5px solid var(--border-card);
      border-radius: 24px;
      pointer-events: none;
    }

    /* ==========================================================================
       1. HEADER POSTER (LOGO RASMI + AHLI KUMPULAN BERGAMBAR & PENYELIA ATAS SEKALI)
       ========================================================================== */
    .header-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 28px;
      padding: 32px 42px;
      position: relative;
      box-shadow: 0 15px 35px rgba(0,0,0,0.25);
    }

    .header-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #38bdf8, #6366f1, #ec4899);
      border-radius: 28px 28px 0 0;
    }

    .header-logo-banner {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
    }

    .logo-banner-box {
      background: #ffffff;
      padding: 10px 40px;
      border-radius: 18px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(0,0,0,0.22);
    }

    .logo-banner-box img {
      height: 72px;
      width: auto;
      object-fit: contain;
      display: block;
    }

    .header-titles {
      text-align: center;
      width: 100%;
    }

    .inst-badge {
      display: inline-block;
      padding: 7px 22px;
      border-radius: 9999px;
      background: var(--bg-card-inner);
      border: 1px solid var(--border-card);
      color: var(--cyan);
      font-size: 21px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .poster-main-title {
      font-size: 72px;
      font-weight: 900;
      letter-spacing: -1.5px;
      line-height: 1.15;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 6px;
    }

    [data-poster-theme="light"] .poster-main-title {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .poster-subtitle {
      font-size: 27px;
      font-weight: 600;
      color: var(--text-sub);
    }

    /* AHLI KUMPULAN BERGAMBAR & PENYELIA (ATAS SEKALI) */
    .header-team-grid {
      display: grid;
      grid-template-columns: 2.15fr 1fr;
      gap: 18px;
      margin-top: 20px;
      padding-top: 18px;
      border-top: 1px solid var(--border-subtle);
      align-items: stretch;
    }

    .team-pill {
      background: var(--bg-card-inner);
      border: 1px solid var(--border-card);
      border-radius: 20px;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
    }

    .team-label {
      font-size: 16.5px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--cyan);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .members-cards-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }

    .member-profile-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 10px 12px;
    }

    .member-avatar {
      width: 66px;
      height: 82px;
      border-radius: 10px;
      overflow: hidden;
      border: 2px solid var(--cyan);
      box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      flex-shrink: 0;
      background: #0f172a;
    }

    .member-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: top center;
      display: block;
    }

    .member-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow: hidden;
    }

    .member-name {
      font-size: 16px;
      font-weight: 800;
      color: var(--text-main);
      line-height: 1.25;
      text-transform: uppercase;
    }

    .member-role {
      font-size: 14px;
      color: var(--cyan);
      font-weight: 600;
    }

    .team-pill-supervisor {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
    }

    .sup-block {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .sup-name {
      font-size: 21px;
      font-weight: 800;
      color: var(--text-main);
    }

    .sup-role {
      font-size: 15.5px;
      color: var(--text-muted);
    }

    .sup-divider {
      height: 1px;
      background: var(--border-subtle);
      margin: 2px 0;
    }

    /* ==========================================================================
       2. SEKSYEN KANDUNGAN UTAMA
       ========================================================================== */
    .content-body {
      display: flex;
      flex-direction: column;
      gap: 26px;
      margin: 24px 0;
      flex: 1;
      justify-content: space-between;
    }

    /* BARIS 1: MASALAH VS PENYELESAIAN (2 KAD SEIMBANG) */
    .row-two-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 26px;
    }

    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 26px;
      padding: 28px 34px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.2);
      display: flex;
      flex-direction: column;
    }

    .card-header-simple {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .badge-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      flex-shrink: 0;
    }

    .badge-icon.problem {
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.4);
      color: var(--rose);
    }

    .badge-icon.solution {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: var(--emerald);
    }

    .card-title-text {
      font-size: 29px;
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .point-list-simple {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-size: 21.5px;
      line-height: 1.5;
      color: var(--text-sub);
    }

    .point-list-simple li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .bullet-tag {
      font-weight: 800;
      font-size: 21px;
      padding-top: 1px;
      flex-shrink: 0;
    }

    .bullet-tag.red { color: var(--rose); }
    .bullet-tag.green { color: var(--emerald); }

    /* BARIS 2: 3 CIRI UTAMA (KIRI) + GAMBAR WEBSITE PROJEK (KANAN) */
    .row-features-and-preview {
      display: grid;
      grid-template-columns: 0.95fr 1.05fr;
      gap: 26px;
      align-items: stretch;
    }

    .features-stacked {
      display: flex;
      flex-direction: column;
      gap: 16px;
      justify-content: space-between;
    }

    .feature-item-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 20px;
      padding: 22px 26px;
      display: flex;
      align-items: flex-start;
      gap: 18px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
    }

    .feature-icon-box {
      font-size: 34px;
      background: var(--bg-card-inner);
      width: 58px;
      height: 58px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-subtle);
      flex-shrink: 0;
    }

    .feature-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .feature-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .feature-title-text {
      font-size: 25px;
      font-weight: 800;
      color: var(--text-main);
    }

    .feature-tag {
      font-size: 14px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 6px;
      background: var(--bg-card-inner);
      border: 1px solid var(--border-subtle);
      color: var(--cyan);
    }

    .feature-desc-text {
      font-size: 20px;
      line-height: 1.5;
      color: var(--text-sub);
    }

    /* KAD GAMBAR WEBSITE PROJEK (MOCKUP BROWSER SEBENAR) */
    .browser-mockup-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 24px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 16px 40px rgba(0,0,0,0.28);
      position: relative;
    }

    .browser-top-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(15, 23, 42, 0.95);
      padding: 10px 16px;
      border-radius: 16px 16px 0 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-bottom: none;
    }

    .window-dots {
      display: flex;
      gap: 8px;
    }

    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot.red { background: #ef4444; }
    .dot.yellow { background: #f59e0b; }
    .dot.green { background: #10b981; }

    .browser-url-pill {
      background: rgba(30, 41, 59, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 10px;
      padding: 6px 16px;
      font-size: 16.5px;
      font-family: 'JetBrains Mono', monospace;
      color: var(--cyan);
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .browser-content {
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0 0 18px 18px;
      overflow: hidden;
      background: #0b1120;
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
    }

    .browser-content img {
      width: 100%;
      height: 360px;
      display: block;
      object-fit: cover;
      object-position: top center;
    }

    .mockup-caption-bar {
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
      color: var(--text-muted);
      padding: 0 4px;
    }

    .mockup-caption-bar strong {
      color: var(--text-main);
    }

    /* BARIS 3: HERO SCAN QR CODE & KELEBIHAN SISTEM */
    .row-bottom-hero {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 26px;
    }

    .metrics-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 26px;
      padding: 28px 34px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .metrics-title {
      font-size: 27px;
      font-weight: 800;
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stats-2x2-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .stat-tile {
      background: var(--bg-card-inner);
      border: 1px solid var(--border-subtle);
      border-radius: 18px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .stat-highlight {
      font-size: 26px;
      font-weight: 900;
      color: var(--cyan);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stat-heading {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-main);
    }

    .stat-text {
      font-size: 17.5px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* KAD HERO KOD QR (BESAR & SANGAT MUDAH DIIMBAS) */
    .qr-hero-card {
      background: linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%);
      border: 2px solid var(--primary);
      border-radius: 26px;
      padding: 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-shadow: 0 16px 40px var(--primary-glow);
      position: relative;
    }

    .qr-hero-card::before {
      content: 'IMBAS UNTUK UJI PORTAL';
      position: absolute;
      top: -15px;
      background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
      color: #ffffff;
      padding: 7px 22px;
      border-radius: 9999px;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 1.2px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.5);
    }

    .qr-white-frame {
      background: #ffffff;
      padding: 16px;
      border-radius: 22px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.3);
      margin: 10px 0 14px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .qr-url-badge {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid var(--cyan);
      border-radius: 12px;
      padding: 8px 18px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 20px;
      font-weight: 700;
      color: var(--cyan);
      margin-bottom: 8px;
    }

    .qr-instruction {
      font-size: 21.5px;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 5px;
    }

    .qr-subtext {
      font-size: 17px;
      color: var(--text-muted);
    }

    /* ==========================================================================
       3. FOOTER POSTER (MINIMALIS & PROFESIONAL)
       ========================================================================== */
    .footer-bar {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 18px;
      padding: 18px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
      color: var(--text-muted);
      text-align: center;
    }

    .footer-bar strong {
      color: var(--text-main);
    }

    /* PRINT RULES */
    @media print {
      .preview-toolbar { display: none !important; }
      body { background: transparent !important; }
      .poster-viewport { padding: 0 !important; }
      .poster-scale-wrapper {
        transform: scale(1) !important;
        box-shadow: none !important;
      }
      .poster-canvas {
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body data-poster-theme="dark">

  <!-- TOOLBAR INTERAKTIF -->
  <div class="preview-toolbar">
    <div class="toolbar-group">
      <button class="toolbar-btn active" id="btnFit" onclick="setZoom('fit')">Muat Skrin (Fit)</button>
      <button class="toolbar-btn" id="btn50" onclick="setZoom(0.5)">Zoom 50%</button>
      <button class="toolbar-btn" id="btn100" onclick="setZoom(1)">100% (Saiz Sebenar A1)</button>
    </div>

    <div class="toolbar-group">
      <button class="toolbar-btn" id="btnEdit" onclick="toggleEditMode()">✏️ Sunting Teks</button>
      <button class="toolbar-btn" id="btnTheme" onclick="togglePosterTheme()">🌗 Gelap / Cerah</button>
    </div>

    <div class="toolbar-group">
      <input type="text" id="qrUrlInput" class="toolbar-input" value="${projectUrl}" placeholder="Masukkan URL QR Code..." oninput="updateQrText(this.value)" />
    </div>

    <button class="toolbar-btn toolbar-btn-primary" onclick="window.print()">
      🖨️ Cetak / Simpan PDF (A1)
    </button>
    <a href="Poster-A1-Dashboard-ADTEC-Melaka.pdf" download="Poster-A1-Dashboard-ADTEC-Melaka.pdf" class="toolbar-btn toolbar-btn-primary" style="text-decoration:none; background:linear-gradient(135deg, #059669 0%, #10B981 100%);">
      ⬇️ Muat Turun PDF Vektor
    </a>
  </div>

  <!-- KANVAS POSTER SAIZ A1 (594mm x 841mm) -->
  <div class="poster-viewport">
    <div class="poster-scale-wrapper" id="scaleWrapper">
      <main class="poster-canvas" id="posterCanvas">
        <div class="poster-border-frame"></div>

        <!-- ==============================================================
             1. HEADER: LOGO RASMI + AHLI KUMPULAN BERGAMBAR & PENYELIA ATAS SEKALI
             ============================================================== -->
        <header class="header-card">
          <div class="header-logo-banner">
            <div class="logo-banner-box">
              <img src="${bannerLogoBase64}" alt="Logo Rasmi JTM, Jata Negara & PROTON Institute" />
            </div>
          </div>

          <div class="header-titles">
            <div class="inst-badge">Pusat Latihan Teknologi Tinggi (ADTEC) Melaka</div>
            <h1 class="poster-main-title">DASHBOARD ADTEC MELAKA</h1>
            <p class="poster-subtitle">Hab Maklumat Digital &amp; Sistem Lost &amp; Found Pintar Berasaskan AI</p>
          </div>

          <!-- AHLI KUMPULAN BERGAMBAR & PENYELIA (ATAS SEKALI) -->
          <div class="header-team-grid">
            <!-- KAD AHLI KUMPULAN BERSERTA GAMBAR -->
            <div class="team-pill">
              <span class="team-label">👥 Ahli Kumpulan Projek</span>
              <div class="members-cards-row">
                <!-- Ahli 1 -->
                <div class="member-profile-card">
                  <div class="member-avatar">
                    <img src="${member1Base64}" alt="MUHAMMAD ADAM DARWISH" />
                  </div>
                  <div class="member-meta">
                    <span class="member-name" contenteditable="false">MUHAMMAD ADAM DARWISH BIN NOR HAIDIL</span>
                    <span class="member-role">Pelajar TVET</span>
                  </div>
                </div>

                <!-- Ahli 2 -->
                <div class="member-profile-card">
                  <div class="member-avatar">
                    <img src="${member2Base64}" alt="HAZIM AFIQ" />
                  </div>
                  <div class="member-meta">
                    <span class="member-name" contenteditable="false">HAZIM AFIQ BIN RAZALI</span>
                    <span class="member-role">Pelajar TVET</span>
                  </div>
                </div>

                <!-- Ahli 3 -->
                <div class="member-profile-card">
                  <div class="member-avatar">
                    <img src="${member3Base64}" alt="MUHAMMAD SYAHMI" />
                  </div>
                  <div class="member-meta">
                    <span class="member-name" contenteditable="false">MUHAMMAD SYAHMI BIN YAZMIN</span>
                    <span class="member-role">Pelajar TVET</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- KAD PENYELIA & INSTITUSI -->
            <div class="team-pill team-pill-supervisor">
              <div class="sup-block">
                <span class="team-label">🎓 Penyelia Projek</span>
                <span class="sup-name" contenteditable="false">Encik Nik Mohd Fairus Bin Ismail</span>
                <span class="sup-role">Pensyarah Pembimbing ADTEC Melaka</span>
              </div>
              <div class="sup-divider"></div>
              <div class="sup-block">
                <span class="team-label">🏛️ Institusi &amp; Sesi</span>
                <span class="sup-name">ADTEC Melaka</span>
                <span class="sup-role">Inovasi Digital TVET • Sesi 2026</span>
              </div>
            </div>
          </div>
        </header>

        <!-- ==============================================================
             2. KANDUNGAN UTAMA (RINGKAS, PADAT, MENARIK, MUDAH DIBACA)
             ============================================================== -->
        <div class="content-body">

          <!-- BARIS 1: MASALAH VS PENYELESAIAN (2 KAD SEIMBANG) -->
          <div class="row-two-cards">
            <!-- KAD 1: CABARAN -->
            <div class="card">
              <div class="card-header-simple">
                <div class="badge-icon problem">⚠️</div>
                <h2 class="card-title-text" style="color:var(--rose);">Cabaran &amp; Isu Semasa</h2>
              </div>
              <ul class="point-list-simple">
                <li>
                  <span class="bullet-tag red">✖</span>
                  <span><strong>Hebahan Terlepas Pandang:</strong> Maklumat rasmi di WhatsApp cepat tenggelam dan poster kertas mudah koyak/hilang.</span>
                </li>
                <li>
                  <span class="bullet-tag red">✖</span>
                  <span><strong>Keciciran Barang Sukar Dijejak:</strong> Tiada saluran berpusat untuk menjejak barang hilang atau mengesahkan pemilik sebenar.</span>
                </li>
                <li>
                  <span class="bullet-tag red">✖</span>
                  <span><strong>Ketirisan Privasi:</strong> Berkongsi nombor telefon peribadi secara terbuka di grup awam mendedahkan pelajar kepada risiko keselamatan.</span>
                </li>
              </ul>
            </div>

            <!-- KAD 2: PENYELESAIAN -->
            <div class="card">
              <div class="card-header-simple">
                <div class="badge-icon solution">💡</div>
                <h2 class="card-title-text" style="color:var(--emerald);">Penyelesaian Digital Pintar</h2>
              </div>
              <ul class="point-list-simple">
                <li>
                  <span class="bullet-tag green">✔</span>
                  <span><strong>Hab Digital Berpusat:</strong> Pengumuman rasmi diurus secara sistematik dengan paparan skrin TV kiosk &amp; akses telefon.</span>
                </li>
                <li>
                  <span class="bullet-tag green">✔</span>
                  <span><strong>Lost &amp; Found Masa Nyata:</strong> Lapor dan semak status barangan tercicir berserta foto, tarikh &amp; lokasi penemuan serta-merta.</span>
                </li>
                <li>
                  <span class="bullet-tag green">✔</span>
                  <span><strong>Sembang Selamat &amp; Tertutup:</strong> Komunikasi terus dalam portal tanpa perlu berkongsi nombor telefon peribadi.</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- BARIS 2: 3 CIRI UTAMA SISTEM (KIRI) + GAMBAR WEBSITE PROJEK (KANAN) -->
          <div class="row-features-and-preview">
            <!-- 3 CIRI UTAMA -->
            <div class="features-stacked">
              <!-- CIRI 1 -->
              <div class="feature-item-card">
                <div class="feature-icon-box">📢</div>
                <div class="feature-info">
                  <div class="feature-title-row">
                    <h3 class="feature-title-text">Pusat Maklumat Kampus</h3>
                    <span class="feature-tag">TV Kiosk &amp; Web</span>
                  </div>
                  <p class="feature-desc-text">
                    Hebahan rasmi aktiviti kolej, notis pentadbiran dan acara penting terus ke peranti warga kolej serta paparan skrin TV Kiosk kampus.
                  </p>
                </div>
              </div>

              <!-- CIRI 2 -->
              <div class="feature-item-card">
                <div class="feature-icon-box">🔍</div>
                <div class="feature-info">
                  <div class="feature-title-row">
                    <h3 class="feature-title-text">Lost &amp; Found Pintar</h3>
                    <span class="feature-tag">Realtime Database</span>
                  </div>
                  <p class="feature-desc-text">
                    Carian pantas barang tercicir mengikut kategori &amp; lokasi, rekod bukti penemuan teratur, dan sembang pengesahan pemilik selamat.
                  </p>
                </div>
              </div>

              <!-- CIRI 3 -->
              <div class="feature-item-card">
                <div class="feature-icon-box">🤖</div>
                <div class="feature-info">
                  <div class="feature-title-row">
                    <h3 class="feature-title-text">AdtecBot AI (Gemini)</h3>
                    <span class="feature-tag">Kecerdasan Buatan 24/7</span>
                  </div>
                  <p class="feature-desc-text">
                    Pembantu maya pintar berasaskan Google Gemini yang sedia membantu menjawab sebarang pertanyaan seputar sistem &amp; panduan kampus.
                  </p>
                </div>
              </div>
            </div>

            <!-- GAMBAR SEBENAR WEBSITE PROJEK (BONUS) -->
            <div class="browser-mockup-card">
              <div class="browser-top-bar">
                <div class="window-dots">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
                <div class="browser-url-pill">
                  <span>🔒</span>
                  <span>https://dashboard-information-nu.vercel.app</span>
                </div>
              </div>
              <div class="browser-content">
                <img src="${webPreviewBase64}" alt="Paparan Antaramuka Laman Web Dashboard ADTEC Melaka" />
              </div>
              <div class="mockup-caption-bar">
                <span>🖥️ <strong>Paparan Antaramuka Sebenar Sistem</strong></span>
                <span>✨ Akses Responsif Web &amp; PWA</span>
              </div>
            </div>
          </div>

          <!-- BARIS 3: KELEBIHAN TEKNOLOGI & HERO SCAN KOD QR -->
          <div class="row-bottom-hero">
            <!-- 4 METRIK KELEBIHAN -->
            <div class="metrics-card">
              <h3 class="metrics-title">
                <span>🚀 Kelebihan Utama &amp; Nilai Tambah</span>
              </h3>
              <div class="stats-2x2-grid">
                <div class="stat-tile">
                  <div class="stat-highlight">⚡ 100% Realtime</div>
                  <div class="stat-heading">Pangkalan Data Awan</div>
                  <div class="stat-text">Dikuasakan Supabase PostgreSQL &amp; WebSockets untuk kemas kini data secara langsung.</div>
                </div>
                <div class="stat-tile">
                  <div class="stat-highlight">🛡️ Kawalan Selamat</div>
                  <div class="stat-heading">Peranan &amp; Privasi</div>
                  <div class="stat-text">Pengesahan OTP e-mel rasmi dan keselamatan RLS melindungi maklumat pelajar.</div>
                </div>
                <div class="stat-tile">
                  <div class="stat-highlight">📱 Mesra Semua Skrin</div>
                  <div class="stat-heading">Sokongan PWA</div>
                  <div class="stat-text">Boleh dipasang pada telefon pintar (Android/iOS) dan dibuka di mana-mana pelayar.</div>
                </div>
                <div class="stat-tile">
                  <div class="stat-highlight">🌿 Kampus Hijau</div>
                  <div class="stat-heading">Sifar Kertas Notis</div>
                  <div class="stat-text">Menggantikan buku log manual dan mengurangkan pembaziran kertas buangan.</div>
                </div>
              </div>
            </div>

            <!-- HERO SCAN TO TRY (KOD QR BESAR & JELAS) -->
            <div class="qr-hero-card">
              <div class="qr-white-frame" id="qrContainer">
                ${qrSvg}
              </div>
              <div class="qr-url-badge" id="qrLabelUrl">dashboard-information-nu.vercel.app</div>
              <div class="qr-instruction">Halakan Kamera Telefon Anda Untuk Uji Sistem</div>
              <div class="qr-subtext">Akses serta-merta tanpa perlu pasang aplikasi luaran</div>
            </div>
          </div>

        </div>

        <!-- ==============================================================
             3. FOOTER POSTER
             ============================================================== -->
        <footer class="footer-bar">
          <div>
            <strong>Pusat Latihan Teknologi Tinggi (ADTEC) Melaka (PROTON Institute)</strong> • Bandar Vendor, Taboh Naning, 78000 Alor Gajah, Melaka • Tel: 06-552 7227
          </div>
        </footer>

      </main>
    </div>
  </div>

  <script>
    const POSTER_W = 2245;
    const POSTER_H = 3178;
    let currentZoomMode = 'fit';
    let isEditing = false;

    function applyScale(scale) {
      const wrapper = document.getElementById('scaleWrapper');
      wrapper.style.transform = 'scale(' + scale + ')';
    }

    function setZoom(mode) {
      currentZoomMode = mode;
      document.querySelectorAll('#btnFit, #btn50, #btn100').forEach(b => b.classList.remove('active'));
      if (mode === 'fit') {
        document.getElementById('btnFit').classList.add('active');
        const availW = window.innerWidth - 60;
        const availH = window.innerHeight - 100;
        const scale = Math.min(availW / POSTER_W, availH / POSTER_H, 1);
        applyScale(Math.max(scale, 0.18));
      } else {
        if (mode === 0.5) document.getElementById('btn50').classList.add('active');
        if (mode === 1) document.getElementById('btn100').classList.add('active');
        applyScale(mode);
      }
    }

    function toggleEditMode() {
      isEditing = !isEditing;
      document.body.classList.toggle('editing-active', isEditing);
      const btn = document.getElementById('btnEdit');
      btn.classList.toggle('active', isEditing);
      btn.textContent = isEditing ? '✅ Selesai Sunting' : '✏️ Sunting Teks';

      const editableSelectors = [
        '.inst-badge', '.poster-main-title', '.poster-subtitle',
        '.member-name', '.sup-name', '.card-title-text', '.point-list-simple',
        '.feature-title-text', '.feature-desc-text', '.stat-highlight', '.stat-heading', '.stat-text', '.footer-bar'
      ];
      editableSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.setAttribute('contenteditable', isEditing ? 'true' : 'false');
        });
      });
    }

    function togglePosterTheme() {
      const current = document.body.getAttribute('data-poster-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-poster-theme', next);
    }

    function updateQrText(val) {
      const clean = (val || 'dashboard-information-nu.vercel.app').replace(/^https?:\\/\\//, '').replace(/\\/+$/, '');
      document.getElementById('qrLabelUrl').textContent = clean;
    }

    window.addEventListener('resize', () => {
      if (currentZoomMode === 'fit') setZoom('fit');
    });

    window.addEventListener('beforeprint', () => {
      applyScale(1);
    });

    window.addEventListener('afterprint', () => {
      setZoom(currentZoomMode);
    });

    setZoom('fit');
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(workspaceDir, 'poster', 'poster-a1.html'), htmlContent, 'utf8');
console.log('Successfully generated clean, minimalist poster/poster-a1.html with 3 Member Photos!');
