import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');

const bannerLogoBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'official_banner_logos.jpg'));
const bannerLogoBase64 = `data:image/jpeg;base64,${bannerLogoBuffer.toString('base64')}`;

const previewBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'dashboard_preview.png'));
const previewBase64 = `data:image/png;base64,${previewBuffer.toString('base64')}`;

const qrBuffer = fs.readFileSync(path.join(workspaceDir, 'public', 'qr-code.png'));
const qrBase64 = `data:image/png;base64,${qrBuffer.toString('base64')}`;

const member1Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member1.jpg'));
const member1Base64 = `data:image/jpeg;base64,${member1Buffer.toString('base64')}`;

const member2Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member2.jpg'));
const member2Base64 = `data:image/jpeg;base64,${member2Buffer.toString('base64')}`;

const member3Buffer = fs.readFileSync(path.join(workspaceDir, 'public', 'member3.jpg'));
const member3Base64 = `data:image/jpeg;base64,${member3Buffer.toString('base64')}`;

const html = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vertical AI Video Reel (Bahasa Melayu &amp; English) — Dashboard ADTEC Melaka</title>
  
  <!-- WhatsApp & Social Media Rich Preview Meta Tags -->
  <meta property="og:title" content="🎬 Video Inovasi: Dashboard ADTEC Melaka (CIFPEC 2026)">
  <meta property="og:description" content="Persembahan video inovasi digital TVET berasaskan AI (PTA 2). Hab maklumat kampus &amp; Lost &amp; Found pintar masa nyata.">
  <meta property="og:image" content="https://dashboard-information-nu.vercel.app/dashboard_preview.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://dashboard-information-nu.vercel.app/video">
  <meta property="og:type" content="video.other">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #04060d;
      --card-bg: rgba(13, 18, 36, 0.92);
      --border: rgba(99, 102, 241, 0.35);
      --border-glow: rgba(56, 189, 248, 0.6);
      --primary: #6366f1;
      --cyan: #38bdf8;
      --emerald: #10b981;
      --rose: #f43f5e;
      --amber: #f59e0b;
      --purple: #a855f7;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 20%, #0d1329 0%, #04060d 100%);
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow-x: hidden;
    }

    /* TOP DOCK TOOLBAR */
    .top-dock {
      width: 100%;
      max-width: 900px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 14px;
      background: rgba(15, 23, 42, 0.88);
      border: 1px solid var(--border);
      padding: 10px 20px;
      border-radius: 16px;
      backdrop-filter: blur(14px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .badge-cifpec {
      background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
      color: white;
      font-size: 11px;
      font-weight: 800;
      padding: 5px 12px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
    }
    .badge-cifpec::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #fff;
      animation: pulseDot 1.5s infinite;
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(0.7); }
    }
    .lang-switcher {
      display: flex;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      padding: 3px;
    }
    .lang-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 5px 12px;
      border-radius: 7px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s;
    }
    .lang-btn.active {
      background: var(--primary);
      color: #fff;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
    }
    .btn-action {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      padding: 7px 15px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.25s ease;
    }
    .btn-action:hover {
      background: var(--primary);
      border-color: var(--cyan);
      transform: translateY(-1px);
    }
    .btn-action.play-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border: none;
      font-size: 14px;
      padding: 8px 20px;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
    }
    .btn-action.rec-btn {
      background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
      border: none;
      box-shadow: 0 4px 20px rgba(244, 63, 94, 0.4);
    }

    /* 9:16 VERTICAL VIDEO CONTAINER */
    .reel-viewport {
      width: 100%;
      max-width: 440px;
      aspect-ratio: 9 / 16;
      height: min(88vh, 830px);
      background: #060914;
      border: 2px solid rgba(99, 102, 241, 0.4);
      border-radius: 34px;
      overflow: hidden;
      position: relative;
      box-shadow: 0 30px 80px rgba(0,0,0,0.9), 0 0 60px rgba(99, 102, 241, 0.25);
      display: flex;
      flex-direction: column;
      user-select: none;
    }

    /* PARTICLES CANVAS */
    #particlesCanvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
      opacity: 0.65;
    }

    /* TOP PROGRESS BAR */
    .reel-progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 5px;
      background: rgba(255,255,255,0.12);
      z-index: 100;
    }
    .reel-progress-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #38bdf8, #6366f1, #10b981);
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.8);
      transition: width 0.1s linear;
    }

    /* PHONE STATUS / NOTCH */
    .reel-notch-bar {
      position: absolute;
      top: 8px;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      color: rgba(255, 255, 255, 0.85);
      z-index: 95;
    }
    .notch-pill {
      background: #000;
      border: 1px solid rgba(255,255,255,0.1);
      width: 80px;
      height: 16px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
    }
    .camera-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #1e293b;
      border: 1px solid #475569;
    }

    /* INSTITUTION LOGO STRIP */
    .inst-top-strip {
      position: absolute;
      top: 34px;
      left: 18px;
      right: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 90;
    }
    .strip-logo-box {
      background: #ffffff;
      padding: 4px 8px;
      border-radius: 8px;
      height: 28px;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .strip-logo-box img {
      height: 100%;
      object-fit: contain;
    }
    .strip-tag {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid var(--border);
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 10.5px;
      font-weight: 800;
      color: var(--cyan);
      backdrop-filter: blur(8px);
    }

    /* SCENES CONTAINER */
    .scene-view {
      display: none;
      flex: 1;
      padding: 70px 22px 145px 22px;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      z-index: 10;
    }
    .scene-view.active {
      display: flex;
      animation: sceneZoomIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes sceneZoomIn {
      0% { opacity: 0; transform: scale(0.94) translateY(12px); filter: blur(4px); }
      100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
    }

    /* GLOWING AURORA SPHERES */
    .glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(60px);
      pointer-events: none;
      z-index: 1;
      opacity: 0.35;
      animation: floatOrb 8s infinite alternate ease-in-out;
    }
    .orb-1 { width: 180px; height: 180px; background: #4f46e5; top: 15%; left: 5%; }
    .orb-2 { width: 160px; height: 160px; background: #06b6d4; bottom: 25%; right: 5%; }
    @keyframes floatOrb {
      from { transform: translate(0, 0); }
      to { transform: translate(25px, -25px); }
    }

    /* SCENE 1: HOOK & SIMULATED NOTIFICATIONS */
    .hook-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(244, 63, 94, 0.16);
      border: 1px solid rgba(244, 63, 94, 0.45);
      color: #fb7185;
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    .hook-title {
      font-size: 26px;
      font-weight: 900;
      line-height: 1.2;
      background: linear-gradient(135deg, #ffffff 30%, #e2e8f0 70%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 10px 0 6px 0;
    }

    /* NOTIFICATION CARDS */
    .noti-bubble {
      background: rgba(30, 41, 59, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 3.5px solid var(--rose);
      border-radius: 12px;
      padding: 10px 14px;
      display: flex;
      gap: 12px;
      align-items: center;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.3);
      animation: dropNoti 0.4s ease-out;
    }
    @keyframes dropNoti {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .noti-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    .noti-avatar.wa { background: #22c55e; color: #fff; }
    .noti-avatar.warn { background: #f43f5e; color: #fff; }
    .noti-avatar.priv { background: #f59e0b; color: #000; }
    .noti-content h4 {
      font-size: 12.5px;
      font-weight: 800;
      color: #fff;
      display: flex;
      justify-content: space-between;
    }
    .noti-content p {
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.35;
      margin-top: 2px;
    }

    /* HERO CALLOUT BOX */
    .hero-callout-box {
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%);
      border: 1.5px solid var(--primary);
      border-radius: 14px;
      padding: 12px 16px;
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.25);
      text-align: center;
    }
    .hero-callout-box span {
      font-size: 10.5px;
      font-weight: 800;
      color: var(--cyan);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .hero-callout-box h3 {
      font-size: 17px;
      font-weight: 900;
      color: #fff;
      margin-top: 2px;
    }

    /* SCENE 2: SYSTEM ARCHITECTURE & DEVICES */
    .tech-pill-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
      margin: 12px 0;
    }
    .tp-card {
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 12px 10px;
      text-align: center;
      transition: 0.2s;
    }
    .tp-card:hover {
      border-color: var(--cyan);
      transform: translateY(-2px);
    }
    .tp-card span.tp-icon {
      font-size: 22px;
      display: block;
      margin-bottom: 4px;
    }
    .tp-card h5 {
      font-size: 12.5px;
      font-weight: 800;
      color: #fff;
    }
    .tp-card p {
      font-size: 10.5px;
      color: var(--cyan);
      margin-top: 2px;
    }

    /* DEVICES SUPPORT MOCKUP */
    .devices-strip {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      text-align: center;
    }
    .dev-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .dev-item span.di-icon {
      font-size: 20px;
    }
    .dev-item span.di-lbl {
      font-size: 10.5px;
      font-weight: 700;
      color: #e2e8f0;
    }

    /* SCENE 3: LIVE DEMO & INTERACTIVE SIMULATION */
    .mockup-window {
      background: #0f172a;
      border: 1.5px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 12px 30px rgba(0,0,0,0.6);
    }
    .mock-titlebar {
      background: #1e293b;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .mock-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
    }
    .mock-dot.r { background: #f43f5e; }
    .mock-dot.y { background: #f59e0b; }
    .mock-dot.g { background: #10b981; }
    .mock-url {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px;
      color: var(--cyan);
      margin-left: 6px;
    }
    .mockup-window img {
      width: 100%;
      height: 145px;
      object-fit: cover;
      display: block;
    }

    /* SIMULATED TICKER */
    .ticker-bar-mock {
      background: #090e1d;
      border-top: 1px solid var(--border);
      padding: 6px 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
      font-size: 10.5px;
      color: #38bdf8;
      font-weight: 700;
    }
    .ticker-tag {
      background: var(--primary);
      color: #fff;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 800;
      flex-shrink: 0;
    }
    .ticker-text {
      white-space: nowrap;
      animation: scrollTicker 12s linear infinite;
    }
    @keyframes scrollTicker {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }

    /* SIMULATED IN-APP CHAT (SCENE 3) */
    .chat-sim-box {
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .chat-bubble {
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 11px;
      max-width: 85%;
      line-height: 1.35;
    }
    .chat-bubble.in {
      background: #1e293b;
      color: #e2e8f0;
      align-self: flex-start;
      border-left: 2.5px solid var(--cyan);
    }
    .chat-bubble.out {
      background: #4338ca;
      color: #fff;
      align-self: flex-end;
    }
    .chat-bubble.bot {
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #a7f3d0;
      align-self: center;
      width: 100%;
      text-align: center;
      font-size: 10px;
      font-weight: 700;
    }

    /* SCENE 4: METRICS & GREEN CAMPUS */
    .metrics-2x2-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 10px 0;
    }
    .metric-m-card {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px 12px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .metric-m-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, var(--cyan), var(--primary));
    }
    .mm-val {
      font-family: 'JetBrains Mono', monospace;
      font-size: 26px;
      font-weight: 900;
      color: var(--cyan);
    }
    .mm-val.green { color: var(--emerald); }
    .mm-val.purple { color: var(--purple); }
    .mm-title {
      font-size: 11.5px;
      font-weight: 800;
      color: #fff;
      margin-top: 2px;
    }
    .mm-sub {
      font-size: 9.5px;
      color: var(--text-muted);
    }

    /* SCENE 5: SCALABILITY & QR CODE */
    .qr-hero-box {
      background: #ffffff;
      padding: 14px;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      margin: 10px auto;
      max-width: 210px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.6), 0 0 30px rgba(99, 102, 241, 0.35);
      animation: pulseQr 2.5s infinite alternate ease-in-out;
    }
    @keyframes pulseQr {
      0% { transform: scale(1); box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
      100% { transform: scale(1.03); box-shadow: 0 0 35px rgba(56, 189, 248, 0.6); }
    }
    .qr-hero-box img {
      width: 145px;
      height: 145px;
      object-fit: contain;
    }
    .qr-hero-url {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px;
      font-weight: 800;
      color: #0f172a;
      background: #e2e8f0;
      padding: 3px 8px;
      border-radius: 4px;
    }

    /* TEAM MEMBERS MINI ROW (SCENE 5) */
    .team-mini-row {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 6px;
    }
    .team-avatar-mini {
      width: 38px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
      border: 1.5px solid var(--cyan);
      box-shadow: 0 4px 10px rgba(0,0,0,0.4);
    }
    .team-avatar-mini img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* CAPTIONS OVERLAY (KINETIC TIKTOK / REELS STYLE) */
    .reel-caption-overlay {
      position: absolute;
      bottom: 22px;
      left: 16px;
      right: 16px;
      z-index: 80;
      text-align: center;
    }
    .caption-box {
      background: rgba(10, 15, 30, 0.94);
      border: 1.5px solid rgba(99, 102, 241, 0.5);
      border-radius: 16px;
      padding: 10px 14px;
      backdrop-filter: blur(14px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(99, 102, 241, 0.2);
    }
    .caption-text {
      font-size: 13.5px;
      font-weight: 800;
      line-height: 1.45;
      color: #f8fafc;
    }
    .caption-highlight {
      color: #fde047;
      text-shadow: 0 0 12px rgba(250, 204, 21, 0.5);
      background: rgba(250, 204, 21, 0.15);
      padding: 1px 6px;
      border-radius: 4px;
    }

    /* AUDIO CONTROLS DOCK */
    .audio-player-dock {
      margin-top: 14px;
      width: 100%;
      max-width: 440px;
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .wave-anim {
      display: flex;
      align-items: center;
      gap: 3px;
      height: 20px;
    }
    .wave-bar {
      width: 3.5px;
      height: 6px;
      background: var(--cyan);
      border-radius: 2px;
      transition: height 0.1s;
    }
    .playing .wave-bar {
      animation: wavePulse 0.75s infinite ease-in-out alternate;
    }
    .playing .wave-bar:nth-child(2) { animation-delay: 0.15s; }
    .playing .wave-bar:nth-child(3) { animation-delay: 0.3s; }
    .playing .wave-bar:nth-child(4) { animation-delay: 0.45s; }
    @keyframes wavePulse {
      from { height: 4px; }
      to { height: 20px; background: var(--emerald); }
    }

    /* RECORDING BADGE */
    .rec-indicator {
      display: none;
      align-items: center;
      gap: 6px;
      background: rgba(244, 63, 94, 0.2);
      border: 1px solid var(--rose);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 999px;
    }
    .rec-indicator.active {
      display: flex;
    }
    .rec-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--rose);
      animation: blinkRec 0.8s infinite;
    }
    @keyframes blinkRec {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
  </style>
</head>
<body>

  <!-- TOP TOOLBAR -->
  <header class="top-dock">
    <div style="display:flex; align-items:center; gap:12px;">
      <span class="badge-cifpec">CITEC / CIFPEC 2026</span>
      <div>
        <div style="font-size:14px; font-weight:800; color:#fff;">Vertical AI Pitch Reel (9:16)</div>
        <div style="font-size:11px; color:var(--cyan);">Dashboard ADTEC Melaka • Inovasi TVET</div>
      </div>
    </div>

    <!-- LANGUAGE SWITCHER -->
    <div class="lang-switcher">
      <button class="lang-btn active" id="btnBm" onclick="switchLanguage('bm')">🇲🇾 Bahasa Melayu</button>
      <button class="lang-btn" id="btnEn" onclick="switchLanguage('en')">🇬🇧 English</button>
    </div>

    <div style="display:flex; align-items:center; gap:8px;">
      <div class="rec-indicator" id="recBadge">
        <span class="rec-dot"></span>
        <span id="recText">RECORDING</span>
      </div>
      <button class="btn-action play-btn" id="btnMainPlay" onclick="togglePlay()">▶️ Play Suara AI</button>
      <button class="btn-action rec-btn" id="btnRec" onclick="toggleRecordVideo()">🎥 Rakam &amp; Export Video</button>
      <button class="btn-action" onclick="toggleFullscreen()">⛶ Fullscreen</button>
    </div>
  </header>

  <!-- 9:16 VERTICAL REEL VIEWPORT -->
  <main class="reel-viewport" id="reelContainer">

    <!-- PARTICLES CANVAS -->
    <canvas id="particlesCanvas"></canvas>

    <!-- GLOWING ORBS -->
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>

    <!-- TOP PROGRESS BAR -->
    <div class="reel-progress-bar">
      <div class="reel-progress-fill" id="progressFill"></div>
    </div>

    <!-- PHONE STATUS / NOTCH -->
    <div class="reel-notch-bar">
      <span>12:45</span>
      <div class="notch-pill">
        <div class="camera-dot"></div>
      </div>
      <span style="display:flex; align-items:center; gap:4px;">5G • 100% 🔋</span>
    </div>

    <!-- INSTITUTION STRIP -->
    <div class="inst-top-strip">
      <div class="strip-logo-box">
        <img src="${bannerLogoBase64}" alt="Logo Rasmi">
      </div>
      <div class="strip-tag" id="timerTag">0:00 / 3:18</div>
    </div>

    <!-- ==========================================
         SCENE 1: HOOK & CAMPUS PROBLEM
         ========================================== -->
    <section class="scene-view active" id="scene-1">
      <div>
        <span class="hook-badge" id="lblScene1">⚠️ Isu &amp; Cabaran Kampus</span>
        <h1 class="hook-title" id="titleScene1">Terlepas Hebahan Kolej? Barang Hilang di Bengkel?</h1>
        <p style="font-size:11.5px; color:var(--text-muted); line-height:1.4;" id="descScene1">
          Kaedah konvensional menyebabkan maklumat penting tenggelam dan mendedahkan privasi pelajar.
        </p>
      </div>

      <!-- SIMULATED NOTIFICATIONS STACK -->
      <div style="display:flex; flex-direction:column; gap:9px; margin:10px 0;">
        <div class="noti-bubble">
          <div class="noti-avatar wa">💬</div>
          <div class="noti-content" style="flex:1;">
            <h4><span>Grup WhatsApp Kolej</span> <span style="font-size:9.5px; color:#22c55e;">1,429 mesej</span></h4>
            <p>"Siapa ada nampak kunci motor Yamaha tertinggal kat bengkel tadi?"</p>
          </div>
        </div>

        <div class="noti-bubble" style="border-left-color:var(--amber);">
          <div class="noti-avatar priv">🔒</div>
          <div class="noti-content" style="flex:1;">
            <h4><span>Risiko Privasi Nombor Telefon</span> <span style="font-size:9.5px; color:var(--amber);">BAHAYA</span></h4>
            <p>Berkongsi nombor telefon di grup awam mendedahkan pelajar kepada ancaman scam.</p>
          </div>
        </div>

        <div class="noti-bubble" style="border-left-color:var(--rose);">
          <div class="noti-avatar warn">📄</div>
          <div class="noti-content" style="flex:1;">
            <h4><span>Papan Notis Kertas Rosak</span> <span style="font-size:9.5px; color:var(--rose);">MEMBAZIR</span></h4>
            <p>Notis kertas mudah koyak, lapuk dan membebankan kos cetakan kolej.</p>
          </div>
        </div>
      </div>

      <!-- HERO CALLOUT BOX -->
      <div class="hero-callout-box">
        <span id="calloutTag">💡 PENYELESAIAN PINTAR TVET</span>
        <h3>DASHBOARD ADTEC MELAKA</h3>
      </div>
    </section>

    <!-- ==========================================
         SCENE 2: SOLUTION & ARCHITECTURE
         ========================================== -->
    <section class="scene-view" id="scene-2">
      <div>
        <span class="hook-badge" style="background:rgba(56,189,248,0.16); border-color:rgba(56,189,248,0.45); color:var(--cyan);" id="lblScene2">🚀 Inovasi Digital</span>
        <h2 class="hook-title" style="background:linear-gradient(135deg, #38bdf8 0%, #818cf8 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;" id="titleScene2">
          Hab Kampus Digital &amp; Lost-Found Pintar
        </h2>
        <p style="font-size:11.5px; color:var(--text-muted); line-height:1.4;" id="descScene2">
          Dikuasakan seni bina pangkalan data awan moden dan Kecerdasan Buatan (AI).
        </p>
      </div>

      <!-- TECH GRID -->
      <div class="tech-pill-grid">
        <div class="tp-card">
          <span class="tp-icon">⚛️</span>
          <h5>React 19 + Vite</h5>
          <p>PWA Sangat Pantas</p>
        </div>
        <div class="tp-card">
          <span class="tp-icon">⚡</span>
          <h5>Supabase Cloud</h5>
          <p>WebSockets Masa Nyata</p>
        </div>
        <div class="tp-card">
          <span class="tp-icon">🤖</span>
          <h5>Google Gemini AI</h5>
          <p>Bot Pembantu 24 Jam</p>
        </div>
        <div class="tp-card">
          <span class="tp-icon">🛡️</span>
          <h5>Keselamatan OTP &amp; RLS</h5>
          <p>Privasi Data Terpelihara</p>
        </div>
      </div>

      <!-- DEVICES DISPLAY -->
      <div class="devices-strip">
        <div class="dev-item">
          <span class="di-icon">📱</span>
          <span class="di-lbl">Telefon PWA</span>
        </div>
        <div class="dev-item">
          <span class="di-icon">💻</span>
          <span class="di-lbl">Portal Web</span>
        </div>
        <div class="dev-item">
          <span class="di-icon">📺</span>
          <span class="di-lbl">Kiosk TV Kampus</span>
        </div>
      </div>
    </section>

    <!-- ==========================================
         SCENE 3: LIVE DEMO & SIMULATION
         ========================================== -->
    <section class="scene-view" id="scene-3">
      <div>
        <span class="hook-badge" style="background:rgba(16,185,129,0.16); border-color:rgba(16,185,129,0.45); color:var(--emerald);" id="lblScene3">✨ Demonstrasi Sistem Sebenar</span>
        <h2 style="font-size:21px; font-weight:900; color:#fff; margin-top:6px;" id="titleScene3">Ekosistem Pintar Beroperasi</h2>
      </div>

      <!-- LIVE BROWSER MOCKUP -->
      <div class="mockup-window">
        <div class="mock-titlebar">
          <span class="mock-dot r"></span>
          <span class="mock-dot y"></span>
          <span class="mock-dot g"></span>
          <span class="mock-url">dashboard-information-nu.vercel.app</span>
        </div>
        <img src="${previewBase64}" alt="Preview Web">
        <div class="ticker-bar-mock">
          <span class="ticker-tag">KIOSK TV</span>
          <div class="ticker-text">
            📢 Pendaftaran Semester Baharu • 🔍 Dijumpai: Kunci Motor Yamaha di Surau • ⏰ 12:45 PM
          </div>
        </div>
      </div>

      <!-- IN-APP CHAT & AI DEMO -->
      <div class="chat-sim-box">
        <div class="chat-bubble in">
          "Salam bro, saya jumpa kunci motor ni dekat Surau."
        </div>
        <div class="chat-bubble out">
          "Alhamdulillah! Keychain warna merah PROTON ke bro?"
        </div>
        <div class="chat-bubble bot">
          🤖 AdtecBot: "Dilindungi Sembang Sulit Terbina. Nombor telefon tidak didedahkan."
        </div>
      </div>
    </section>

    <!-- ==========================================
         SCENE 4: METRICS & GREEN CAMPUS
         ========================================== -->
    <section class="scene-view" id="scene-4">
      <div>
        <span class="hook-badge" style="background:rgba(16,185,129,0.16); border-color:rgba(16,185,129,0.45); color:var(--emerald);" id="lblScene4">🌿 Kampus Hijau &amp; Nilai Tambah</span>
        <h2 class="hook-title" style="color:#fff;" id="titleScene4">Impak Ketara &amp; Kelestarian</h2>
      </div>

      <div class="metrics-2x2-grid">
        <div class="metric-m-card">
          <div class="mm-val green">90%</div>
          <div class="mm-title" id="m1Title">Penjimatan Kertas</div>
          <div class="mm-sub" id="m1Sub">Sifar notis fizikal</div>
        </div>
        <div class="metric-m-card">
          <div class="mm-val">100%</div>
          <div class="mm-title" id="m2Title">Masa Nyata</div>
          <div class="mm-sub" id="m2Sub">Tolakan data awan serta-merta</div>
        </div>
        <div class="metric-m-card">
          <div class="mm-val purple">0</div>
          <div class="mm-title" id="m3Title">Ketirisan Privasi</div>
          <div class="mm-sub" id="m3Sub">Sembang dalaman terlindung</div>
        </div>
        <div class="metric-m-card">
          <div class="mm-val green">3x</div>
          <div class="mm-title" id="m4Title">Pemulangan Pantas</div>
          <div class="mm-sub" id="m4Sub">Minggu ➔ Jam</div>
        </div>
      </div>

      <div style="background:rgba(30,41,59,0.7); border:1px solid var(--border); border-radius:12px; padding:10px; text-align:center;">
        <span style="font-size:11px; font-weight:700; color:var(--emerald);">🌱 Matlamat Pembangunan Mampan PBB: SDG 12 &amp; SDG 9</span>
      </div>
    </section>

    <!-- ==========================================
         SCENE 5: SCALABILITY & QR CODE
         ========================================== -->
    <section class="scene-view" id="scene-5">
      <div>
        <span class="hook-badge" id="lblScene5">🎓 Kebolehskalaan TVET</span>
        <h2 style="font-size:22px; font-weight:900; color:#fff; margin-top:4px;" id="titleScene5">Sedia Direplikasi ke 33 ILJTM</h2>
        <p style="font-size:11px; color:var(--text-muted);" id="descScene5">
          Seni bina awan modular sedia diperluas ke semua institusi latihan seluruh negara.
        </p>
      </div>

      <!-- QR CODE CARD -->
      <div class="qr-hero-box">
        <span style="font-size:9.5px; font-weight:800; color:#0f172a; text-transform:uppercase;" id="qrLabel">IMBAS UNTUK UJI PORTAL LIVE</span>
        <img src="${qrBase64}" alt="QR Code">
        <span class="qr-hero-url">dashboard-information-nu.vercel.app</span>
      </div>

      <!-- TEAM MEMBERS ROW -->
      <div style="text-align:center;">
        <div style="font-size:11.5px; font-weight:800; color:var(--cyan); margin-bottom:4px;">PROJEK TAHUN AKHIR 2 • CIFPEC 2026</div>
        <div class="team-mini-row">
          <div class="team-avatar-mini" title="Muhammad Adam Darwish"><img src="${member1Base64}" alt="Adam"></div>
          <div class="team-avatar-mini" title="Hazim Afiq"><img src="${member2Base64}" alt="Hazim"></div>
          <div class="team-avatar-mini" title="Muhammad Syahmi"><img src="${member3Base64}" alt="Syahmi"></div>
        </div>
      </div>
    </section>

    <!-- KINETIC CAPTIONS OVERLAY (REELS / TIKTOK STYLE) -->
    <div class="reel-caption-overlay">
      <div class="caption-box">
        <p class="caption-text" id="captionText">
          Tekan <span class="caption-highlight">▶️ Play Suara AI</span> untuk memulakan persembahan.
        </p>
      </div>
    </div>

  </main>

  <!-- AUDIO CONTROLS DOCK -->
  <div class="audio-player-dock" id="audioDock">
    <div style="display:flex; align-items:center; gap:12px;">
      <div class="wave-anim" id="waveAnim">
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
        <div class="wave-bar"></div>
      </div>
      <div>
        <div style="font-size:12.5px; font-weight:800; color:#fff;" id="audioTrackTitle">Suara AI: Bahasa Melayu (Aoede)</div>
        <div style="font-size:10px; color:var(--cyan);" id="audioTrackSub">Master Pitch Audio • Durasi 3m 18s (Format CIFPEC)</div>
      </div>
    </div>

    <audio id="audioEl" src="audio/full_voiceover_bahasa_melayu.wav" preload="auto"></audio>

    <div style="display:flex; align-items:center; gap:8px;">
      <button class="btn-action" style="padding:5px 10px; font-size:12px;" onclick="seekAudio(-5)">-5s</button>
      <button class="btn-action" style="padding:5px 10px; font-size:12px;" onclick="seekAudio(5)">+5s</button>
    </div>
  </div>

  <script>
    const audio = document.getElementById('audioEl');
    const playBtn = document.getElementById('btnMainPlay');
    const recBtn = document.getElementById('btnRec');
    const progressFill = document.getElementById('progressFill');
    const timerTag = document.getElementById('timerTag');
    const captionText = document.getElementById('captionText');
    const audioDock = document.getElementById('audioDock');
    const recBadge = document.getElementById('recBadge');
    const audioTrackTitle = document.getElementById('audioTrackTitle');
    const audioTrackSub = document.getElementById('audioTrackSub');

    let currentLang = 'bm';

    // TIMESTAMPS FOR BAHASA MELAYU (Durasi ~197.5s = 3m 18s)
    const scenesBM = [
      { id: 'scene-1', start: 0, end: 43.0 },
      { id: 'scene-2', start: 43.0, end: 81.0 },
      { id: 'scene-3', start: 81.0, end: 132.6 },
      { id: 'scene-4', start: 132.6, end: 162.8 },
      { id: 'scene-5', start: 162.8, end: 197.5 }
    ];

    const captionsBM = [
      { start: 0, text: "Assalamualaikum dan salam sejahtera kepada <span class='caption-highlight'>barisan panel penilai CIFPEC 2026</span>." },
      { start: 5, text: "Kami dari ADTEC Melaka mempersembahkan inovasi <span class='caption-highlight'>Dashboard ADTEC Melaka</span>." },
      { start: 12, text: "Pernahkah anda terlepas hebahan penting kolej kerana <span class='caption-highlight'>tertimbus dalam ratusan mesej WhatsApp</span>?" },
      { start: 20, text: "Atau anda pernah kehilangan <span class='caption-highlight'>kunci kenderaan, kad matrik, atau laptop</span> di bengkel kolej?" },
      { start: 29, text: "Kaedah konvensional menggunakan <span class='caption-highlight'>papan kenyataan kertas yang mudah rosak</span>..." },
      { start: 35, text: "Manakala berkongsi nombor di grup awam <span class='caption-highlight'>mendedahkan privasi kepada penipuan</span>." },
      { start: 39, text: "Atas faktor inilah, kami membangunkan <span class='caption-highlight'>penyelesaian pintar bersepadu ini</span>!" },

      { start: 43, text: "Dashboard ADTEC Melaka ialah <span class='caption-highlight'>hab kampus digital mesra alam</span>." },
      { start: 51, text: "Menyatukan hebahan rasmi kolej, <span class='caption-highlight'>Kiosk TV digital</span>, dan penjejakan Lost &amp; Found berkuasa AI." },
      { start: 61, text: "Dibangunkan dengan <span class='caption-highlight'>React 19, Supabase Realtime, dan Google Gemini AI</span>." },
      { start: 72, text: "Sokongan <span class='caption-highlight'>Progressive Web App (PWA)</span> membolehkan pemasangan terus di telefon pintar!" },

      { start: 81, text: "Bagaimanakah sistem ini berfungsi? Pertama, layari dashboard untuk <span class='caption-highlight'>memo rasmi dan aktiviti kolej</span>." },
      { start: 91, text: "Kedua, <span class='caption-highlight'>Mod Kiosk TV</span> beroperasi di lobi dan kafeteria berserta jam masa nyata dan berita bergulir." },
      { start: 103, text: "Ketiga, muat naik foto dan lokasi barang tercicir secara <span class='caption-highlight'>langsung kepada seluruh warga kolej</span>." },
      { start: 114, text: "Akhir sekali, tuntut barangan melalui <span class='caption-highlight'>ruang sembang tertutup tanpa dedah nombor telefon</span>!" },
      { start: 123, text: "Pembantu maya <span class='caption-highlight'>AdtecBot AI (Gemini)</span> sedia menjawab seputar pertanyaan kampus 24 jam sehari." },

      { start: 132.6, text: "Inovasi ini menyokong <span class='caption-highlight'>inisiatif Kampus Hijau</span> dengan mengurangkan 90% cetakan kertas notis!" },
      { start: 142, text: "Keselamatan data dipelihara dengan <span class='caption-highlight'>OTP e-mel rasmi dan Row Level Security Supabase</span>." },
      { start: 152, text: "Tempoh pemulangan barangan tercicir disingkatkan daripada <span class='caption-highlight'>berminggu-minggu kepada beberapa jam</span>!" },

      { start: 162.8, text: "Seni bina modular sedia direplikasi ke <span class='caption-highlight'>kesemua 33 buah institusi latihan JTM &amp; politeknik</span>!" },
      { start: 173, text: "Mentransformasikan tadbir urus kampus ke arah <span class='caption-highlight'>ekosistem TVET yang pintar, selamat dan mampan</span>." },
      { start: 182, text: "<span class='caption-highlight'>Imbas kod QR di skrin anda</span> sekarang untuk mencuba sistem live!" },
      { start: 190, text: "Sekian, <span class='caption-highlight'>terima kasih kepada barisan panel penilai CIFPEC 2026</span>!" }
    ];

    // TIMESTAMPS FOR ENGLISH (Durasi ~173s = 2m 53s)
    const scenesEN = [
      { id: 'scene-1', start: 0, end: 33.2 },
      { id: 'scene-2', start: 33.2, end: 69.4 },
      { id: 'scene-3', start: 69.4, end: 117.0 },
      { id: 'scene-4', start: 117.0, end: 142.7 },
      { id: 'scene-5', start: 142.7, end: 173.0 }
    ];

    const captionsEN = [
      { start: 0, text: "Have you ever faced problems such as <span class='caption-highlight'>missing critical campus announcements</span>?" },
      { start: 6, text: "Or have you ever lost your <span class='caption-highlight'>vehicle keys, matric card, or laptop</span> in college workshops?" },
      { start: 15, text: "Traditional methods rely on <span class='caption-highlight'>damaged paper posters</span> or chat groups where sharing numbers leaks privacy." },
      { start: 24, text: "That is why our team at ADTEC Melaka created <span class='caption-highlight'>Dashboard ADTEC Melaka</span>!" },

      { start: 33.2, text: "Dashboard ADTEC Melaka is an <span class='caption-highlight'>eco-friendly digital campus hub</span>." },
      { start: 42, text: "Built with <span class='caption-highlight'>React 19, Supabase Realtime, and Google Gemini AI</span>." },
      { start: 52, text: "Delivering instant live data without requiring any page refreshes!" },
      { start: 60, text: "With <span class='caption-highlight'>Progressive Web App (PWA)</span> support, install directly on Android and iOS." },

      { start: 69.4, text: "So, <span class='caption-highlight'>how does it work?</span> First, access categorized administrative notices &amp; events." },
      { start: 80, text: "Second, our <span class='caption-highlight'>TV Kiosk mode</span> runs on displays with automated news tickers." },
      { start: 90, text: "Third, report misplaced items instantly with <span class='caption-highlight'>photos &amp; location tags</span>." },
      { start: 100, text: "Lastly, claim items through <span class='caption-highlight'>built-in private chat</span> without exposing phone numbers!" },
      { start: 108, text: "Plus, our 24/7 AI virtual assistant <span class='caption-highlight'>AdtecBot</span> guides students on campus procedures." },

      { start: 117.0, text: "Not only does it eliminate communication delays with <span class='caption-highlight'>100% realtime sync</span>..." },
      { start: 125, text: "It champions the <span class='caption-highlight'>Green Campus initiative</span>, cutting paper waste by up to 90%!" },
      { start: 133, text: "Security is safeguarded by <span class='caption-highlight'>email OTP verification</span> and Supabase Row Level Security." },

      { start: 142.7, text: "Its modular design enables seamless replication across <span class='caption-highlight'>all 33 ILJTM institutes</span> nationwide!" },
      { start: 154, text: "Dashboard ADTEC Melaka transforms campus administration into a <span class='caption-highlight'>smart TVET environment</span>." },
      { start: 162, text: "<span class='caption-highlight'>Scan the QR code now</span> to test the live portal. Thank you to the CIFPEC judging panel!" }
    ];

    function switchLanguage(lang) {
      currentLang = lang;
      const wasPlaying = !audio.paused;
      audio.pause();

      if (lang === 'bm') {
        document.getElementById('btnBm').classList.add('active');
        document.getElementById('btnEn').classList.remove('active');
        audio.src = 'audio/full_voiceover_bahasa_melayu.wav';
        audioTrackTitle.innerText = 'Suara AI: Bahasa Melayu (Aoede)';
        audioTrackSub.innerText = 'Master Pitch Audio • Durasi 3m 18s (Format CIFPEC Rasmi)';
        timerTag.innerText = '0:00 / 3:18';
        captionText.innerHTML = 'Tekan <span class="caption-highlight">▶️ Play Suara AI</span> untuk memulakan persembahan.';
        playBtn.innerText = '▶️ Play Suara AI';
      } else {
        document.getElementById('btnEn').classList.add('active');
        document.getElementById('btnBm').classList.remove('active');
        audio.src = 'audio/full_citec_style_voiceover.wav';
        audioTrackTitle.innerText = 'AI Voiceover: English (Aoede)';
        audioTrackSub.innerText = 'Master Pitch Audio • Durasi 2m 53s (CITEC Style)';
        timerTag.innerText = '0:00 / 2:53';
        captionText.innerHTML = 'Press <span class="caption-highlight">▶️ Play AI Pitch</span> to start presentation.';
        playBtn.innerText = '▶️ Play AI Pitch';
      }

      audio.currentTime = 0;
      progressFill.style.width = '0%';
      currentSceneIdx = 0;
      document.querySelectorAll('.scene-view').forEach(el => el.classList.remove('active'));
      document.getElementById('scene-1').classList.add('active');

      if (wasPlaying) {
        audio.play().then(() => {
          playBtn.innerText = '⏸ Pause';
          audioDock.classList.add('playing');
        });
      } else {
        audioDock.classList.remove('playing');
      }
    }

    // WEB AUDIO SFX
    let audioCtx = null;
    function playSfx(type) {
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        if (type === 'whoosh') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.25);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'ping') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        }
      } catch (e) {}
    }

    let currentSceneIdx = 0;
    function togglePlay() {
      if (audio.paused) {
        audio.play().then(() => {
          playBtn.innerText = '⏸ Pause';
          audioDock.classList.add('playing');
          playSfx('ping');
        }).catch(err => {
          alert('Ralat memainkan audio: ' + err.message);
        });
      } else {
        audio.pause();
        playBtn.innerText = currentLang === 'bm' ? '▶️ Play Suara AI' : '▶️ Play AI Pitch';
        audioDock.classList.remove('playing');
      }
    }

    // TIMEUPDATE & DYNAMIC SYNC
    audio.addEventListener('timeupdate', () => {
      const cur = audio.currentTime;
      const scenesList = (currentLang === 'bm') ? scenesBM : scenesEN;
      const captionsList = (currentLang === 'bm') ? captionsBM : captionsEN;
      const totalDur = (currentLang === 'bm') ? 197.5 : 173.0;
      const dur = audio.duration || totalDur;

      // Update progress bar
      const pct = (cur / dur) * 100;
      progressFill.style.width = pct + '%';

      // Update timer
      const curM = Math.floor(cur / 60);
      const curS = String(Math.floor(cur % 60)).padStart(2, '0');
      const durM = Math.floor(dur / 60);
      const durS = String(Math.floor(dur % 60)).padStart(2, '0');
      timerTag.innerText = curM + ':' + curS + ' / ' + durM + ':' + durS;

      // Switch active scene
      for (let i = 0; i < scenesList.length; i++) {
        const sc = scenesList[i];
        if (cur >= sc.start && cur < sc.end) {
          if (currentSceneIdx !== i) {
            currentSceneIdx = i;
            document.querySelectorAll('.scene-view').forEach(el => el.classList.remove('active'));
            const target = document.getElementById(sc.id);
            if (target) target.classList.add('active');
            playSfx('whoosh');
          }
          break;
        }
      }

      // Update kinetic caption
      let activeCap = captionsList[0].text;
      for (let i = 0; i < captionsList.length; i++) {
        if (cur >= captionsList[i].start) {
          activeCap = captionsList[i].text;
        }
      }
      captionText.innerHTML = activeCap;
    });

    audio.addEventListener('ended', () => {
      playBtn.innerText = '🔄 Replay';
      audioDock.classList.remove('playing');
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    });

    function seekAudio(delta) {
      const totalDur = (currentLang === 'bm') ? 197.5 : 173.0;
      audio.currentTime = Math.max(0, Math.min(audio.duration || totalDur, audio.currentTime + delta));
      playSfx('whoosh');
    }

    function toggleFullscreen() {
      const c = document.getElementById('reelContainer');
      if (!document.fullscreenElement) {
        c.requestFullscreen ? c.requestFullscreen() : c.webkitRequestFullscreen();
      } else {
        document.exitFullscreen ? document.exitFullscreen() : null;
      }
    }

    // BACKGROUND PARTICLES CANVAS
    const pCanvas = document.getElementById('particlesCanvas');
    const ctx = pCanvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      pCanvas.width = pCanvas.offsetWidth;
      pCanvas.height = pCanvas.offsetHeight;
      initParticles();
    }
    window.addEventListener('resize', resizeCanvas);

    function initParticles() {
      particles = [];
      const count = 35;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * pCanvas.width,
          y: Math.random() * pCanvas.height,
          radius: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.5 + 0.2
        });
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
      ctx.fillStyle = 'rgba(56, 189, 248, ';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = pCanvas.width;
        if (p.x > pCanvas.width) p.x = 0;
        if (p.y < 0) p.y = pCanvas.height;
        if (p.y > pCanvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, ' + p.alpha + ')';
        ctx.fill();
      }

      // Constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 75) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(99, 102, 241, ' + (0.15 - dist / 500) + ')';
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    setTimeout(resizeCanvas, 100);
    requestAnimationFrame(animateParticles);

    // AUTO SCREEN RECORDER (EXPORT VIDEO)
    let mediaRecorder = null;
    let recordedChunks = [];

    async function toggleRecordVideo() {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        recBadge.classList.remove('active');
        btnRec.innerText = '🎥 Rakam & Export Video';
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 60, displaySurface: 'browser' },
          audio: true
        });

        recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const filename = (currentLang === 'bm') 
            ? 'Video-Inovasi-Dashboard-ADTEC-Melaka-BM.webm'
            : 'Video-Inovasi-Dashboard-ADTEC-Melaka-EN.webm';
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          recBadge.classList.remove('active');
          btnRec.innerText = '🎥 Rakam & Export Video';
          alert('Tahniah! Rakaman video inovasi berjaya dimuat turun ke folder Downloads anda!');
        };

        mediaRecorder.start();
        recBadge.classList.add('active');
        btnRec.innerText = '⏹ Henti Rakaman';

        audio.currentTime = 0;
        audio.play();
        playBtn.innerText = '⏸ Pause';
        audioDock.classList.add('playing');

      } catch (err) {
        alert('Untuk merakam secara manual tanpa perkongsian skrin, anda juga boleh menggunakan OBS Studio atau Xbox Game Bar (Win + G). Ralat: ' + err.message);
      }
    }
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(workspaceDir, 'video', 'vertical-reel.html'), html, 'utf8');
console.log('Berjaya mengemas kini video/vertical-reel.html dengan sokongan Dwi-Bahasa (BM & EN)!');
