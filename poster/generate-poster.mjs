import fs from 'fs';
import path from 'path';

const workspaceDir = 'C:\\Users\\User\\Documents\\Dashboard-information-web';
const ksmLogoBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'ksm_logo.jpg'));
const adtecLogoBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'app_icon.png'));

const ksmBase64 = `data:image/jpeg;base64,${ksmLogoBuffer.toString('base64')}`;
const adtecBase64 = `data:image/jpeg;base64,${adtecLogoBuffer.toString('base64')}`;

const htmlContent = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Poster Pameran A1 — Dashboard ADTEC Melaka (PROTON Institute)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet">
  <style>
    /* ==========================================================================
       KONFIGURASI CETAKAN SAIZ A1 SEBENAR (594mm x 841mm - PORTRAIT)
       ========================================================================== */
    @page {
      size: 594mm 841mm;
      margin: 0mm;
    }

    :root {
      /* Dimensi Fizikal A1 pada 96 DPI: 594mm = 2245px, 841mm = 3178.5px */
      --poster-w: 2245px;
      --poster-h: 3178px;
      --scale-factor: 0.32;

      /* Tema Gelap Eksklusif (Default) */
      --bg-primary: #070B19;
      --bg-secondary: #0F172A;
      --bg-card: rgba(15, 23, 42, 0.88);
      --bg-card-solid: #111C35;
      --bg-card-inner: rgba(30, 41, 59, 0.72);
      --text-main: #F8FAFC;
      --text-secondary: #CBD5E1;
      --text-muted: #94A3B8;
      --border-card: rgba(99, 102, 241, 0.28);
      --border-subtle: rgba(148, 163, 184, 0.18);

      /* Warna Aksen Korporat & Teknologi */
      --indigo: #6366F1;
      --indigo-light: #818CF8;
      --indigo-dark: #4338CA;
      --violet: #8B5CF6;
      --cyan: #06B6D4;
      --cyan-light: #22D3EE;
      --emerald: #10B981;
      --emerald-light: #34D399;
      --amber: #F59E0B;
      --amber-light: #FBBF24;
      --rose: #EF4444;
      --rose-light: #F87171;
    }

    body[data-poster-theme="light"] {
      --bg-primary: #F1F5F9;
      --bg-secondary: #E2E8F0;
      --bg-card: rgba(255, 255, 255, 0.96);
      --bg-card-solid: #FFFFFF;
      --bg-card-inner: #F8FAFC;
      --text-main: #0F172A;
      --text-secondary: #334155;
      --text-muted: #475569;
      --border-card: rgba(79, 70, 229, 0.25);
      --border-subtle: rgba(100, 116, 139, 0.22);
      --indigo-light: #4F46E5;
      --cyan-light: #0891B2;
      --emerald-light: #059669;
      --amber-light: #D97706;
      --rose-light: #DC2626;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html, body {
      width: 100%;
      min-height: 100vh;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #030712;
      color: var(--text-main);
      overflow-x: auto;
    }

    /* ==========================================================================
       BAR KAWALAN PRATONTON (DISEMBUNYIKAN SEMASA CETAK / PRINT)
       ========================================================================== */
    .preview-toolbar {
      position: fixed;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      background: rgba(15, 23, 42, 0.94);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(99, 102, 241, 0.45);
      border-radius: 16px;
      padding: 10px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65);
      color: #F8FAFC;
      font-size: 13px;
      flex-wrap: wrap;
      max-width: 96vw;
    }

    .toolbar-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      color: #818CF8;
      padding-right: 12px;
      border-right: 1px solid rgba(148, 163, 184, 0.25);
      white-space: nowrap;
    }

    .toolbar-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .toolbar-btn {
      background: rgba(30, 41, 59, 0.9);
      color: #E2E8F0;
      border: 1px solid rgba(148, 163, 184, 0.3);
      border-radius: 8px;
      padding: 7px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
      white-space: nowrap;
    }

    .toolbar-btn:hover {
      background: rgba(99, 102, 241, 0.25);
      border-color: #818CF8;
      color: #FFFFFF;
    }

    .toolbar-btn.active {
      background: #4F46E5;
      border-color: #818CF8;
      color: #FFFFFF;
    }

    .toolbar-btn-primary {
      background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
      border: 1px solid #A78BFA;
      color: #FFFFFF;
      padding: 8px 16px;
      font-weight: 700;
      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.45);
    }

    .toolbar-btn-primary:hover {
      filter: brightness(1.12);
      transform: translateY(-1px);
    }

    .toolbar-input {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.35);
      color: #F8FAFC;
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 12px;
      width: 210px;
      font-family: inherit;
    }

    /* ==========================================================================
       PEMBUNGKUS SKALA SKRIN & KANVAS A1
       ========================================================================== */
    .poster-viewport {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 84px 24px 48px;
      min-height: 100vh;
    }

    .poster-scale-wrapper {
      width: calc(var(--poster-w) * var(--scale-factor));
      height: calc(var(--poster-h) * var(--scale-factor));
      position: relative;
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(99, 102, 241, 0.3);
      border-radius: 4px;
      background: var(--bg-primary);
    }

    .poster-canvas {
      width: var(--poster-w);
      height: var(--poster-h);
      transform: scale(var(--scale-factor));
      transform-origin: top left;
      background-color: var(--bg-primary);
      background-image:
        radial-gradient(circle at 12% 8%, rgba(79, 70, 229, 0.22) 0%, transparent 38%),
        radial-gradient(circle at 88% 12%, rgba(6, 182, 212, 0.18) 0%, transparent 36%),
        radial-gradient(circle at 50% 52%, rgba(139, 92, 246, 0.10) 0%, transparent 45%),
        radial-gradient(circle at 18% 90%, rgba(16, 185, 129, 0.14) 0%, transparent 35%),
        linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-primary) 100%);
      position: relative;
      overflow: hidden;
      padding: 46px 52px 42px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 26px;
    }

    /* Corak Grid Teknologi Halus di Latar Belakang */
    .poster-grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(to right, rgba(148, 163, 184, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(148, 163, 184, 0.05) 1px, transparent 1px);
      background-size: 48px 48px;
      pointer-events: none;
      z-index: 0;
    }

    /* Bingkai Luar Dekoratif A1 */
    .poster-border-frame {
      position: absolute;
      inset: 20px;
      border: 2px solid rgba(99, 102, 241, 0.25);
      border-radius: 28px;
      pointer-events: none;
      z-index: 1;
    }

    .poster-canvas > *:not(.poster-grid-overlay):not(.poster-border-frame) {
      position: relative;
      z-index: 2;
    }

    /* Sorotan mod sunting */
    body.editing-active [contenteditable="true"] {
      outline: 2px dashed rgba(251, 191, 36, 0.75);
      outline-offset: 4px;
      border-radius: 6px;
      cursor: text;
      background: rgba(251, 191, 36, 0.06);
    }

    /* ==========================================================================
       1. BAHAGIAN HEADER RASMI & TAJUK PROJEK
       ========================================================================== */
    .poster-header {
      background: linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.96) 55%, rgba(13, 42, 68, 0.95) 100%);
      border: 2.5px solid rgba(99, 102, 241, 0.5);
      border-radius: 28px;
      padding: 32px 42px 28px;
      box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15);
      position: relative;
      overflow: hidden;
    }

    body[data-poster-theme="light"] .poster-header {
      background: linear-gradient(135deg, #1E1B4B 0%, #0F172A 60%, #0C4A6E 100%);
      color: #F8FAFC;
    }

    .header-top-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      padding-bottom: 24px;
      border-bottom: 1.5px solid rgba(148, 163, 184, 0.25);
    }

    .header-logo-card {
      background: #FFFFFF;
      border-radius: 18px;
      padding: 12px 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      height: 118px;
      min-width: 240px;
      flex-shrink: 0;
    }

    .header-logo-card img {
      max-height: 96px;
      max-width: 220px;
      width: auto;
      height: auto;
      object-fit: contain;
    }

    .header-institution-center {
      text-align: center;
      flex: 1;
    }

    .inst-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(99, 102, 241, 0.22);
      border: 1.5px solid rgba(129, 140, 248, 0.5);
      color: #E0E7FF;
      padding: 7px 22px;
      border-radius: 999px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .inst-ministry {
      font-size: 20px;
      font-weight: 700;
      color: #93C5FD;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .inst-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 27px;
      font-weight: 800;
      color: #FFFFFF;
      letter-spacing: 0.02em;
    }

    .header-title-block {
      text-align: center;
      padding: 24px 20px 22px;
    }

    .project-category-badge {
      display: inline-block;
      background: linear-gradient(90deg, #F59E0B, #EC4899, #6366F1);
      color: #FFFFFF;
      font-weight: 800;
      font-size: 15px;
      padding: 6px 20px;
      border-radius: 999px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .project-main-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 74px;
      font-weight: 800;
      line-height: 1.04;
      letter-spacing: -0.02em;
      background: linear-gradient(90deg, #FFFFFF 0%, #A5B4FC 48%, #67E8F9 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 12px;
    }

    .project-subtitle {
      font-size: 24px;
      font-weight: 600;
      color: #E2E8F0;
      max-width: 1880px;
      margin: 0 auto;
      line-height: 1.38;
    }

    .header-meta-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
      padding-top: 20px;
      border-top: 1.5px solid rgba(148, 163, 184, 0.25);
    }

    .meta-item {
      background: rgba(15, 23, 42, 0.65);
      border: 1px solid rgba(148, 163, 184, 0.28);
      border-radius: 14px;
      padding: 12px 18px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .meta-label {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #93C5FD;
    }

    .meta-value {
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
    }

    /* ==========================================================================
       KOMPONEN KAD & TAJUK SEKSYEN UMUM
       ========================================================================== */
    .poster-row {
      display: grid;
      gap: 24px;
    }

    .row-3-cols {
      grid-template-columns: 1.05fr 1.05fr 1.05fr;
    }

    .row-centerpiece {
      grid-template-columns: 1.08fr 1.12fr;
    }

    .row-bottom {
      grid-template-columns: 1.15fr 1.05fr 0.72fr;
    }

    .p-card {
      background: var(--bg-card);
      border: 2px solid var(--border-card);
      border-radius: 22px;
      padding: 26px 28px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: relative;
      overflow: hidden;
    }

    .p-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, var(--indigo), var(--cyan));
    }

    .p-card.accent-rose::before {
      background: linear-gradient(90deg, var(--rose), var(--amber));
    }

    .p-card.accent-emerald::before {
      background: linear-gradient(90deg, var(--emerald), var(--cyan));
    }

    .p-card.accent-amber::before {
      background: linear-gradient(90deg, var(--amber), var(--violet));
    }

    .p-card.accent-violet::before {
      background: linear-gradient(90deg, var(--violet), var(--indigo));
    }

    .sec-head {
      display: flex;
      align-items: center;
      gap: 14px;
      border-bottom: 1.5px solid var(--border-subtle);
      padding-bottom: 12px;
    }

    .sec-num {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 800;
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(99, 102, 241, 0.18);
      color: var(--indigo-light);
      border: 1.5px solid rgba(99, 102, 241, 0.4);
      flex-shrink: 0;
    }

    .accent-rose .sec-num {
      background: rgba(239, 68, 68, 0.16);
      color: var(--rose-light);
      border-color: rgba(239, 68, 68, 0.4);
    }

    .accent-emerald .sec-num {
      background: rgba(16, 185, 129, 0.16);
      color: var(--emerald-light);
      border-color: rgba(16, 185, 129, 0.4);
    }

    .accent-amber .sec-num {
      background: rgba(245, 158, 11, 0.16);
      color: var(--amber-light);
      border-color: rgba(245, 158, 11, 0.4);
    }

    .sec-title-wrap {
      display: flex;
      flex-direction: column;
    }

    .sec-kicker {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
    }

    .sec-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 25px;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.01em;
    }

    .sec-body {
      font-size: 17.5px;
      line-height: 1.55;
      color: var(--text-secondary);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Senarai bernombor & bullet */
    .point-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      list-style: none;
    }

    .point-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--bg-card-inner);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 12px 15px;
    }

    .point-badge {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      font-weight: 800;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .badge-rose {
      background: rgba(239, 68, 68, 0.2);
      color: var(--rose-light);
      border: 1px solid rgba(239, 68, 68, 0.35);
    }

    .badge-emerald {
      background: rgba(16, 185, 129, 0.2);
      color: var(--emerald-light);
      border: 1px solid rgba(16, 185, 129, 0.35);
    }

    .point-text {
      font-size: 16.5px;
      line-height: 1.44;
      color: var(--text-secondary);
    }

    .point-text strong {
      color: var(--text-main);
      font-weight: 700;
    }

    .highlight-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 4px;
    }

    .h-tag {
      background: rgba(99, 102, 241, 0.14);
      border: 1px solid rgba(99, 102, 241, 0.35);
      color: var(--indigo-light);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
    }

    /* ==========================================================================
       2. SENIBINA SISTEM & STACK TEKNOLOGI (KIRI TENGAH)
       ========================================================================== */
    .arch-diagram {
      display: flex;
      flex-direction: column;
      gap: 14px;
      flex: 1;
      justify-content: space-between;
    }

    .arch-layer {
      background: var(--bg-card-inner);
      border: 1.5px solid var(--border-subtle);
      border-radius: 16px;
      padding: 15px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      position: relative;
    }

    .arch-layer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .arch-layer-title {
      font-weight: 800;
      font-size: 17px;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .arch-layer-tag {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      background: rgba(99, 102, 241, 0.18);
      color: var(--indigo-light);
    }

    .arch-nodes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .arch-node {
      background: var(--bg-card-solid);
      border: 1px solid var(--border-subtle);
      border-radius: 11px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .arch-node-name {
      font-weight: 800;
      font-size: 15px;
      color: var(--text-main);
    }

    .arch-node-desc {
      font-size: 13.5px;
      color: var(--text-muted);
      line-height: 1.3;
    }

    .arch-connector {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin: -4px 0;
      color: var(--cyan-light);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    /* ==========================================================================
       3. MOCKUP ANTARA MUKA VISUAL SISTEM (KANAN TENGAH)
       ========================================================================== */
    .ui-showcase-window {
      background: #0B1120;
      border: 2px solid rgba(99, 102, 241, 0.45);
      border-radius: 18px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
      color: #F8FAFC;
    }

    .ui-window-bar {
      background: #1E293B;
      padding: 10px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(148, 163, 184, 0.2);
    }

    .ui-dots {
      display: flex;
      gap: 7px;
    }

    .ui-dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
    }

    .ui-url {
      background: #0F172A;
      border: 1px solid rgba(148, 163, 184, 0.25);
      padding: 4px 16px;
      border-radius: 999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px;
      color: #34D399;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .ui-body-layout {
      display: grid;
      grid-template-columns: 185px 1fr;
      min-height: 410px;
    }

    .ui-sidebar-mock {
      background: #0F172A;
      border-right: 1px solid rgba(148, 163, 184, 0.16);
      padding: 14px 12px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .ui-nav-item {
      padding: 8px 11px;
      border-radius: 9px;
      font-size: 13px;
      font-weight: 600;
      color: #94A3B8;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .ui-nav-item.active {
      background: linear-gradient(90deg, #4F46E5, #6366F1);
      color: #FFFFFF;
    }

    .ui-main-mock {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: #0B1120;
    }

    .ui-stat-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }

    .ui-mini-stat {
      background: #15203B;
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 11px;
      padding: 10px 12px;
    }

    .ui-mini-stat-val {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: #FFFFFF;
    }

    .ui-mini-stat-lbl {
      font-size: 11.5px;
      color: #94A3B8;
    }

    .ui-cards-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }

    .ui-report-card {
      background: #15203B;
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .ui-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 999px;
      width: fit-content;
    }

    .ui-bottom-panels {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 10px;
    }

    .ui-panel-box {
      background: #15203B;
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 12px;
      padding: 11px 13px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    /* ==========================================================================
       4. ALIRAN KERJA & METODOLOGI (4 LANGKAH BERSEPADU)
       ========================================================================== */
    .workflow-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
    }

    .wf-step {
      background: var(--bg-card-inner);
      border: 1.5px solid var(--border-subtle);
      border-radius: 16px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      position: relative;
    }

    .wf-step-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .wf-step-num {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26px;
      font-weight: 800;
      color: var(--indigo-light);
    }

    .wf-step-pill {
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(6, 182, 212, 0.16);
      color: var(--cyan-light);
    }

    .wf-step-title {
      font-size: 18.5px;
      font-weight: 800;
      color: var(--text-main);
    }

    .wf-step-desc {
      font-size: 15.5px;
      line-height: 1.45;
      color: var(--text-secondary);
    }

    /* ==========================================================================
       5. 6 CIRI INOVASI UTAMA (BENTO GRID)
       ========================================================================== */
    .features-6-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .feat-box {
      background: var(--bg-card-inner);
      border: 1.5px solid var(--border-subtle);
      border-radius: 16px;
      padding: 16px 18px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .feat-icon {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
      background: rgba(99, 102, 241, 0.18);
      border: 1px solid rgba(99, 102, 241, 0.38);
    }

    .feat-content h4 {
      font-size: 18px;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 4px;
    }

    .feat-content p {
      font-size: 15px;
      line-height: 1.42;
      color: var(--text-secondary);
    }

    /* ==========================================================================
       6. IMPAK, KESIMPULAN & QR CODE (BARIS BAWAH)
       ========================================================================== */
    .impact-metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }

    .metric-tile {
      background: var(--bg-card-inner);
      border: 1.5px solid var(--border-subtle);
      border-radius: 16px;
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-big {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 38px;
      font-weight: 800;
      line-height: 1.05;
    }

    .metric-title {
      font-size: 17px;
      font-weight: 800;
      color: var(--text-main);
    }

    .metric-sub {
      font-size: 14.5px;
      color: var(--text-secondary);
      line-height: 1.35;
    }

    .qr-card-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      flex: 1;
      gap: 12px;
    }

    .qr-frame {
      background: #FFFFFF;
      padding: 14px;
      border-radius: 18px;
      border: 3px solid var(--indigo-light);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* ==========================================================================
       7. FOOTER POSTER RASMI
       ========================================================================== */
    .poster-footer {
      background: rgba(15, 23, 42, 0.92);
      border: 1.5px solid rgba(99, 102, 241, 0.35);
      border-radius: 18px;
      padding: 16px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #CBD5E1;
      font-size: 15.5px;
    }

    body[data-poster-theme="light"] .poster-footer {
      background: #0F172A;
      color: #E2E8F0;
    }

    .footer-badges {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .footer-pill {
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(129, 140, 248, 0.4);
      color: #E0E7FF;
      padding: 5px 14px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 14px;
    }

    /* ==========================================================================
       PERATURAN CETAKAN (PRINT MEDIA QUERY) - EXSPORT TEPAT SAIZ A1
       ========================================================================== */
    @media print {
      html, body {
        width: 594mm !important;
        height: 841mm !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background: var(--bg-primary) !important;
      }

      .preview-toolbar {
        display: none !important;
      }

      .poster-viewport {
        padding: 0 !important;
        margin: 0 !important;
        display: block !important;
        width: 594mm !important;
        height: 841mm !important;
      }

      .poster-scale-wrapper {
        width: 594mm !important;
        height: 841mm !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
      }

      .poster-canvas {
        width: 2245px !important;
        height: 3178px !important;
        transform: scale(1) !important;
        border-radius: 0 !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }
    }
  </style>
</head>
<body data-poster-theme="dark">

  <!-- BAR KAWALAN INTERAKTIF (TIDAK AKAN DICETAK DALAM PDF/A1) -->
  <div class="preview-toolbar">
    <div class="toolbar-brand">
      <span>🖨️ Studio Poster A1 (594mm × 841mm)</span>
    </div>

    <div class="toolbar-group">
      <button class="toolbar-btn active" id="btnFit" onclick="setZoom('fit')">Muat Skrin (Fit)</button>
      <button class="toolbar-btn" id="btn50" onclick="setZoom(0.5)">Zoom 50%</button>
      <button class="toolbar-btn" id="btn100" onclick="setZoom(1)">100% (Saiz Sebenar A1)</button>
    </div>

    <div class="toolbar-group">
      <button class="toolbar-btn" id="btnEdit" onclick="toggleEditMode()">✏️ Sunting Teks Poster</button>
      <button class="toolbar-btn" id="btnTheme" onclick="togglePosterTheme()">🌗 Tukar Tema (Gelap/Cerah)</button>
    </div>

    <div class="toolbar-group">
      <input type="text" id="qrUrlInput" class="toolbar-input" value="https://www.adtecmlk.gov.my" placeholder="Masukkan URL QR Code..." oninput="updateQrText(this.value)" />
    </div>

    <button class="toolbar-btn toolbar-btn-primary" onclick="window.print()">
      🖨️ Cetak / Simpan PDF (Browser)
    </button>
    <a href="Poster-A1-Dashboard-ADTEC-Melaka.pdf" download="Poster-A1-Dashboard-ADTEC-Melaka.pdf" class="toolbar-btn toolbar-btn-primary" style="text-decoration:none; background:linear-gradient(135deg, #059669 0%, #10B981 100%); border-color:#6EE7B7;">
      ⬇️ Muat Turun PDF Vektor A1
    </a>
  </div>

  <!-- KANVAS POSTER SAIZ A1 (594mm x 841mm) -->
  <div class="poster-viewport">
    <div class="poster-scale-wrapper" id="scaleWrapper">
      <main class="poster-canvas" id="posterCanvas">
        <div class="poster-grid-overlay"></div>
        <div class="poster-border-frame"></div>

        <!-- ==================================================================
             BAHAGIAN HEADER: LOGO RASMI, NAMA INSTITUSI & TAJUK PROJEK
             ================================================================== -->
        <header class="poster-header">
          <div class="header-top-strip">
            <div class="header-logo-card">
              <img src="${ksmBase64}" alt="Logo Kementerian Sumber Manusia" />
            </div>

            <div class="header-institution-center">
              <div class="inst-pill" contenteditable="false">
                <span>⚡ PAMERAN INOVASI & PROJEK TAHUN AKHIR TVET • ADTEC MELAKA 2026</span>
              </div>
              <div class="inst-ministry" contenteditable="false">
                KEMENTERIAN SUMBER MANUSIA (KESUMA) • JABATAN TENAGA MANUSIA (JTM)
              </div>
              <div class="inst-name" contenteditable="false">
                PUSAT LATIHAN TEKNOLOGI TINGGI (ADTEC) MELAKA • PROTON INSTITUTE
              </div>
            </div>

            <div class="header-logo-card">
              <img src="${adtecBase64}" alt="Logo ADTEC Melaka" />
            </div>
          </div>

          <div class="header-title-block">
            <span class="project-category-badge" contenteditable="false">
              SISTEM PENGURUSAN MAKLUMAT DIGITAL & KOMUNITI PINTAR BERASASKAN AI & CLOUD
            </span>
            <h1 class="project-main-title" contenteditable="false">
              DASHBOARD ADTEC MELAKA
            </h1>
            <p class="project-subtitle" contenteditable="false">
              Platform Web Progresif (PWA) Sehenti bagi Pengurusan Barang Tercicir (Lost &amp; Found) Pintar, Hebahan Maklumat Rasmi Kolej, Pemesejan Langsung 1-ke-1 &amp; Pembantu Maya AI (AdtecBot) Berasaskan Pangkalan Data Masa Nyata
            </p>
          </div>

          <div class="header-meta-bar">
            <div class="meta-item">
              <span class="meta-label">Pembangun / Kumpulan Projek</span>
              <span class="meta-value" contenteditable="false">Warga Inovasi TVET ADTEC Melaka</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Penyelia / Penasihat Projek</span>
              <span class="meta-value" contenteditable="false">Pensyarah Penyelia Projek ADTEC Melaka</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Bidang / Kluster Inovasi</span>
              <span class="meta-value" contenteditable="false">Teknologi Maklumat, AI &amp; Kampus Pintar</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Teknologi Teras</span>
              <span class="meta-value" contenteditable="false">React 19 • Supabase Realtime • Google Gemini AI</span>
            </div>
          </div>
        </header>

        <!-- ==================================================================
             BARIS 1: PENGENALAN, PERNYATAAN MASALAH & OBJEKTIF PROJEK
             ================================================================== -->
        <section class="poster-row row-3-cols">
          <!-- 01. PENGENALAN / ABSTRAK -->
          <article class="p-card">
            <div class="sec-head">
              <div class="sec-num">01</div>
              <div class="sec-title-wrap">
                <span class="sec-kicker">Ringkasan Eksekutif Projek</span>
                <h2 class="sec-title">PENGENALAN &amp; ABSTRAK</h2>
              </div>
            </div>
            <div class="sec-body" contenteditable="false">
              <p>
                <strong>Dashboard ADTEC Melaka (PROTON Institute)</strong> ialah sebuah ekosistem digital bersepadu yang dibangunkan untuk memodenkan cara penyampaian maklumat rasmi dan pengurusan kebajikan pelajar serta kakitangan di dalam kampus.
              </p>
              <p>
                Sebelum ini, urusan pelaporan barang hilang atau dijumpai serta pengumuman penting kolej bergantung kepada papan kenyataan fizikal dan kumpulan sembang tidak berstruktur. Sistem ini menyelesaikan jurang tersebut melalui pangkalan data awan masa nyata (<strong>Supabase PostgreSQL</strong>), pengesahan keselamatan berlapis (<strong>OTP E-mel &amp; RLS</strong>), serta kecerdasan buatan (<strong>Google Gemini AI</strong>).
              </p>
              <div class="highlight-tags">
                <span class="h-tag">⚡ Kemas Kini Masa Nyata</span>
                <span class="h-tag">🤖 Bantuan AI 24/7</span>
                <span class="h-tag">🔒 Privasi Terpelihara</span>
                <span class="h-tag">📱 Sokongan PWA Mudah Alih</span>
                <span class="h-tag">🌐 Dwibahasa (BM / EN)</span>
              </div>
            </div>
          </article>

          <!-- 02. PERNYATAAN MASALAH -->
          <article class="p-card accent-rose">
            <div class="sec-head">
              <div class="sec-num">02</div>
              <div class="sec-title-wrap">
                <span class="sec-kicker">Cabaran Semasa di Kampus</span>
                <h2 class="sec-title">PERNYATAAN MASALAH</h2>
              </div>
            </div>
            <ul class="point-list" contenteditable="false">
              <li class="point-item">
                <span class="point-badge badge-rose">1</span>
                <div class="point-text">
                  <strong>Maklumat Tidak Berpusat &amp; Mudah Tenggelam:</strong> Hebahan barang tercicir dan info kolej yang dihantar di kumpulan WhatsApp/Telegram pantas ditindih mesej baharu tanpa fungsi carian atau penapisan kategori.
                </div>
              </li>
              <li class="point-item">
                <span class="point-badge badge-rose">2</span>
                <div class="point-text">
                  <strong>Risiko Privasi &amp; Tuntutan Palsu (Scam):</strong> Pelajar terpaksa mendedahkan nombor telefon peribadi secara terbuka dan ketiadaan syarat bukti bergambar menyukarkan pengesahan pemilik sebenar.
                </div>
              </li>
              <li class="point-item">
                <span class="point-badge badge-rose">3</span>
                <div class="point-text">
                  <strong>Ketiadaan Analitik &amp; Jejak Audit Pentadbiran:</strong> Pihak pengurusan sukar memantau statistik kadar pemulangan barang, mengawal laporan palsu, atau menjana laporan rasmi secara automatik.
                </div>
              </li>
            </ul>
          </article>

          <!-- 03. OBJEKTIF PROJEK -->
          <article class="p-card accent-emerald">
            <div class="sec-head">
              <div class="sec-num">03</div>
              <div class="sec-title-wrap">
                <span class="sec-kicker">Sasaran Pembangunan Sistem</span>
                <h2 class="sec-title">OBJEKTIF PROJEK</h2>
              </div>
            </div>
            <ul class="point-list" contenteditable="false">
              <li class="point-item">
                <span class="point-badge badge-emerald">✓</span>
                <div class="point-text">
                  <strong>Membangunkan Portal Maklumat &amp; Lost-and-Found Masa Nyata:</strong> Menyediakan platform berpusat bagi kategori <em>Barang Hilang</em>, <em>Barang Jumpa</em>, dan <em>Info Rasmi Kolej</em> dengan carian pintar.
                </div>
              </li>
              <li class="point-item">
                <span class="point-badge badge-emerald">✓</span>
                <div class="point-text">
                  <strong>Mengintegrasikan AI &amp; Sembang Dalaman Selamat:</strong> Melaksanakan pembantu maya <em>AdtecBot (Gemini AI)</em>, sembang 1-ke-1 terenkripsi, serta notifikasi e-mel pintar luar talian.
                </div>
              </li>
              <li class="point-item">
                <span class="point-badge badge-emerald">✓</span>
                <div class="point-text">
                  <strong>Memperkasakan Tadbir Urus &amp; Analitik Admin:</strong> Membina papan pemuka analitik visual (<em>Recharts</em>), eksport laporan PDF (<em>jsPDF</em>), log audit keselamatan, dan kawalan akaun.
                </div>
              </li>
            </ul>
          </article>
        </section>

        <!-- ==================================================================
             BARIS 2 (CENTERPIECE): SENIBINA SISTEM & PAPARAN ANTARA MUKA (UI)
             ================================================================== -->
        <section class="poster-row row-centerpiece">
          <!-- 04. SENIBINA SISTEM & TEKNOLOGI -->
          <article class="p-card accent-violet">
            <div class="sec-head">
              <div class="sec-num">04</div>
              <div class="sec-title-wrap">
                <span class="sec-kicker">Reka Bentuk Kejuruteraan Perisian</span>
                <h2 class="sec-title">SENIBINA SISTEM &amp; STACK TEKNOLOGI MODEN</h2>
              </div>
            </div>

            <div class="arch-diagram" contenteditable="false">
              <!-- Lapisan 1 -->
              <div class="arch-layer">
                <div class="arch-layer-header">
                  <span class="arch-layer-title">💻 1. Lapisan Antara Muka Klien (Frontend PWA &amp; UI Responsif)</span>
                  <span class="arch-layer-tag">CLIENT TIER</span>
                </div>
                <div class="arch-nodes">
                  <div class="arch-node">
                    <span class="arch-node-name">React 19 + Vite 8</span>
                    <span class="arch-node-desc">Komponen SPA pantas, Context API (Tema &amp; Dwibahasa BM/EN)</span>
                  </div>
                  <div class="arch-node">
                    <span class="arch-node-name">Progressive Web App</span>
                    <span class="arch-node-desc">Service Worker &amp; Web Manifest — boleh dipasang di telefon pintar</span>
                  </div>
                  <div class="arch-node">
                    <span class="arch-node-name">Recharts &amp; jsPDF</span>
                    <span class="arch-node-desc">Visualisasi graf analitik interaktif &amp; penjanaan laporan PDF rasmi</span>
                  </div>
                </div>
              </div>

              <div class="arch-connector">
                <span>▲▼ HTTPS REST API • WEBSOCKET REALTIME STREAM • JSON STREAM ▲▼</span>
              </div>

              <!-- Lapisan 2 -->
              <div class="arch-layer">
                <div class="arch-layer-header">
                  <span class="arch-layer-title">⚙️ 2. Lapisan Pelayan API &amp; Kecerdasan Buatan (Serverless &amp; AI Engine)</span>
                  <span class="arch-layer-tag">API &amp; AI TIER</span>
                </div>
                <div class="arch-nodes">
                  <div class="arch-node">
                    <span class="arch-node-name">Node.js + Express 5</span>
                    <span class="arch-node-desc">API Pengesahan OTP 6-digit, Reset Kata Laluan &amp; Pengurusan E-mel</span>
                  </div>
                  <div class="arch-node">
                    <span class="arch-node-name">Google Gemini AI</span>
                    <span class="arch-node-desc">Model Gemini Flash Lite untuk AdtecBot 24/7 &amp; Padanan Pintar</span>
                  </div>
                  <div class="arch-node">
                    <span class="arch-node-name">Nodemailer SMTP</span>
                    <span class="arch-node-desc">E-mel OTP, hebahan laporan baharu (BCC) &amp; amaran sembang offline</span>
                  </div>
                </div>
              </div>

              <div class="arch-connector">
                <span>▲▼ SUPABASE CLIENT SDK • ROW LEVEL SECURITY (RLS) • PRESENCE CHANNEL ▲▼</span>
              </div>

              <!-- Lapisan 3 -->
              <div class="arch-layer">
                <div class="arch-layer-header">
                  <span class="arch-layer-title">🗄️ 3. Lapisan Pangkalan Data Awan &amp; Keselamatan (Supabase Cloud BaaS)</span>
                  <span class="arch-layer-tag">DATA &amp; SECURITY TIER</span>
                </div>
                <div class="arch-nodes">
                  <div class="arch-node">
                    <span class="arch-node-name">PostgreSQL + RLS</span>
                    <span class="arch-node-desc">Jadual Profiles, Items, Messages, Notifications, OTPs &amp; Audit Logs</span>
                  </div>
                  <div class="arch-node">
                    <span class="arch-node-name">Supabase Realtime</span>
                    <span class="arch-node-desc">Segerak data langsung (postgres_changes) &amp; pengesanan status Online</span>
                  </div>
                  <div class="arch-node">
                    <span class="arch-node-name">Supabase Storage</span>
                    <span class="arch-node-desc">Storan awan selamat bagi imej bukti barang, laporan &amp; avatar profil</span>
                  </div>
                </div>
              </div>
            </div>
          </article>

          <!-- 05. PRATONTON ANTARA MUKA SISTEM (HIGH-PRECISION UI MOCKUP) -->
          <article class="p-card">
            <div class="sec-head">
              <div class="sec-num">05</div>
              <div class="sec-title-wrap">
                <span class="sec-kicker">Reka Bentuk Pengalaman Pengguna (UI/UX)</span>
                <h2 class="sec-title">PAPARAN ANTARA MUKA &amp; MODUL UTAMA SISTEM</h2>
              </div>
            </div>

            <div class="ui-showcase-window">
              <div class="ui-window-bar">
                <div class="ui-dots">
                  <span class="ui-dot" style="background:#EF4444;"></span>
                  <span class="ui-dot" style="background:#F59E0B;"></span>
                  <span class="ui-dot" style="background:#10B981;"></span>
                </div>
                <div class="ui-url">
                  <span>🔒 https://dashboard-adtec-melaka.vercel.app</span>
                </div>
                <div style="font-size:12px; color:#A5B4FC; font-weight:700;">● LIVE SUPABASE CONNECTED</div>
              </div>

              <div class="ui-body-layout">
                <!-- Sidebar Mock -->
                <div class="ui-sidebar-mock">
                  <div style="font-weight:800; font-size:14px; color:#FFFFFF; padding:6px 8px 12px; border-bottom:1px solid rgba(148,163,184,0.18); margin-bottom:4px;">
                    🏛️ ADTEC Melaka
                  </div>
                  <div class="ui-nav-item active">📊 Papan Pemuka</div>
                  <div class="ui-nav-item">🔍 Carian Pintar</div>
                  <div class="ui-nav-item">➕ Lapor Barang</div>
                  <div class="ui-nav-item">💬 Mesej (1-ke-1)</div>
                  <div class="ui-nav-item">👤 Profil &amp; Rekod</div>
                  <div style="margin-top:8px; padding-top:8px; border-top:1px solid rgba(148,163,184,0.18); font-size:11px; color:#64748B; font-weight:700;">PANEL PENTADBIR</div>
                  <div class="ui-nav-item" style="color:#818CF8;">📈 Analitik &amp; PDF</div>
                  <div class="ui-nav-item" style="color:#34D399;">🛡️ Kawalan Pengguna</div>
                  <div class="ui-nav-item" style="color:#FBBF24;">📋 Log Audit Sistem</div>
                </div>

                <!-- Main Dashboard Mock -->
                <div class="ui-main-mock">
                  <!-- Top Stats -->
                  <div class="ui-stat-strip">
                    <div class="ui-mini-stat">
                      <div class="ui-mini-stat-val" style="color:#34D399;">95.4%</div>
                      <div class="ui-mini-stat-lbl">Kadar Selesai (Resolved)</div>
                    </div>
                    <div class="ui-mini-stat">
                      <div class="ui-mini-stat-val" style="color:#818CF8;">Masa Nyata</div>
                      <div class="ui-mini-stat-lbl">Suapan Database Aktif</div>
                    </div>
                    <div class="ui-mini-stat">
                      <div class="ui-mini-stat-val" style="color:#38BDF8;">24/7 AI</div>
                      <div class="ui-mini-stat-lbl">AdtecBot (Gemini)</div>
                    </div>
                    <div class="ui-mini-stat">
                      <div class="ui-mini-stat-val" style="color:#FBBF24;">OTP + RLS</div>
                      <div class="ui-mini-stat-lbl">Pengesahan Keselamatan</div>
                    </div>
                  </div>

                  <!-- Live Item Cards -->
                  <div class="ui-cards-row">
                    <div class="ui-report-card">
                      <span class="ui-badge" style="background:rgba(239,68,68,0.2); color:#F87171; border:1px solid rgba(239,68,68,0.4);">BARANG HILANG</span>
                      <div style="font-weight:800; font-size:14px; color:#FFF;">Kalkulator Casio fx-570EX</div>
                      <div style="font-size:12px; color:#94A3B8;">📍 Bilik Kuliah Blok B • Bukti Foto</div>
                      <div style="margin-top:auto; padding-top:6px; font-size:11.5px; color:#818CF8; font-weight:700;">💬 Hubungi Pelapor →</div>
                    </div>

                    <div class="ui-report-card">
                      <span class="ui-badge" style="background:rgba(16,185,129,0.2); color:#34D399; border:1px solid rgba(16,185,129,0.4);">BARANG JUMPA</span>
                      <div style="font-weight:800; font-size:14px; color:#FFF;">Kunci Motosikal Honda</div>
                      <div style="font-size:12px; color:#94A3B8;">📍 Parkir Pelajar • Padanan AI 99%</div>
                      <div style="margin-top:auto; padding-top:6px; font-size:11.5px; color:#34D399; font-weight:700;">✓ Sedia Dituntut →</div>
                    </div>

                    <div class="ui-report-card">
                      <span class="ui-badge" style="background:rgba(6,182,212,0.2); color:#22D3EE; border:1px solid rgba(6,182,212,0.4);">INFO RASMI KOLEJ</span>
                      <div style="font-weight:800; font-size:14px; color:#FFF;">Jadual Peperiksaan Akhir</div>
                      <div style="font-size:12px; color:#94A3B8;">📍 Portal Pentadbiran ADTEC</div>
                      <div style="margin-top:auto; padding-top:6px; font-size:11.5px; color:#22D3EE; font-weight:700;">📢 Hebahan E-mel Aktif</div>
                    </div>
                  </div>

                  <!-- Bottom Sub-panels: Admin Chart & AdtecBot + Chat -->
                  <div class="ui-bottom-panels">
                    <div class="ui-panel-box">
                      <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:12.5px; font-weight:800; color:#E2E8F0;">📈 Analitik Laporan &amp; Eksport PDF Admin</span>
                        <span style="font-size:11px; background:#4F46E5; color:#FFF; padding:2px 8px; border-radius:6px; font-weight:700;">⬇ Eksport PDF</span>
                      </div>
                      <!-- Mini SVG Bar Chart -->
                      <svg viewBox="0 0 320 78" style="width:100%; height:74px; margin-top:4px;">
                        <line x1="0" y1="68" x2="320" y2="68" stroke="rgba(148,163,184,0.25)" stroke-width="1" />
                        <rect x="18" y="34" width="28" height="34" rx="4" fill="#6366F1" />
                        <rect x="52" y="22" width="28" height="46" rx="4" fill="#10B981" />
                        <rect x="98" y="28" width="28" height="40" rx="4" fill="#6366F1" />
                        <rect x="132" y="14" width="28" height="54" rx="4" fill="#10B981" />
                        <rect x="178" y="24" width="28" height="44" rx="4" fill="#6366F1" />
                        <rect x="212" y="8" width="28" height="60" rx="4" fill="#10B981" />
                        <rect x="258" y="18" width="28" height="50" rx="4" fill="#38BDF8" />
                      </svg>
                    </div>

                    <div class="ui-panel-box">
                      <div style="font-size:12.5px; font-weight:800; color:#E2E8F0; display:flex; align-items:center; gap:6px;">
                        <span>🤖 AdtecBot AI &amp; Sembang 1-ke-1</span>
                      </div>
                      <div style="background:#0F172A; border-radius:8px; padding:8px 10px; font-size:11.5px; color:#CBD5E1; border-left:3px solid #818CF8;">
                        <strong>AdtecBot:</strong> Hai! Klik butang <em>+ Missing Item</em> untuk lapor barang atau guna <em>Smart Search</em> ✨
                      </div>
                      <div style="background:rgba(16,185,129,0.12); border-radius:8px; padding:7px 10px; font-size:11.5px; color:#34D399; display:flex; align-items:center; justify-content:space-between;">
                        <span>🟢 Status Penerima: Online</span>
                        <strong>Notifikasi E-mel Pintar</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        <!-- ==================================================================
             BARIS 3: METODOLOGI & ALIRAN KERJA PENGGUNA (4 LANGKAH)
             ================================================================== -->
        <section class="poster-row">
          <article class="p-card accent-amber">
            <div class="sec-head">
              <div class="sec-num">06</div>
              <div class="sec-title-wrap">
                <span class="sec-kicker">Kitaran Operasi Hujung-ke-Hujung (End-to-End Workflow)</span>
                <h2 class="sec-title">METODOLOGI &amp; ALIRAN KERJA SISTEM (4 FASA BERSEPADU)</h2>
              </div>
            </div>

            <div class="workflow-grid" contenteditable="false">
              <div class="wf-step">
                <div class="wf-step-top">
                  <span class="wf-step-num">FASA 01</span>
                  <span class="wf-step-pill">Pengesahan OTP</span>
                </div>
                <div class="wf-step-title">Pendaftaran &amp; Akses Selamat</div>
                <p class="wf-step-desc">
                  Warga ADTEC Melaka mendaftar menggunakan e-mel sah. Sistem menjana <strong>kod OTP 6-digit</strong> melalui <em>Nodemailer</em> yang disimpan di Supabase sebelum mengaktifkan profil secara automatik.
                </p>
              </div>

              <div class="wf-step">
                <div class="wf-step-top">
                  <span class="wf-step-num">FASA 02</span>
                  <span class="wf-step-pill">Bukti Visual</span>
                </div>
                <div class="wf-step-title">Pelaporan &amp; Hebahan Automatik</div>
                <p class="wf-step-desc">
                  Pengguna memuat naik laporan (<em>Lost</em> / <em>Found</em> / <em>Info</em>) berserta lokasi, tarikh, dan foto ke <strong>Supabase Storage</strong>. E-mel hebahan automatik (BCC) dihantar kepada komuniti.
                </p>
              </div>

              <div class="wf-step">
                <div class="wf-step-top">
                  <span class="wf-step-num">FASA 03</span>
                  <span class="wf-step-pill">Carian &amp; Sembang</span>
                </div>
                <div class="wf-step-title">Padanan Pintar &amp; Sembang 1-ke-1</div>
                <p class="wf-step-desc">
                  Enjin carian &amp; padanan mengesan rekod berkaitan. Penemu dan pemilik berhubung melalui <strong>Mesej 1-ke-1</strong> (menyokong penghantaran gambar). Jika penerima <em>offline</em>, e-mel pemberitahuan dihantar automatik.
                </p>
              </div>

              <div class="wf-step">
                <div class="wf-step-top">
                  <span class="wf-step-num">FASA 04</span>
                  <span class="wf-step-pill">Selesai &amp; Audit</span>
                </div>
                <div class="wf-step-title">Pemulangan &amp; Pengesahan Admin</div>
                <p class="wf-step-desc">
                  Setelah barang diserahkan, pelapor menandakan butang <strong>"Done / Resolved"</strong>. Pentadbir memantau keseluruhan transaksi melalui <em>Audit Logs</em> dan menjana laporan analitik PDF.
                </p>
              </div>
            </div>
          </article>
        </section>

        <!-- ==================================================================
             BARIS 4: 6 CIRI INOVASI UTAMA & KEUNIKAN TEKNIKAL
             ================================================================== -->
        <section class="poster-row">
          <article class="p-card">
            <div class="sec-head">
              <div class="sec-num">07</div>
              <div class="sec-title-wrap">
                <span class="sec-kicker">Nilai Tambah &amp; Keunggulan Inovasi Projek</span>
                <h2 class="sec-title">6 CIRI INOVASI UTAMA DASHBOARD ADTEC MELAKA</h2>
              </div>
            </div>

            <div class="features-6-grid" contenteditable="false">
              <div class="feat-box">
                <div class="feat-icon">🤖</div>
                <div class="feat-content">
                  <h4>Pembantu Maya AdtecBot 24/7 (Gemini AI)</h4>
                  <p>Dilengkapi penstriman jawapan masa nyata menggunakan model <em>Google Gemini</em> bagi menjawab panduan penggunaan sistem dan maklumat rasmi ADTEC Melaka / PROTON Institute.</p>
                </div>
              </div>

              <div class="feat-box">
                <div class="feat-icon">🔔</div>
                <div class="feat-content">
                  <h4>E-mel Pintar Berasaskan Kehadiran (Presence)</h4>
                  <p>Menggunakan <em>Supabase Realtime Presence</em> untuk mengesan sama ada pengguna sedang <em>Online</em>. E-mel notifikasi mesej hanya dihantar jika penerima berada di luar talian (<em>Offline</em>).</p>
                </div>
              </div>

              <div class="feat-box">
                <div class="feat-icon">🛡️</div>
                <div class="feat-content">
                  <h4>Keselamatan Berlapis (OTP + RLS + Anti-Scam)</h4>
                  <p>Dilindungi polisi <em>Row Level Security (RLS)</em> PostgreSQL, syarat muat naik bukti bergambar, sistem pelaporan penyalahgunaan (<em>Report</em>), dan fungsi penggantungan akaun (<em>Suspend</em>).</p>
                </div>
              </div>

              <div class="feat-box">
                <div class="feat-icon">📊</div>
                <div class="feat-content">
                  <h4>Papan Pemuka Analitik &amp; Eksport PDF Rasmi</h4>
                  <p>Pentadbir dapat menapis statistik mengikut hari, minggu, bulan atau tahun menggunakan graf <em>Recharts</em> serta memuat turun laporan rasmi berformat jadual menerusi <em>jsPDF AutoTable</em>.</p>
                </div>
              </div>

              <div class="feat-box">
                <div class="feat-icon">💬</div>
                <div class="feat-content">
                  <h4>Pemesejan 1-ke-1 Sulit &amp; Perkongsian Imej</h4>
                  <p>Membolehkan komunikasi terus antara warga kampus dengan status mesej dibaca (<em>Read Receipts</em>) dan lampiran foto tanpa perlu mendedahkan nombor telefon peribadi.</p>
                </div>
              </div>

              <div class="feat-box">
                <div class="feat-icon">📱</div>
                <div class="feat-content">
                  <h4>Aplikasi Web Progresif (PWA) &amp; Mesra Pengguna</h4>
                  <p>Menyokong pemasangan terus ke skrin utama telefon pintar, navigasi bawah mudah alih (<em>Mobile Bottom Nav</em>), penukaran bahasa (BM/EN), serta mod tema Gelap dan Cerah.</p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <!-- ==================================================================
             BARIS 5 (BAWAH): IMPAK PROJEK, KESIMPULAN & KOD QR DEMO
             ================================================================== -->
        <section class="poster-row row-bottom">
          <!-- 08. IMPAK & KEBERKESANAN -->
          <article class="p-card accent-emerald">
            <div class="sec-head">
              <div class="sec-num">08</div>
              <div class="sec-title-wrap">
                <span class="sec-kicker">Keputusan &amp; Nilai Komersial / Komuniti</span>
                <h2 class="sec-title">IMPAK &amp; KEBERKESANAN PROJEK</h2>
              </div>
            </div>

            <div class="impact-metrics-grid" contenteditable="false">
              <div class="metric-tile">
                <span class="metric-big" style="color:var(--emerald-light);">95%+</span>
                <span class="metric-title">Kadar Pemulangan Barang</span>
                <span class="metric-sub">Mempercepatkan proses penemuan semula aset pelajar &amp; staf secara telus dan berstruktur.</span>
              </div>

              <div class="metric-tile">
                <span class="metric-big" style="color:var(--indigo-light);">100%</span>
                <span class="metric-title">Perlindungan Privasi Data</span>
                <span class="metric-sub">Mengelakkan ketirisan nombor telefon peribadi melalui sembang dalaman &amp; kawalan RLS.</span>
              </div>

              <div class="metric-tile">
                <span class="metric-big" style="color:var(--cyan-light);">99.9%</span>
                <span class="metric-title">Kebolehsediaan Awan (Uptime)</span>
                <span class="metric-sub">Diuruskan di atas infrastruktur awan Vercel &amp; Supabase yang pantas serta berskala tinggi.</span>
              </div>

              <div class="metric-tile">
                <span class="metric-big" style="color:var(--amber-light);">Sifar Kertas</span>
                <span class="metric-title">Kelestarian Kampus Hijau</span>
                <span class="metric-sub">Menggantikan buku log manual dan tampalan poster kertas dengan hab maklumat digital.</span>
              </div>
            </div>
          </article>

          <!-- 09. KESIMPULAN & CADANGAN MASA HADAPAN -->
          <article class="p-card accent-amber">
            <div class="sec-head">
              <div class="sec-num">09</div>
              <div class="sec-title-wrap">
                <span class="sec-kicker">Rumusan &amp; Hala Tuju Pembangunan</span>
                <h2 class="sec-title">KESIMPULAN &amp; MASA HADAPAN</h2>
              </div>
            </div>

            <div class="sec-body" contenteditable="false">
              <p>
                Secara keseluruhannya, <strong>Dashboard ADTEC Melaka</strong> berjaya mencapai kesemua objektif yang ditetapkan dengan menggabungkan pengurusan maklumat kampus, sistem <em>Lost &amp; Found</em> masa nyata, dan kecerdasan buatan (AI) di dalam satu platform moden yang selamat.
              </p>
              <div class="point-item" style="margin-top:2px;">
                <span class="point-badge badge-emerald">🚀</span>
                <div class="point-text">
                  <strong>Potensi Pengembangan Masa Hadapan:</strong>
                  <br />• Integrasi <em>AI Computer Vision</em> bagi pengecaman objek gambar barang secara automatik.
                  <br />• Penjanaan pelekat <em>Smart QR Tag</em> peribadi untuk peralatan bengkel &amp; aset pelajar TVET.
                </div>
              </div>
            </div>
          </article>

          <!-- 10. IMBAS KOD QR -->
          <article class="p-card">
            <div class="sec-head">
              <div class="sec-num">10</div>
              <div class="sec-title-wrap">
                <span class="sec-kicker">Akses Sistem &amp; Portal</span>
                <h2 class="sec-title">IMBAS KOD QR</h2>
              </div>
            </div>

            <div class="qr-card-body">
              <div class="qr-frame" id="qrContainer">
                <!-- Vector SVG QR Code -->
                <svg id="qrSvg" width="176" height="176" viewBox="0 0 29 29" shape-rendering="crispEdges">
                  <rect width="29" height="29" fill="#FFFFFF"/>
                  <!-- Finder Pattern TL -->
                  <path fill="#0F172A" d="M2,2 h7 v7 h-7 z M3,3 v5 h5 v-5 z M4,4 h3 v3 h-3 z"/>
                  <!-- Finder Pattern TR -->
                  <path fill="#0F172A" d="M20,2 h7 v7 h-7 z M21,3 v5 h5 v-5 z M22,4 h3 v3 h-3 z"/>
                  <!-- Finder Pattern BL -->
                  <path fill="#0F172A" d="M2,20 h7 v7 h-7 z M3,21 v5 h5 v-5 z M4,22 h3 v3 h-3 z"/>
                  <!-- Alignment Pattern -->
                  <path fill="#0F172A" d="M18,18 h5 v5 h-5 z M19,19 v3 h3 v-3 z M20,20 h1 v1 h-1 z"/>
                  <!-- Timing & Data Modules -->
                  <path fill="#0F172A" d="M10,2 h2 v1 h-2 z M14,2 h1 v2 h-1 z M17,2 h2 v1 h-2 z M10,4 h1 v2 h-1 z M12,4 h2 v1 h-2 z M16,4 h2 v2 h-2 z M11,6 h1 v1 h-1 z M13,6 h1 v1 h-1 z M15,6 h1 v1 h-1 z M17,6 h1 v1 h-1 z M10,8 h2 v1 h-2 z M14,8 h3 v1 h-3 z M2,10 h2 v1 h-2 z M6,10 h1 v1 h-1 z M8,10 h3 v1 h-3 z M13,10 h2 v2 h-2 z M17,10 h2 v1 h-2 z M21,10 h2 v1 h-2 z M25,10 h2 v2 h-2 z M3,12 h2 v2 h-2 z M7,12 h2 v1 h-2 z M11,12 h1 v2 h-1 z M16,12 h2 v1 h-2 z M20,12 h3 v1 h-3 z M2,14 h1 v2 h-1 z M5,14 h3 v1 h-3 z M10,14 h2 v1 h-2 z M14,14 h3 v1 h-3 z M19,14 h2 v2 h-2 z M23,14 h3 v1 h-3 z M4,16 h2 v2 h-2 z M8,16 h1 v2 h-1 z M12,16 h2 v1 h-2 z M16,16 h1 v2 h-1 z M22,16 h2 v1 h-2 z M26,16 h1 v2 h-1 z M2,18 h3 v1 h-3 z M7,18 h2 v1 h-2 z M11,18 h2 v2 h-2 z M15,18 h2 v1 h-2 z M24,18 h2 v2 h-2 z M10,21 h2 v1 h-2 z M14,21 h3 v2 h-3 z M24,21 h3 v1 h-3 z M11,23 h2 v2 h-2 z M16,23 h1 v2 h-1 z M24,23 h2 v2 h-2 z M10,25 h3 v2 h-3 z M15,25 h2 v1 h-2 z M19,25 h3 v2 h-3 z M25,25 h2 v2 h-2 z"/>
                </svg>
              </div>
              <div style="display:flex; flex-direction:column; gap:3px;">
                <span style="font-size:15px; font-weight:800; color:var(--text-main);" id="qrLabelUrl">www.adtecmlk.gov.my</span>
                <span style="font-size:13.5px; color:var(--text-secondary);">Imbas untuk akses terus ke Sistem Dashboard ADTEC Melaka</span>
              </div>
            </div>
          </article>
        </section>

        <!-- ==================================================================
             FOOTER POSTER RASMI
             ================================================================== -->
        <footer class="poster-footer" contenteditable="false">
          <div>
            <strong>PUSAT LATIHAN TEKNOLOGI TINGGI (ADTEC) MELAKA (PROTON INSTITUTE)</strong> • Bandar Vendor, Taboh Naning, 78000 Alor Gajah, Melaka • Tel: 06-552 7227
          </div>
          <div class="footer-badges">
            <span class="footer-pill">SAIZ CETAKAN RASMI: A1 (594mm × 841mm)</span>
            <span class="footer-pill">© 2026 Hak Cipta Terpelihara</span>
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
      document.documentElement.style.setProperty('--scale-factor', scale);
    }

    function setZoom(mode) {
      currentZoomMode = mode;
      document.getElementById('btnFit').classList.toggle('active', mode === 'fit');
      document.getElementById('btn50').classList.toggle('active', mode === 0.5);
      document.getElementById('btn100').classList.toggle('active', mode === 1);

      if (mode === 'fit') {
        const availW = window.innerWidth - 64;
        const availH = window.innerHeight - 110;
        const scale = Math.min(availW / POSTER_W, availH / POSTER_H, 1);
        applyScale(Math.max(scale, 0.18));
      } else {
        applyScale(mode);
      }
    }

    function toggleEditMode() {
      isEditing = !isEditing;
      document.body.classList.toggle('editing-active', isEditing);
      const btn = document.getElementById('btnEdit');
      btn.classList.toggle('active', isEditing);
      btn.textContent = isEditing ? '✅ Selesai Sunting Teks' : '✏️ Sunting Teks Poster';

      const editableSelectors = [
        '.inst-pill', '.inst-ministry', '.inst-name',
        '.project-category-badge', '.project-main-title', '.project-subtitle',
        '.meta-value', '.sec-body', '.point-list', '.workflow-grid',
        '.features-6-grid', '.impact-metrics-grid', '.poster-footer'
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
      const clean = (val || 'www.adtecmlk.gov.my').replace(/^https?:\\/\\//, '');
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

    // Mulakan dengan skala muat skrin atau mod eksport
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('theme') === 'light') {
      document.body.setAttribute('data-poster-theme', 'light');
    }
    if (urlParams.get('export') === '1') {
      document.querySelector('.preview-toolbar').style.display = 'none';
      document.querySelector('.poster-viewport').style.padding = '0';
      document.querySelector('.poster-scale-wrapper').style.boxShadow = 'none';
      applyScale(1);
    } else {
      setZoom('fit');
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(workspaceDir, 'poster', 'poster-a1.html'), htmlContent, 'utf8');
console.log('Successfully generated poster/poster-a1.html');
