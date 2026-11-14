import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');

// Baca aset gambar
const bannerLogoBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'official_banner_logos.jpg'));
const bannerLogoBase64 = `data:image/jpeg;base64,${bannerLogoBuffer.toString('base64')}`;

const member1Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member1.jpg'));
const member1Base64 = `data:image/jpeg;base64,${member1Buffer.toString('base64')}`;

const member2Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member2.jpg'));
const member2Base64 = `data:image/jpeg;base64,${member2Buffer.toString('base64')}`;

const member3Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member3.jpg'));
const member3Base64 = `data:image/jpeg;base64,${member3Buffer.toString('base64')}`;

const previewBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'dashboard_preview.png'));
const previewBase64 = `data:image/png;base64,${previewBuffer.toString('base64')}`;

const qrBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'qr-code.png'));
const qrBase64 = `data:image/png;base64,${qrBuffer.toString('base64')}`;

const html = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Studio Video CIFPEC 2026 — Dashboard ADTEC Melaka</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #070a13;
      --card-bg: rgba(15, 23, 42, 0.92);
      --card-inner: rgba(30, 41, 59, 0.7);
      --border: rgba(99, 102, 241, 0.28);
      --border-subtle: rgba(255, 255, 255, 0.08);
      --text: #f8fafc;
      --text-sub: #cbd5e1;
      --text-muted: #94a3b8;
      --primary: #6366f1;
      --cyan: #38bdf8;
      --emerald: #10b981;
      --rose: #f43f5e;
      --amber: #f59e0b;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* HEADER & TAB BAR */
    header.studio-header {
      background: rgba(15, 23, 42, 0.95);
      border-bottom: 1px solid var(--border);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(12px);
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-badge {
      background: linear-gradient(135deg, #4f46e5, #06b6d4);
      color: #fff;
      font-weight: 800;
      font-size: 11px;
      padding: 4px 10px;
      border-radius: 999px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }
    .brand-title {
      font-size: 16px;
      font-weight: 800;
      color: var(--text);
    }
    .tabs-nav {
      display: flex;
      gap: 8px;
      background: rgba(30, 41, 59, 0.6);
      padding: 4px;
      border-radius: 12px;
      border: 1px solid var(--border-subtle);
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 8px 18px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .tab-btn:hover {
      color: var(--text);
      background: rgba(255, 255, 255, 0.05);
    }
    .tab-btn.active {
      background: var(--primary);
      color: #fff;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .action-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-subtle);
      color: var(--text);
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: 0.2s;
    }
    .action-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: var(--cyan);
    }
    .action-btn.primary {
      background: linear-gradient(135deg, #4f46e5, #0ea5e9);
      border: none;
      color: white;
    }

    /* VIEW CONTAINER */
    .view-content {
      display: none;
      flex: 1;
      width: 100%;
    }
    .view-content.active {
      display: flex;
      flex-direction: column;
    }

    /* ==============================================================
       1. MOD PERSEMBAHAN SLAID VIDEO 16:9 (CINEMATIC SLIDES)
       ============================================================== */
    .slides-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: radial-gradient(circle at 50% 30%, rgba(30, 41, 59, 0.35) 0%, rgba(7, 10, 19, 0.95) 100%);
    }

    /* 16:9 CINEMA FRAME */
    .cinema-frame {
      width: 100%;
      max-width: 1200px;
      aspect-ratio: 16 / 9;
      background: #090e1d;
      border: 2px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 25px 60px rgba(0,0,0,0.6), 0 0 50px rgba(99, 102, 241, 0.15);
      display: flex;
      flex-direction: column;
    }

    .slide {
      display: none;
      width: 100%;
      height: 100%;
      padding: 40px 50px;
      flex-direction: column;
      justify-content: space-between;
      animation: fadeIn 0.4s ease-in-out;
      position: relative;
      background-size: cover;
      background-position: center;
    }
    .slide.active {
      display: flex;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.985); }
      to { opacity: 1; transform: scale(1); }
    }

    /* SLIDE CONTROLS */
    .slides-controls-bar {
      margin-top: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid var(--border-subtle);
      padding: 10px 24px;
      border-radius: 999px;
      backdrop-filter: blur(10px);
    }
    .ctrl-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid var(--border-subtle);
      color: #fff;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: 0.2s;
    }
    .ctrl-btn:hover {
      background: var(--primary);
    }
    .slide-counter {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      color: var(--cyan);
      min-width: 80px;
      text-align: center;
    }
    .speaker-indicator {
      font-size: 12px;
      font-weight: 700;
      color: var(--amber);
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 4px 12px;
      border-radius: 999px;
    }

    /* SLIDE COMPONENTS */
    .slide-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .slide-tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.35);
      border-radius: 999px;
      color: var(--cyan);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .slide-inst-logos {
      height: 38px;
      border-radius: 6px;
      background: #fff;
      padding: 4px 10px;
    }
    .slide-inst-logos img {
      height: 100%;
      object-fit: contain;
    }

    /* SLIDE 1: INTRO */
    .slide-1-content {
      text-align: center;
      margin: auto 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .s1-title {
      font-size: 46px;
      font-weight: 900;
      letter-spacing: -1px;
      line-height: 1.15;
      background: linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .s1-sub {
      font-size: 20px;
      color: var(--cyan);
      font-weight: 600;
      max-width: 800px;
    }
    .s1-badges {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }
    .badge-pill {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid var(--border);
      padding: 8px 18px;
      border-radius: 999px;
      font-size: 14px;
      font-weight: 700;
      color: var(--text-sub);
    }

    /* SLIDE 2: MEMBERS */
    .s2-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr) 1.2fr;
      gap: 16px;
      margin: auto 0;
    }
    .member-card-slide {
      background: var(--card-inner);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 10px;
    }
    .member-avatar-slide {
      width: 90px;
      height: 110px;
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid var(--cyan);
    }
    .member-avatar-slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .m-name {
      font-size: 14px;
      font-weight: 800;
      color: #fff;
      line-height: 1.2;
    }
    .m-ndp {
      font-size: 13px;
      color: var(--amber);
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
    }
    .m-role {
      font-size: 12px;
      color: var(--cyan);
    }
    .sup-card-slide {
      background: linear-gradient(145deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
      border: 1.5px solid var(--primary);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
    }

    /* SLIDE 3: PROBLEM STATEMENT */
    .s3-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: auto 0;
    }
    .prob-box {
      background: rgba(244, 63, 94, 0.08);
      border: 1px solid rgba(244, 63, 94, 0.3);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
    }
    .prob-icon {
      font-size: 28px;
      background: rgba(244, 63, 94, 0.2);
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* SLIDE 4: ARCHITECTURE & TECH STACK */
    .s4-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin: auto 0;
    }
    .tech-box {
      background: var(--card-inner);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .tech-box span.t-icon {
      font-size: 32px;
    }
    .tech-box h4 {
      font-size: 16px;
      font-weight: 800;
      color: var(--text);
    }
    .tech-box p {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    /* SLIDE 5, 6, 7: DEMOS */
    .demo-split-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 24px;
      align-items: center;
      margin: auto 0;
    }
    .demo-img-box {
      border-radius: 14px;
      overflow: hidden;
      border: 2px solid var(--border);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .demo-img-box img {
      width: 100%;
      height: auto;
      display: block;
    }
    .demo-points-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .demo-point-item {
      background: var(--card-inner);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 14px 16px;
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .demo-point-item .dp-icon {
      font-size: 24px;
      flex-shrink: 0;
    }
    .dp-text h4 {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
    }
    .dp-text p {
      font-size: 13px;
      color: var(--text-muted);
    }

    /* SLIDE 8: 4 KEY METRICS */
    .s8-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: auto 0;
    }
    .stat-card-slide {
      background: var(--card-inner);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .sc-highlight {
      font-size: 20px;
      font-weight: 800;
      color: var(--cyan);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sc-title {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }
    .sc-desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.4;
    }

    /* SLIDE 9: IMPACT & REPLICATION */
    .s9-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: auto 0;
    }
    .impact-box {
      background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
      border: 1.5px solid var(--emerald);
      border-radius: 18px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .impact-stat {
      font-size: 38px;
      font-weight: 900;
      color: var(--emerald);
    }

    /* SLIDE 10: QR & CONCLUSION */
    .s10-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 24px;
      align-items: center;
      margin: auto 0;
    }
    .qr-slide-card {
      background: #fff;
      padding: 16px;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    .qr-slide-card img {
      width: 180px;
      height: 180px;
      object-fit: contain;
    }
    .qr-slide-url {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      background: #e2e8f0;
      padding: 4px 10px;
      border-radius: 6px;
    }

    /* ==============================================================
       2. MOD TELEPROMPTER SKRIP RAKAM SUARA
       ============================================================== */
    .teleprompter-view {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #000;
      color: #fff;
      position: relative;
    }
    .tp-controls {
      background: rgba(20, 20, 25, 0.95);
      border-bottom: 1px solid #333;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 57px;
      z-index: 100;
    }
    .tp-speaker-filters {
      display: flex;
      gap: 8px;
    }
    .tp-filter-btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: #cbd5e1;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }
    .tp-filter-btn.active {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }
    .tp-sliders {
      display: flex;
      align-items: center;
      gap: 20px;
      font-size: 13px;
      color: #94a3b8;
    }
    .tp-sliders label {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .tp-sliders input[type="range"] {
      width: 100px;
    }
    .tp-screen-box {
      flex: 1;
      padding: 60px 15% 300px 15%;
      overflow-y: auto;
      scroll-behavior: smooth;
      position: relative;
    }
    .tp-card-scene {
      margin-bottom: 50px;
      padding: 24px;
      border-radius: 16px;
      background: rgba(255,255,255,0.03);
      border-left: 4px solid #3b82f6;
      transition: all 0.3s ease;
    }
    .tp-card-scene.active-scene {
      background: rgba(99, 102, 241, 0.15);
      border-left-color: var(--cyan);
      box-shadow: 0 0 30px rgba(99, 102, 241, 0.2);
    }
    .tp-speaker-badge {
      display: inline-block;
      font-size: 14px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 6px;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-adam { background: #3b82f6; color: white; }
    .badge-hazim { background: #10b981; color: white; }
    .badge-syahmi { background: #f59e0b; color: #000; }
    .badge-semua { background: #ec4899; color: white; }

    .tp-dialogue {
      font-size: 32px;
      font-weight: 600;
      line-height: 1.6;
      color: #e2e8f0;
      margin-bottom: 12px;
    }
    .tp-visual-cue {
      font-size: 16px;
      color: #64748b;
      font-style: italic;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* ==============================================================
       3. MOD SENARAI SEMAK & PANDUAN CIFPEC (WALKTHROUGH)
       ============================================================== */
    .checklist-view {
      padding: 30px 40px;
      max-width: 1100px;
      margin: 0 auto;
      width: 100%;
    }
    .guide-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 24px;
    }
    .guide-title {
      font-size: 22px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .steps-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--card-inner);
      padding: 14px 18px;
      border-radius: 12px;
      border: 1px solid var(--border-subtle);
    }
    .step-num {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 800;
      flex-shrink: 0;
    }
    .step-content h4 {
      font-size: 15px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
    }
    .step-content p {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .shortcut-buttons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      margin-top: 16px;
    }
    .link-tile {
      background: rgba(30, 41, 59, 0.9);
      border: 1px solid var(--border);
      padding: 16px;
      border-radius: 12px;
      text-decoration: none;
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: 0.2s;
    }
    .link-tile:hover {
      border-color: var(--cyan);
      background: rgba(30, 41, 59, 1);
      transform: translateY(-2px);
    }
    .link-tile span.lt-title {
      font-weight: 800;
      font-size: 14px;
      color: var(--cyan);
    }
    .link-tile span.lt-desc {
      font-size: 12px;
      color: var(--text-muted);
    }

    /* FULLSCREEN CINEMA */
    :fullscreen .cinema-frame {
      max-width: 100vw;
      width: 100vw;
      height: 100vh;
      border-radius: 0;
      border: none;
    }
    :fullscreen .slides-controls-bar {
      position: fixed;
      bottom: 24px;
      z-index: 100;
      opacity: 0.15;
      transition: opacity 0.3s;
    }
    :fullscreen .slides-controls-bar:hover {
      opacity: 1;
    }
  </style>
</head>
<body>

  <!-- HEADER UTAMA -->
  <header class="studio-header">
    <div class="brand-group">
      <span class="brand-badge">CIFPEC 2026 • PTA 2</span>
      <h1 class="brand-title">Studio Video Inovasi — Dashboard ADTEC Melaka</h1>
    </div>

    <!-- TABS PINTAS -->
    <nav class="tabs-nav">
      <button class="tab-btn active" onclick="switchTab('slides')">📺 Slaid Video 16:9</button>
      <button class="tab-btn" onclick="switchTab('teleprompter')">📜 Teleprompter Skrip</button>
      <button class="tab-btn" onclick="switchTab('checklist')">✅ Senarai Semak &amp; Demo</button>
    </nav>

    <div class="header-actions">
      <a href="SKRIP-VIDEO-CIFPEC.md" target="_blank" class="action-btn">📄 Skrip Penuh (MD)</a>
      <button class="action-btn primary" onclick="toggleFullscreen()">⛶ Mod Skrin Penuh</button>
    </div>
  </header>

  <!-- ==============================================================
       1. VIEW: SLAID PERSEMBAHAN VIDEO 16:9
       ============================================================== -->
  <main class="view-content active" id="view-slides">
    <div class="slides-wrapper">
      <div class="cinema-frame" id="cinemaFrame">

        <!-- SLIDE 1: MONTAJ PEMBUKAAN -->
        <div class="slide active" id="slide-1">
          <div class="slide-header-row">
            <span class="slide-tag">CIFPEC 2026 • Kategori Inovasi Digital TVET</span>
            <div class="slide-inst-logos">
              <img src="${bannerLogoBase64}" alt="Logo Rasmi">
            </div>
          </div>
          <div class="slide-1-content">
            <h1 class="s1-title">DASHBOARD ADTEC MELAKA</h1>
            <p class="s1-sub">Hab Maklumat Digital &amp; Sistem Lost and Found Pintar Berasaskan Kecerdasan Buatan (AI)</p>
            <div class="s1-badges">
              <span class="badge-pill">🏛️ Pusat Latihan Teknologi Tinggi (ADTEC) Melaka</span>
              <span class="badge-pill">⚡ Projek Tahun Akhir 2 (PTA 2)</span>
            </div>
          </div>
          <div class="slide-header-row" style="color:var(--text-muted); font-size:13px;">
            <span>Sistem Live: <strong>dashboard-information-nu.vercel.app</strong></span>
            <span>Sesi 2026</span>
          </div>
        </div>

        <!-- SLIDE 2: AHLI KUMPULAN & PENYELIA -->
        <div class="slide" id="slide-2">
          <div class="slide-header-row">
            <span class="slide-tag">👥 Barisan Ahli Kumpulan &amp; Penyelia Projek</span>
            <div class="slide-inst-logos"><img src="${bannerLogoBase64}" alt="Logo"></div>
          </div>
          <div class="s2-grid">
            <!-- Ahli 1 -->
            <div class="member-card-slide">
              <div class="member-avatar-slide"><img src="${member1Base64}" alt="Adam Darwish"></div>
              <div class="m-name">MUHAMMAD ADAM DARWISH</div>
              <div class="m-ndp">NDP: 16126091</div>
              <div class="m-role">Ketua Projek / Konsep</div>
            </div>
            <!-- Ahli 2 -->
            <div class="member-card-slide">
              <div class="member-avatar-slide"><img src="${member2Base64}" alt="Hazim Afiq"></div>
              <div class="m-name">HAZIM AFIQ BIN RAZALI</div>
              <div class="m-ndp">NDP: 16126053</div>
              <div class="m-role">Arkitektur &amp; Pangkalan Data</div>
            </div>
            <!-- Ahli 3 -->
            <div class="member-card-slide">
              <div class="member-avatar-slide"><img src="${member3Base64}" alt="Muhammad Syahmi"></div>
              <div class="m-name">MUHAMMAD SYAHMI BIN YAZMIN</div>
              <div class="m-ndp">NDP: 16126004</div>
              <div class="m-role">Integrasi AI &amp; UI/UX</div>
            </div>
            <!-- Penyelia -->
            <div class="sup-card-slide">
              <span style="font-size:12px; color:var(--cyan); font-weight:700; text-transform:uppercase;">🎓 Pensyarah Pembimbing</span>
              <div style="font-size:18px; font-weight:800; color:#fff;">Encik Nik Mohd Fairus Bin Ismail</div>
              <p style="font-size:12px; color:var(--text-muted);">Pusat Latihan Teknologi Tinggi (ADTEC) Melaka • Institut Teknologi Automotif Termaju PROTON</p>
            </div>
          </div>
          <div style="font-size:13px; color:var(--cyan); font-weight:700;">Jabatan Tenaga Manusia (JTM) • Kementerian Sumber Manusia (KESUMA)</div>
        </div>

        <!-- SLIDE 3: ISU & CABARAN SEMASA -->
        <div class="slide" id="slide-3">
          <div class="slide-header-row">
            <span class="slide-tag" style="background:rgba(244,63,94,0.15); border-color:rgba(244,63,94,0.4); color:var(--rose);">⚠️ Pernyataan Masalah (Problem Statement)</span>
            <span style="color:var(--text-muted); font-size:13px;">Cabaran Komunikasi &amp; Kebajikan Kampus</span>
          </div>
          <div class="s3-grid">
            <div class="prob-box">
              <div class="prob-icon">📢</div>
              <div>
                <h3 style="font-size:17px; font-weight:800; color:var(--rose); margin-bottom:4px;">Hebahan Maklumat Terlepas Pandang</h3>
                <p style="font-size:13px; color:var(--text-sub); line-height:1.5;">Pengumuman rasmi di grup WhatsApp cepat tenggelam akibat ratusan mesej harian. Poster kertas fizikal di papan kenyataan mudah koyak dan usang.</p>
              </div>
            </div>
            <div class="prob-box">
              <div class="prob-icon">🔍</div>
              <div>
                <h3 style="font-size:17px; font-weight:800; color:var(--rose); margin-bottom:4px;">Keciciran Barangan Sukar Dijejak</h3>
                <p style="font-size:13px; color:var(--text-sub); line-height:1.5;">Kehilangan barang bernilai tinggi (kunci kenderaan, kad matrik, laptop) tiada saluran berpusat. Status tuntutan tidak teratur dan mengambil masa berminggu-minggu.</p>
              </div>
            </div>
            <div class="prob-box">
              <div class="prob-icon">🛡️</div>
              <div>
                <h3 style="font-size:17px; font-weight:800; color:var(--rose); margin-bottom:4px;">Ketirisan Privasi &amp; Risiko Penipuan</h3>
                <p style="font-size:13px; color:var(--text-sub); line-height:1.5;">Pelajar terpaksa berkongsi nombor telefon peribadi secara terbuka di grup awam untuk mencari pemilik, mendedahkan mereka kepada gangguan pihak tidak bertanggungjawab.</p>
              </div>
            </div>
            <div class="prob-box">
              <div class="prob-icon">📄</div>
              <div>
                <h3 style="font-size:17px; font-weight:800; color:var(--rose); margin-bottom:4px;">Pembaziran Kos &amp; Kertas</h3>
                <p style="font-size:13px; color:var(--text-sub); line-height:1.5;">Cetakan notis fizikal dan buku log manual membebankan kos pentadbiran dan bercanggah dengan prinsip kemampanan alam sekitar.</p>
              </div>
            </div>
          </div>
          <div style="font-size:13px; color:var(--rose); font-weight:700;">Sasaran Inovasi: Menyelesaikan 4 cabaran utama ini dengan teknologi web pintar berpusat.</div>
        </div>

        <!-- SLIDE 4: SENI BINA SISTEM -->
        <div class="slide" id="slide-4">
          <div class="slide-header-row">
            <span class="slide-tag">⚙️ Seni Bina Teknologi (System Architecture)</span>
            <span style="color:var(--text-muted); font-size:13px;">Stack Moden TVET Terkini</span>
          </div>
          <div class="s4-grid">
            <div class="tech-box">
              <span class="t-icon">⚛️</span>
              <h4>React 19 + Vite</h4>
              <p>Antaramuka web pantas, responsif, komponen modular, dan sokongan Progressive Web App (PWA).</p>
            </div>
            <div class="tech-box">
              <span class="t-icon">⚡</span>
              <h4>Supabase Realtime</h4>
              <p>Pangkalan data PostgreSQL masa nyata dengan WebSockets untuk kemas kini data tanpa refresh.</p>
            </div>
            <div class="tech-box">
              <span class="t-icon">🤖</span>
              <h4>Google Gemini AI</h4>
              <p>Enjin kecerdasan buatan untuk pembantu maya AdtecBot menjawab persoalan kampus 24/7.</p>
            </div>
            <div class="tech-box">
              <span class="t-icon">🛡️</span>
              <h4>Node.js + OTP &amp; RLS</h4>
              <p>Pengesahan e-mel rasmi berkeselamatan tinggi dan kawalan polisi Baris Data (Row Level Security).</p>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(30,41,59,0.5); padding:10px 18px; border-radius:10px;">
            <span style="font-size:13px; color:var(--cyan); font-weight:700;">Capai dari mana-mana: 📱 Telefon Bimbit • 💻 Komputer Riba • 📺 Kiosk TV Digital</span>
            <span style="font-size:12px; color:var(--text-muted);">Penyelarasan Data Bersepadu</span>
          </div>
        </div>

        <!-- SLIDE 5: DEMO 1 - PORTAL & KIOSK TV -->
        <div class="slide" id="slide-5">
          <div class="slide-header-row">
            <span class="slide-tag" style="background:rgba(16,185,129,0.15); border-color:rgba(16,185,129,0.4); color:var(--emerald);">🖥️ Demonstrasi Modul 1 &amp; 2</span>
            <span style="color:var(--text-muted); font-size:13px;">Pusat Maklumat Digital &amp; Mod Kiosk TV</span>
          </div>
          <div class="demo-split-grid">
            <div class="demo-img-box">
              <img src="${previewBase64}" alt="Paparan Sistem">
            </div>
            <div class="demo-points-list">
              <div class="demo-point-item">
                <span class="dp-icon">📢</span>
                <div class="dp-text">
                  <h4>Hebahan Rasmi Kampus</h4>
                  <p>Kategori berita kolej, aktiviti kelab, sukan, cuti dan notis penting dalam satu suapan teratur.</p>
                </div>
              </div>
              <div class="demo-point-item">
                <span class="dp-icon">📺</span>
                <div class="dp-text">
                  <h4>Mod Paparan Kiosk TV Kampus</h4>
                  <p>Paparan khusus Digital Signage di lobi dan kafeteria dengan jam masa nyata &amp; news ticker bergerak.</p>
                </div>
              </div>
              <div class="demo-point-item">
                <span class="dp-icon">🌓</span>
                <div class="dp-text">
                  <h4>Tema Mod Gelap &amp; Cerah</h4>
                  <p>Reka bentuk moden mesra mata dan menjimatkan penggunaan bateri pada peranti pelajar.</p>
                </div>
              </div>
            </div>
          </div>
          <div style="font-size:13px; color:var(--emerald); font-weight:700;">100% Responsif &amp; Kemas Kini Spontan Tanpa Menyegarkan Pelayar (No Refresh Needed)</div>
        </div>

        <!-- SLIDE 6: DEMO 2 - LOST & FOUND & SEMBANG PRIVASI -->
        <div class="slide" id="slide-6">
          <div class="slide-header-row">
            <span class="slide-tag" style="background:rgba(56,189,248,0.15); border-color:rgba(56,189,248,0.4); color:var(--cyan);">🔍 Demonstrasi Modul 3 &amp; 4</span>
            <span style="color:var(--text-muted); font-size:13px;">Lost &amp; Found Pintar &amp; In-App Chat Privasi</span>
          </div>
          <div class="demo-split-grid">
            <div class="demo-points-list">
              <div class="demo-point-item">
                <span class="dp-icon">📸</span>
                <div class="dp-text">
                  <h4>Laporan Segera Berserta Foto &amp; Lokasi</h4>
                  <p>Pelajar memuat naik bukti penemuan barangan, memilih lokasi spesifik (cth: Bengkel Automotif, Surau) &amp; kategori.</p>
                </div>
              </div>
              <div class="demo-point-item">
                <span class="dp-icon">⚡</span>
                <div class="dp-text">
                  <h4>Suapan Masa Nyata (Realtime Feed)</h4>
                  <p>Laporan barang tercicir muncul serta-merta pada papan pemuka semua pengguna secara langsung.</p>
                </div>
              </div>
              <div class="demo-point-item">
                <span class="dp-icon">💬</span>
                <div class="dp-text">
                  <h4>Sembang Sulit Terbina (In-App Messaging)</h4>
                  <p>Komunikasi pengesahan pemilik selamat secara langsung dalam web tanpa mendedahkan nombor WhatsApp.</p>
                </div>
              </div>
            </div>
            <div class="demo-img-box" style="background:#0f172a; padding:16px;">
              <div style="background:#1e293b; border-radius:10px; padding:12px; margin-bottom:10px;">
                <span style="font-size:11px; color:var(--emerald); font-weight:700;">● STATUS: BELUM DITUNTUT</span>
                <div style="font-size:14px; font-weight:800; color:#fff; margin:4px 0;">Kunci Motosikal Yamaha Y15ZR</div>
                <div style="font-size:12px; color:var(--text-muted);">📍 Lokasi: Hadapan Surau Utama • 14 Nov 2026</div>
              </div>
              <div style="background:#1e293b; border-radius:10px; padding:12px; border-left:3px solid var(--cyan);">
                <div style="font-size:12px; color:var(--cyan); font-weight:700;">🔒 Sembang Sulit Pengesahan Pemilik</div>
                <div style="font-size:13px; color:#fff; margin-top:4px;">"Salam bro, apa warna keychain kunci ni untuk sahkan pemilik sebenar?"</div>
              </div>
            </div>
          </div>
          <div style="font-size:13px; color:var(--cyan); font-weight:700;">Melindungi Data Peribadi Pelajar &amp; Mempercepatkan Kadar Pemulangan Barangan</div>
        </div>

        <!-- SLIDE 7: DEMO 3 - ADTECBOT AI GEMINI -->
        <div class="slide" id="slide-7">
          <div class="slide-header-row">
            <span class="slide-tag" style="background:rgba(99,102,241,0.15); border-color:rgba(99,102,241,0.4); color:#818cf8;">🤖 Demonstrasi Modul 5: AdtecBot AI</span>
            <span style="color:var(--text-muted); font-size:13px;">Kecerdasan Buatan Google Gemini</span>
          </div>
          <div class="demo-split-grid">
            <div class="demo-img-box" style="background:#0f172a; padding:20px;">
              <div style="display:flex; align-items:center; gap:10px; border-bottom:1px solid #334155; padding-bottom:10px; margin-bottom:12px;">
                <span style="font-size:24px;">🤖</span>
                <div>
                  <div style="font-size:14px; font-weight:800; color:#fff;">AdtecBot AI Assistant</div>
                  <div style="font-size:11px; color:var(--emerald);">● Aktif 24 Jam • Dikuasakan Google Gemini</div>
                </div>
              </div>
              <div style="display:flex; flex-direction:column; gap:10px; font-size:13px;">
                <div style="background:#334155; padding:8px 12px; border-radius:10px; align-self:flex-end; max-width:85%;">
                  "Bagaimana prosedur nak buat tuntutan kad matrik yang tercicir?"
                </div>
                <div style="background:rgba(99,102,241,0.25); border:1px solid rgba(99,102,241,0.4); padding:10px 14px; border-radius:10px; align-self:flex-start; max-width:90%; color:#e2e8f0; line-height:1.4;">
                  "Anda boleh semak tab Lost &amp; Found di dashboard. Klik pada laporan kad matrik berkenaan dan gunakan butang <strong>Sembang Sulit</strong> untuk berhubung terus dengan penemu barang tanpa mendedahkan nombor telefon anda."
                </div>
              </div>
            </div>
            <div class="demo-points-list">
              <div class="demo-point-item">
                <span class="dp-icon">💡</span>
                <div class="dp-text">
                  <h4>Panduan Kampus Interaktif</h4>
                  <p>Membantu pelajar baharu dan pelawat mendapatkan panduan pantas waktu operasi, lokasi bengkel &amp; tatatertib.</p>
                </div>
              </div>
              <div class="demo-point-item">
                <span class="dp-icon">🕒</span>
                <div class="dp-text">
                  <h4>Bantuan Tanpa Henti 24/7</h4>
                  <p>Menjawab pertanyaan di luar waktu pejabat secara spontan tanpa membebankan pegawai pentadbiran.</p>
                </div>
              </div>
              <div class="demo-point-item">
                <span class="dp-icon">🚀</span>
                <div class="dp-text">
                  <h4>Penyelesaian TVET Inovatif</h4>
                  <p>Membuktikan penerapan teknologi kecerdasan buatan terkini dalam projek tahun akhir TVET.</p>
                </div>
              </div>
            </div>
          </div>
          <div style="font-size:13px; color:var(--primary); font-weight:700;">Merapatkan Jurang Informasi Warga Kampus Melalui AI Pintar</div>
        </div>

        <!-- SLIDE 8: 4 NILAI TAMBAH INOVASI -->
        <div class="slide" id="slide-8">
          <div class="slide-header-row">
            <span class="slide-tag">💎 Kelebihan Utama &amp; Nilai Tambah Inovasi</span>
            <span style="color:var(--text-muted); font-size:13px;">Nilai Tambah Berbanding Kaedah Konvensional</span>
          </div>
          <div class="s8-grid">
            <div class="stat-card-slide">
              <div class="sc-highlight">⚡ 100% Realtime WebSockets</div>
              <div class="sc-title">Pangkalan Data Masa Nyata</div>
              <div class="sc-desc">Tiada lagi kelewatan penerimaan info. Setiap kemas kini hebahan dan laporan barang hilang dipaparkan secara langsung kepada semua pengguna.</div>
            </div>
            <div class="stat-card-slide">
              <div class="sc-highlight">🛡️ Keselamatan OTP &amp; RLS</div>
              <div class="sc-title">Perlindungan Data &amp; Privasi Terjamin</div>
              <div class="sc-desc">Sistem pengesahan emel rasmi mengelakkan akaun palsu, manakala Row Level Security menjamin data pelajar tidak dicerobohi.</div>
            </div>
            <div class="stat-card-slide">
              <div class="sc-highlight">📱 Sokongan PWA Fleksibel</div>
              <div class="sc-title">Boleh Dipasang Tanpa Muat Turun App Store</div>
              <div class="sc-desc">Aplikasi web progresif boleh dipasang terus pada telefon Android &amp; iOS seperti aplikasi natif, menjimatkan storan dan kos pembangunan.</div>
            </div>
            <div class="stat-card-slide">
              <div class="sc-highlight">🌿 Inisiatif Kampus Hijau</div>
              <div class="sc-title">Sifar Kertas Notis (Zero-Paper Policy)</div>
              <div class="sc-desc">Menghapuskan keperluan cetakan kertas notis dan poster fizikal, selaras dengan Matlamat Pembangunan Mampan (SDG 12 &amp; SDG 9).</div>
            </div>
          </div>
          <div style="font-size:13px; color:var(--cyan); font-weight:700;">Gabungan Kecekapan Operasi, Keselamatan Privasi, dan Kelestarian Alam Sekitar</div>
        </div>

        <!-- SLIDE 9: IMPAK & KEBOLEHPASARAN -->
        <div class="slide" id="slide-9">
          <div class="slide-header-row">
            <span class="slide-tag" style="background:rgba(16,185,129,0.15); border-color:rgba(16,185,129,0.4); color:var(--emerald);">📈 Impak, Kebolehpasaran &amp; Skalabiliti TVET</span>
            <span style="color:var(--text-muted); font-size:13px;">Potensi Masa Hadapan</span>
          </div>
          <div class="s9-grid">
            <div class="impact-box">
              <div class="impact-stat">90%</div>
              <div style="font-size:18px; font-weight:800; color:#fff;">Penjimatan Kos Kertas &amp; Percetakan</div>
              <p style="font-size:13px; color:var(--text-sub); line-height:1.5;">Pengurangan drastik pembaziran kertas notis di papan kenyataan kampus dan buku log manual pejabat pentadbiran.</p>
            </div>
            <div class="impact-box" style="border-color:var(--cyan);">
              <div class="impact-stat" style="color:var(--cyan);">3x Lebih Pantas</div>
              <div style="font-size:18px; font-weight:800; color:#fff;">Kadar Penemuan &amp; Tuntutan Barang</div>
              <p style="font-size:13px; color:var(--text-sub); line-height:1.5;">Memendekkan tempoh pengembalian barangan tercicir daripada berminggu-minggu kepada beberapa jam sahaja melalui sembang sulit.</p>
            </div>
          </div>
          <div style="background:rgba(30,41,59,0.7); border:1px solid var(--border); border-radius:12px; padding:12px 20px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:14px; font-weight:700; color:#fff;">🏫 Potensi Diperluas ke Kesemua 33 Institusi Latihan JTM (ILJTM) Seluruh Malaysia</span>
            <span style="font-size:12px; color:var(--cyan); font-weight:700;">Seni Bina Modular Siap Guna</span>
          </div>
        </div>

        <!-- SLIDE 10: PENUTUP & KOD QR LIVE -->
        <div class="slide" id="slide-10">
          <div class="slide-header-row">
            <span class="slide-tag">✨ Sesi Ujian Langsung &amp; Penutup</span>
            <div class="slide-inst-logos"><img src="${bannerLogoBase64}" alt="Logo"></div>
          </div>
          <div class="s10-grid">
            <div style="display:flex; flex-direction:column; gap:16px;">
              <h2 style="font-size:36px; font-weight:900; line-height:1.2; color:#fff;">Transformasi Kampus Pintar Bermula Di Sini</h2>
              <p style="font-size:15px; color:var(--text-sub); line-height:1.6;">
                Dashboard ADTEC Melaka membuktikan bahawa inovasi berasaskan teknologi web moden dan AI berupaya menyelesaikan masalah harian warga kampus dengan selamat, pantas dan mampan.
              </p>
              <div style="background:rgba(99,102,241,0.15); border:1.5px solid var(--primary); padding:12px 18px; border-radius:12px;">
                <div style="font-size:13px; color:var(--cyan); font-weight:800; margin-bottom:4px;">🔗 PAUTAN RASMI SISTEM:</div>
                <div style="font-family:'JetBrains Mono', monospace; font-size:16px; font-weight:700; color:#fff;">https://dashboard-information-nu.vercel.app</div>
              </div>
              <div style="font-size:14px; font-weight:800; color:var(--emerald);">
                Terima Kasih kepada Barisan Panel Penilai CIFPEC 2026 &amp; Warga ADTEC Melaka!
              </div>
            </div>
            <div class="qr-slide-card">
              <span style="font-size:13px; font-weight:800; color:#0f172a; text-transform:uppercase;">IMBAS UNTUK CUBA SISTEM</span>
              <img src="${qrBase64}" alt="QR Code Portal">
              <span class="qr-slide-url">dashboard-information-nu.vercel.app</span>
              <span style="font-size:11px; color:#64748b; text-align:center;">Halakan kamera telefon anda sekarang</span>
            </div>
          </div>
          <div style="font-size:12px; color:var(--text-muted); text-align:center;">
            Pusat Latihan Teknologi Tinggi (ADTEC) Melaka • Sesi 2026 • Inovasi TVET Malaysia
          </div>
        </div>

      </div>

      <!-- KAWALAN SLAID -->
      <div class="slides-controls-bar">
        <button class="ctrl-btn" onclick="prevSlide()">◀ Undur</button>
        <div class="slide-counter" id="slideCounter">Slaid 1 / 10</div>
        <button class="ctrl-btn" onclick="nextSlide()">Maju ▶</button>
        <span class="speaker-indicator" id="speakerIndicator">Pembicara: Adam Darwish</span>
        <button class="ctrl-btn" id="btnAutoPlay" onclick="toggleAutoPlay()">▶️ Auto-Play (8s)</button>
        <button class="ctrl-btn" onclick="toggleFullscreen()">⛶ Skrin Penuh</button>
      </div>
    </div>
  </main>

  <!-- ==============================================================
       2. VIEW: TELEPROMPTER SKRIP RAKAM SUARA
       ============================================================== -->
  <main class="view-content" id="view-teleprompter">
    <div class="teleprompter-view">
      <div class="tp-controls">
        <div class="tp-speaker-filters">
          <button class="tp-filter-btn active" onclick="filterSpeaker('all')">Semua Ahli</button>
          <button class="tp-filter-btn" onclick="filterSpeaker('adam')">Adam Darwish</button>
          <button class="tp-filter-btn" onclick="filterSpeaker('hazim')">Hazim Afiq</button>
          <button class="tp-filter-btn" onclick="filterSpeaker('syahmi')">Muhammad Syahmi</button>
        </div>

        <div style="display:flex; align-items:center; gap:12px;">
          <button class="ctrl-btn" id="btnTpPlay" onclick="toggleTeleprompter()" style="background:var(--emerald); border:none;">▶️ Mula Skrol</button>
          <button class="ctrl-btn" onclick="resetTeleprompter()">🔄 Reset Skrol</button>
          <span style="font-family:'JetBrains Mono',monospace; font-size:14px; color:var(--cyan); font-weight:700;" id="tpTimer">00:00</span>
        </div>

        <div class="tp-sliders">
          <label>
            Kelajuan:
            <input type="range" id="tpSpeed" min="1" max="10" value="3" oninput="updateSpeed(this.value)">
            <span id="speedVal">3x</span>
          </label>
          <label>
            Saiz Teks:
            <input type="range" id="tpSize" min="20" max="48" value="30" oninput="updateFontSize(this.value)">
            <span id="sizeVal">30px</span>
          </label>
        </div>
      </div>

      <div class="tp-screen-box" id="tpBox">

        <!-- BABAK 1 -->
        <div class="tp-card-scene" data-speaker="adam">
          <span class="tp-speaker-badge badge-adam">Adam Darwish (0:00 - 0:35)</span>
          <div class="tp-dialogue">
            "Assalamualaikum dan salam sejahtera kepada barisan panel penilai CIFPEC 2026. Kami dari ADTEC Melaka dengan bangganya mempersembahkan sebuah projek inovasi digital bertajuk <strong>Dashboard ADTEC Melaka — Hab Maklumat Digital dan Sistem Lost and Found Pintar Berasaskan AI</strong>."
          </div>
          <div class="tp-visual-cue">🎥 [Visual: Montaj pembukaan logo institusi, disusuli kamera memfokus ahli kumpulan kemas &amp; bersemangat]</div>
        </div>

        <div class="tp-card-scene" data-speaker="adam">
          <span class="tp-speaker-badge badge-adam">Adam Darwish (Sambungan)</span>
          <div class="tp-dialogue">
            "Projek ini dibangunkan khas di bawah Projek Tahun Akhir 2 (PTA 2) bagi mendigitalkan ekosistem komunikasi kampus serta menyelesaikan cabaran keciciran barangan pelajar secara efisien, pantas dan selamat."
          </div>
          <div class="tp-visual-cue">🎥 [Visual: Tunjuk sekilas pandang skrin telefon dan laptop memaparkan portal web]</div>
        </div>

        <!-- BABAK 2 -->
        <div class="tp-card-scene" data-speaker="hazim">
          <span class="tp-speaker-badge badge-hazim">Hazim Afiq (0:35 - 1:10)</span>
          <div class="tp-dialogue">
            "Di mana-mana institusi pengajian tinggi, hebahan notis fizikal di papan kenyataan sering terlepas pandang dan mencemarkan pemandangan. Manakala hebahan melalui aplikasi pesanan ringkas seperti WhatsApp pula cepat tenggelam akibat lambakan mesej harian."
          </div>
          <div class="tp-visual-cue">🎥 [Visual: B-Roll papan kenyataan penuh kertas koyak &amp; skrol tangkapan skrin group WhatsApp ratusan mesej]</div>
        </div>

        <div class="tp-card-scene" data-speaker="hazim">
          <span class="tp-speaker-badge badge-hazim">Hazim Afiq (Sambungan)</span>
          <div class="tp-dialogue">
            "Lebih kritikal lagi, isu keciciran barangan seperti kunci kenderaan, kad matrik dan komputer riba tiada platform berpusat untuk dijejak. Perkongsian nombor telefon peribadi secara terbuka di grup awam turut mendedahkan pelajar kepada risiko penipuan dan pencerobohan privasi."
          </div>
          <div class="tp-visual-cue">🎥 [Visual: Pelajar resah tercicir kunci kenderaan di bengkel &amp; grafik amaran keselamatan]</div>
        </div>

        <!-- BABAK 3 -->
        <div class="tp-card-scene" data-speaker="hazim">
          <span class="tp-speaker-badge badge-hazim">Hazim Afiq (1:10 - 1:35)</span>
          <div class="tp-dialogue">
            "Bagi mengatasi masalah ini, kami membina Dashboard ADTEC Melaka. Dibangunkan berasaskan teknologi web generasi terkini React 19 dengan sokongan pangkalan data awan Supabase WebSockets masa nyata, keselamatan pengesahan OTP dan sokongan Progressive Web App (PWA)."
          </div>
          <div class="tp-visual-cue">🎥 [Visual: Animasi grafik seni bina React, Supabase Realtime &amp; Google Gemini AI]</div>
        </div>

        <!-- BABAK 4 (DEMO) -->
        <div class="tp-card-scene" data-speaker="syahmi">
          <span class="tp-speaker-badge badge-syahmi">Muhammad Syahmi (1:35 - 2:05)</span>
          <div class="tp-dialogue">
            "Mari kita lihat demonstrasi sistem sebenar. Pengguna disambut dengan paparan utama yang memaparkan semua hebahan rasmi kolej mengikut kategori, aktiviti sukan, cuti umum, serta aktiviti kebajikan secara teratur dan berpusat."
          </div>
          <div class="tp-visual-cue">🎥 [Visual DEMO: Skrin merekod pelayaran laman utama Dashboard di komputer]</div>
        </div>

        <div class="tp-card-scene" data-speaker="syahmi">
          <span class="tp-speaker-badge badge-syahmi">Muhammad Syahmi (2:05 - 2:25)</span>
          <div class="tp-dialogue">
            "Sistem ini turut dilengkapi Mod Kiosk TV khusus untuk dipaparkan pada skrin televisyen di lobi kolej dan kafeteria. Data dikemas kini secara langsung tanpa perlu menyegarkan semula pelayar."
          </div>
          <div class="tp-visual-cue">🎥 [Visual DEMO: Mod TV Display skrin penuh dengan jam masa nyata dan auto-scroll news ticker]</div>
        </div>

        <div class="tp-card-scene" data-speaker="syahmi">
          <span class="tp-speaker-badge badge-syahmi">Muhammad Syahmi (2:25 - 2:50)</span>
          <div class="tp-dialogue">
            "Bagi modul Lost and Found Pintar, sekiranya seorang pelajar menjumpai barangan tercicir, mereka hanya perlu memuat naik gambar, memilih lokasi penemuan dan kategori. Laporan akan terus terpapar kepada seluruh warga kolej dalam masa nyata!"
          </div>
          <div class="tp-visual-cue">🎥 [Visual DEMO: Proses mengisi borang lapor barang &amp; kad muncul secara live di suapan]</div>
        </div>

        <div class="tp-card-scene" data-speaker="syahmi">
          <span class="tp-speaker-badge badge-syahmi">Muhammad Syahmi (2:50 - 3:05)</span>
          <div class="tp-dialogue">
            "Di sinilah keunikan inovasi kami! Pemilik barang boleh berhubung dengan penemu melalui sistem sembang dalaman secara selamat. Tiada lagi pendedahan nombor telefon peribadi, sekaligus menjamin privasi pelajar sepenuhnya."
          </div>
          <div class="tp-visual-cue">🎥 [Visual DEMO: Menekan butang 'Sembang Sulit' dan berbual di tetingkap mesej dalam web]</div>
        </div>

        <div class="tp-card-scene" data-speaker="syahmi">
          <span class="tp-speaker-badge badge-syahmi">Muhammad Syahmi (3:05 - 3:25)</span>
          <div class="tp-dialogue">
            "Bukan itu sahaja, sistem ini turut mengintegrasikan pembantu maya AdtecBot berkuasa Google Gemini. Pelajar boleh bertanyakan soalan seputar kampus dan panduan sistem pada bila-bila masa 24 jam sehari!"
          </div>
          <div class="tp-visual-cue">🎥 [Visual DEMO: Widget AdtecBot membalas soalan prosedur kampus dengan pantas]</div>
        </div>

        <!-- BABAK 5 -->
        <div class="tp-card-scene" data-speaker="adam">
          <span class="tp-speaker-badge badge-adam">Adam Darwish (3:25 - 3:45)</span>
          <div class="tp-dialogue">
            "Empat nilai tambah utama projek ini ialah: Pertama, kemas kini seratus peratus masa nyata. Kedua, kawalan akses selamat dengan pengesahan OTP dan keselamatan RLS Supabase. Ketiga, sokongan PWA yang membolehkan pemasangan terus pada telefon pintar tanpa melalui app store. Dan keempat, inisiatif Kampus Hijau yang menghentikan sepenuhnya pembaziran cetakan kertas notis."
          </div>
          <div class="tp-visual-cue">🎥 [Visual: Grafik 4 kad kelebihan utama muncul bergilir-gilir]</div>
        </div>

        <!-- BABAK 6 -->
        <div class="tp-card-scene" data-speaker="hazim">
          <span class="tp-speaker-badge badge-hazim">Hazim Afiq (3:45 - 4:10)</span>
          <div class="tp-dialogue">
            "Dari aspek kebolehpasaran dan impak, inovasi ini bukan sahaja berfaedah untuk ADTEC Melaka, malah seni bina modularnya membolehkan ia diguna pakai serta direplikasi di kesemua 33 buah institusi latihan JTM di seluruh negara, politeknik serta institusi pengajian tinggi lain."
          </div>
          <div class="tp-visual-cue">🎥 [Visual: Peta rangkaian ILJTM &amp; statistik penjimatan kos kertas 90%]</div>
        </div>

        <!-- BABAK 7 -->
        <div class="tp-card-scene" data-speaker="adam">
          <span class="tp-speaker-badge badge-adam">Adam Darwish (4:10 - 4:25)</span>
          <div class="tp-dialogue">
            "Secara kesimpulannya, Dashboard ADTEC Melaka membuktikan bahawa gabungan teknologi web moden dan kecerdasan buatan mampu mentransformasikan tadbir urus kampus TVET ke arah era digital yang pintar, telus dan selamat."
          </div>
          <div class="tp-visual-cue">🎥 [Visual: Ahli kumpulan berkumpul bersama pensyarah pembimbing di hadapan kamera]</div>
        </div>

        <div class="tp-card-scene" data-speaker="all">
          <span class="tp-speaker-badge badge-semua">Semua Ahli Serentak (4:25 - 4:35)</span>
          <div class="tp-dialogue">
            "Imbas kod QR di skrin anda untuk merasai sendiri pengalaman sistem ini. Sekian daripada kami, terima kasih!"
          </div>
          <div class="tp-visual-cue">🎥 [Visual: Kod QR besar berserta pautan URL laman web live terpapar jelas]</div>
        </div>

      </div>
    </div>
  </main>

  <!-- ==============================================================
       3. VIEW: SENARAI SEMAK & PANDUAN WALKTHROUGH DEMO
       ============================================================== -->
  <main class="view-content" id="view-checklist">
    <div class="checklist-view">

      <!-- PANDUAN PANTAS RAKAMAN -->
      <div class="guide-card">
        <h2 class="guide-title">🎬 Panduan Pantas Merakam Video CIFPEC</h2>
        <div class="steps-list">
          <div class="step-item">
            <span class="step-num">1</span>
            <div class="step-content">
              <h4>Gunakan OBS Studio atau Xbox Game Bar (Win + G)</h4>
              <p>Rakam skrin komputer pada resolusi 1920x1080 (Full HD) 60fps. Pastikan tetapan kualiti tinggi dan tiada gangguan tetingkap lain.</p>
            </div>
          </div>
          <div class="step-item">
            <span class="step-num">2</span>
            <div class="step-content">
              <h4>Buka Tab Sistem Live &amp; Masukkan Data Contoh</h4>
              <p>Pastikan sistem mempunyai sekurang-kurangnya 2 atau 3 laporan barang hilang sebenar berserta gambar menarik sebelum merakam demonstrasi.</p>
            </div>
          </div>
          <div class="step-item">
            <span class="step-num">3</span>
            <div class="step-content">
              <h4>Gunakan Teleprompter Studio Ini Semasa Merakam Suara</h4>
              <p>Buka tab <strong>📜 Teleprompter Skrip</strong> pada telefon atau monitor kedua. Tekan butang <em>Mula Skrol</em> supaya ahli kumpulan boleh membaca skrip dengan tenang dan nada yakin.</p>
            </div>
          </div>
          <div class="step-item">
            <span class="step-num">4</span>
            <div class="step-content">
              <h4>Sunting Menggunakan CapCut PC atau Clipchamp</h4>
              <p>Masukkan sari kata automatik (Auto-Captions), muzik latar santai berirama teknologi korporat, dan pastikan audio vokal jelas didengar.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- PINTASAN PANTAS HALAMAN LIVE UNTUK DIRAKAM -->
      <div class="guide-card">
        <h2 class="guide-title">🚀 Pintasan Pantas ke Sistem Live (Untuk Rakaman Demo)</h2>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:14px;">Klik pautan di bawah untuk terus membuka modul-modul sistem dalam tab baharu:</p>
        <div class="shortcut-buttons-grid">
          <a href="https://dashboard-information-nu.vercel.app" target="_blank" class="link-tile">
            <span class="lt-title">🌐 Laman Utama (Landing Page)</span>
            <span class="lt-desc">Rakam antaramuka pengenalan dan reka bentuk visual sistem.</span>
          </a>
          <a href="https://dashboard-information-nu.vercel.app/tv-display" target="_blank" class="link-tile">
            <span class="lt-title">📺 Mod Paparan Kiosk TV</span>
            <span class="lt-desc">Tekan F11 (Fullscreen) untuk merakam paparan digital signage kampus.</span>
          </a>
          <a href="https://dashboard-information-nu.vercel.app/dashboard" target="_blank" class="link-tile">
            <span class="lt-title">🔍 Dashboard Lost &amp; Found</span>
            <span class="lt-desc">Rakam suapan barang tercicir, penapis kategori dan carian.</span>
          </a>
          <a href="https://dashboard-information-nu.vercel.app/add-item" target="_blank" class="link-tile">
            <span class="lt-title">➕ Borang Lapor Barang</span>
            <span class="lt-desc">Rakam proses memuat naik gambar dan memilih lokasi.</span>
          </a>
        </div>
      </div>

      <!-- PETUA RUBRIK PEMARKAHAN CIFPEC -->
      <div class="guide-card" style="border-color:var(--emerald);">
        <h2 class="guide-title" style="color:var(--emerald);">🏆 5 Rahsia Skor Tinggi dalam Pertandingan CIFPEC</h2>
        <div class="steps-list">
          <div class="step-item">
            <span class="step-num" style="background:var(--emerald);">★</span>
            <div class="step-content">
              <h4>Tunjukkan 'Live Functionality', Bukan Sekadar Gambar Statik</h4>
              <p>Juri CIFPEC sangat kagum apabila melihat data bergerak secara masa nyata (WebSockets) dan bot AI menjawab soalan spontan.</p>
            </div>
          </div>
          <div class="step-item">
            <span class="step-num" style="background:var(--emerald);">★</span>
            <div class="step-content">
              <h4>Tekankan Nilai Privasi 'Tanpa Kongsi Nombor Telefon'</h4>
              <p>Ini adalah *killer feature* produk anda — menyelesaikan masalah keselamatan pelajar perempuan dan mengelakkan scammer.</p>
            </div>
          </div>
          <div class="step-item">
            <span class="step-num" style="background:var(--emerald);">★</span>
            <div class="step-content">
              <h4>Sebutkan Kebolehskalaan (Scalability) ke Seluruh ILJTM</h4>
              <p>Menunjukkan projek ini bukan hanya berguna di ADTEC Melaka, tetapi boleh dijadikan produk komersial atau sistem piawaian kebangsaan TVET.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </main>

  <!-- JAVASCRIPT LOGIC -->
  <script>
    // TAB NAVIGATION
    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.view-content').forEach(view => view.classList.remove('active'));

      if (tabId === 'slides') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('view-slides').classList.add('active');
      } else if (tabId === 'teleprompter') {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('view-teleprompter').classList.add('active');
      } else if (tabId === 'checklist') {
        document.querySelectorAll('.tab-btn')[2].classList.add('active');
        document.getElementById('view-checklist').classList.add('active');
      }
    }

    // SLIDE MANAGEMENT
    let currentSlide = 1;
    const totalSlides = 10;
    const speakers = [
      "Adam Darwish", // 1
      "Ahli Kumpulan & Penyelia", // 2
      "Hazim Afiq", // 3
      "Hazim Afiq", // 4
      "Muhammad Syahmi", // 5
      "Muhammad Syahmi", // 6
      "Muhammad Syahmi", // 7
      "Adam Darwish", // 8
      "Hazim Afiq", // 9
      "Semua Ahli Kumpulan" // 10
    ];

    function showSlide(index) {
      if (index < 1) index = 1;
      if (index > totalSlides) index = totalSlides;
      currentSlide = index;

      document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
      const activeEl = document.getElementById('slide-' + currentSlide);
      if (activeEl) activeEl.classList.add('active');

      document.getElementById('slideCounter').innerText = 'Slaid ' + currentSlide + ' / ' + totalSlides;
      document.getElementById('speakerIndicator').innerText = 'Pembicara: ' + speakers[currentSlide - 1];
    }

    function nextSlide() {
      if (currentSlide < totalSlides) {
        showSlide(currentSlide + 1);
      } else {
        showSlide(1);
      }
    }

    function prevSlide() {
      if (currentSlide > 1) {
        showSlide(currentSlide - 1);
      }
    }

    // KEYBOARD NAVIGATION
    window.addEventListener('keydown', (e) => {
      if (document.getElementById('view-slides').classList.contains('active')) {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
          e.preventDefault();
          nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          prevSlide();
        } else if (e.key === 'f' || e.key === 'F') {
          toggleFullscreen();
        }
      }
    });

    // AUTO-PLAY SLIDES
    let autoPlayTimer = null;
    function toggleAutoPlay() {
      const btn = document.getElementById('btnAutoPlay');
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        btn.innerText = '▶️ Auto-Play (8s)';
        btn.style.background = '';
      } else {
        nextSlide();
        autoPlayTimer = setInterval(nextSlide, 8000);
        btn.innerText = '⏹ Henti Auto-Play';
        btn.style.background = 'var(--rose)';
      }
    }

    // FULLSCREEN TOGGLE
    function toggleFullscreen() {
      const frame = document.getElementById('cinemaFrame');
      if (!document.fullscreenElement) {
        if (frame.requestFullscreen) {
          frame.requestFullscreen();
        } else if (frame.webkitRequestFullscreen) {
          frame.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    // TELEPROMPTER LOGIC
    let tpInterval = null;
    let tpSeconds = 0;
    let tpTimerInterval = null;
    let scrollSpeed = 3;

    function toggleTeleprompter() {
      const btn = document.getElementById('btnTpPlay');
      const box = document.getElementById('tpBox');

      if (tpInterval) {
        // Pause
        clearInterval(tpInterval);
        clearInterval(tpTimerInterval);
        tpInterval = null;
        tpTimerInterval = null;
        btn.innerText = '▶️ Sambung Skrol';
        btn.style.background = 'var(--emerald)';
      } else {
        // Start
        btn.innerText = '⏸ Jeda Skrol';
        btn.style.background = 'var(--amber)';

        tpInterval = setInterval(() => {
          box.scrollTop += scrollSpeed;
        }, 40);

        if (!tpTimerInterval) {
          tpTimerInterval = setInterval(() => {
            tpSeconds++;
            const m = String(Math.floor(tpSeconds / 60)).padStart(2, '0');
            const s = String(tpSeconds % 60).padStart(2, '0');
            document.getElementById('tpTimer').innerText = m + ':' + s;
          }, 1000);
        }
      }
    }

    function resetTeleprompter() {
      const box = document.getElementById('tpBox');
      if (tpInterval) {
        clearInterval(tpInterval);
        clearInterval(tpTimerInterval);
        tpInterval = null;
        tpTimerInterval = null;
      }
      box.scrollTop = 0;
      tpSeconds = 0;
      document.getElementById('tpTimer').innerText = '00:00';
      const btn = document.getElementById('btnTpPlay');
      btn.innerText = '▶️ Mula Skrol';
      btn.style.background = 'var(--emerald)';
    }

    function updateSpeed(val) {
      scrollSpeed = parseInt(val, 10);
      document.getElementById('speedVal').innerText = val + 'x';
    }

    function updateFontSize(val) {
      document.querySelectorAll('.tp-dialogue').forEach(d => {
        d.style.fontSize = val + 'px';
      });
      document.getElementById('sizeVal').innerText = val + 'px';
    }

    function filterSpeaker(speaker) {
      document.querySelectorAll('.tp-filter-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');

      document.querySelectorAll('.tp-card-scene').forEach(card => {
        if (speaker === 'all') {
          card.style.display = 'block';
        } else {
          const cardSpk = card.getAttribute('data-speaker');
          if (cardSpk === speaker || cardSpk === 'all') {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        }
      });
    }

    // Init first slide
    showSlide(1);
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(workspaceDir, 'video', 'index.html'), html, 'utf8');
console.log('Berjaya menjana video/index.html dengan saiz:', html.length, 'bait.');
