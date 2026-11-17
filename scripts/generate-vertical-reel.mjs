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
    /* =====================================================
       v2 CINEMATIC UPGRADE — STAGGERED REVEALS, FX, OUTRO
       ===================================================== */
    .reel-progress-bar {
      top: 3px;
      height: 4px;
      background: transparent;
      display: flex;
      gap: 3px;
      padding: 0 8px;
    }
    .prog-seg {
      height: 100%;
      background: rgba(255,255,255,0.18);
      border-radius: 3px;
      overflow: hidden;
    }
    .prog-seg-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #38bdf8, #6366f1, #10b981);
      box-shadow: 0 0 8px rgba(56, 189, 248, 0.8);
    }
    .scene-chip {
      font-family: 'JetBrains Mono', monospace;
      color: #e2e8f0;
      background: rgba(99, 102, 241, 0.3);
      letter-spacing: 1px;
    }

    /* Staggered reveal (synced with voiceover via --d & --off) */
    .reveal { opacity: 0; }
    .scene-view.active .reveal {
      animation: revealUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
      animation-delay: calc(var(--d, 0s) - var(--off, 0s));
    }
    .scene-view.active .reveal.reveal-left { animation-name: revealLeft; }
    .scene-view.active .reveal.reveal-pop {
      animation-name: revealPop;
      animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes revealUp {
      0% { opacity: 0; transform: translateY(18px) scale(0.97); filter: blur(6px); }
      100% { opacity: 1; transform: none; filter: blur(0); }
    }
    @keyframes revealLeft {
      0% { opacity: 0; transform: translateX(-26px); filter: blur(6px); }
      100% { opacity: 1; transform: none; filter: blur(0); }
    }
    @keyframes revealPop {
      0% { opacity: 0; transform: scale(0.6); }
      100% { opacity: 1; transform: scale(1); }
    }

    /* Scene transition light sweep + vignette */
    .scene-flash {
      position: absolute;
      inset: 0;
      z-index: 86;
      pointer-events: none;
      opacity: 0;
      background: linear-gradient(115deg, transparent 30%, rgba(56,189,248,0.35) 47%, rgba(255,255,255,0.6) 50%, rgba(168,85,247,0.35) 53%, transparent 70%);
      background-size: 250% 100%;
    }
    .scene-flash.go { animation: flashSweep 0.75s ease-out; }
    @keyframes flashSweep {
      0% { opacity: 1; background-position: 120% 0; }
      100% { opacity: 0; background-position: -60% 0; }
    }
    .reel-vignette {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 3;
      background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%);
    }

    /* SCENE 0: CINEMATIC INTRO */
    .intro-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 14px;
      position: relative;
      z-index: 2;
    }
    .intro-ring {
      position: absolute;
      width: 330px;
      height: 330px;
      border-radius: 50%;
      border: 1px dashed rgba(99, 102, 241, 0.4);
      top: 42%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: spinRing 30s linear infinite;
      pointer-events: none;
    }
    .intro-ring::after {
      content: '';
      position: absolute;
      inset: 28px;
      border-radius: 50%;
      border: 1px solid rgba(56, 189, 248, 0.18);
    }
    @keyframes spinRing { to { transform: translate(-50%, -50%) rotate(360deg); } }
    .intro-logo {
      background: #ffffff;
      padding: 8px 14px;
      border-radius: 14px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 30px rgba(56, 189, 248, 0.3);
    }
    .intro-logo img { height: 44px; display: block; }
    .intro-kicker {
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 2.5px;
      color: var(--cyan);
      text-transform: uppercase;
    }
    .intro-title {
      font-size: 36px;
      font-weight: 900;
      line-height: 1.02;
      letter-spacing: -1px;
      background: linear-gradient(90deg, #ffffff 0%, #38bdf8 25%, #a855f7 50%, #38bdf8 75%, #ffffff 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmerText 4s linear infinite;
      filter: drop-shadow(0 0 18px rgba(99, 102, 241, 0.45));
    }
    @keyframes shimmerText { to { background-position: 200% center; } }
    .intro-sub {
      font-size: 12.5px;
      color: #cbd5e1;
      max-width: 300px;
      line-height: 1.45;
      font-weight: 600;
    }
    .intro-team { display: flex; gap: 16px; justify-content: center; margin-top: 4px; }
    .intro-member { display: flex; flex-direction: column; align-items: center; gap: 5px; }
    .intro-member .ava {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid var(--cyan);
      box-shadow: 0 0 18px rgba(56, 189, 248, 0.45);
    }
    .intro-member .ava img { width: 100%; height: 100%; object-fit: cover; }
    .intro-member span { font-size: 10px; font-weight: 800; color: #e2e8f0; }

    /* SCENE 3: FEATURE STEP RAIL + KEN BURNS */
    .step-rail { display: flex; justify-content: space-between; gap: 6px; }
    .step-chip {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 7px 2px;
      border-radius: 10px;
      background: rgba(30, 41, 59, 0.55);
      border: 1px solid rgba(255,255,255,0.08);
      opacity: 0.35;
    }
    .step-chip .sc-ic { font-size: 16px; }
    .step-chip .sc-lb { font-size: 8.5px; font-weight: 800; color: #e2e8f0; text-align: center; line-height: 1.15; }
    .scene-view.active .step-chip {
      animation: stepOn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
      animation-delay: calc(var(--d, 0s) - var(--off, 0s));
    }
    @keyframes stepOn {
      0% { opacity: 0.35; transform: scale(0.95); }
      60% { transform: scale(1.12); }
      100% {
        opacity: 1;
        transform: scale(1);
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.5), rgba(6, 182, 212, 0.3));
        border-color: #38bdf8;
        box-shadow: 0 0 14px rgba(56, 189, 248, 0.45);
      }
    }
    .scene-view.active .mockup-window img { animation: kenBurns 16s ease-in-out infinite alternate; }
    @keyframes kenBurns {
      0% { transform: scale(1); object-position: 0% 0%; }
      100% { transform: scale(1.14); object-position: 100% 35%; }
    }
    .chat-head {
      font-size: 9.5px;
      font-weight: 800;
      color: var(--amber);
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .chat-sim-box { min-height: 128px; }

    /* SCENE 5: SCAN NOW BADGE */
    .scan-now-wrap { text-align: center; }
    .scan-now {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, #f43f5e, #f59e0b);
      color: #fff;
      font-size: 11px;
      font-weight: 900;
      padding: 5px 14px;
      border-radius: 999px;
      letter-spacing: 1px;
      box-shadow: 0 0 20px rgba(244, 63, 94, 0.6);
      animation: scanPulse 0.9s ease-in-out infinite alternate;
    }
    @keyframes scanPulse {
      from { transform: scale(1); box-shadow: 0 0 12px rgba(244, 63, 94, 0.5); }
      to { transform: scale(1.07); box-shadow: 0 0 26px rgba(245, 158, 11, 0.8); }
    }
    .team-names { font-size: 9.5px; color: var(--text-muted); font-weight: 700; margin-top: 5px; }

    /* WORD-BY-WORD KINETIC CAPTIONS */
    .cap-word {
      display: inline-block;
      animation: capWord 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    @keyframes capWord {
      from { opacity: 0; transform: translateY(8px) scale(0.85); }
      to { opacity: 1; transform: none; }
    }

    /* OUTRO END CARD */
    .outro-overlay {
      position: absolute;
      inset: 0;
      z-index: 88;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      text-align: center;
      padding: 30px;
      background: radial-gradient(circle at 50% 38%, rgba(79, 70, 229, 0.55) 0%, rgba(4, 6, 13, 0.97) 72%);
    }
    .outro-overlay.show { display: flex; }
    .outro-overlay.show .o-item {
      animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
      animation-delay: var(--d, 0s);
    }
    .outro-title {
      font-size: 42px;
      font-weight: 900;
      letter-spacing: -1px;
      background: linear-gradient(135deg, #ffffff, #38bdf8, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .outro-sub { font-size: 12.5px; font-weight: 700; color: #cbd5e1; }
    .outro-qr { background: #fff; padding: 10px; border-radius: 14px; box-shadow: 0 0 30px rgba(56, 189, 248, 0.45); }
    .outro-qr img { width: 110px; height: 110px; display: block; }
    .outro-url { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--cyan); font-weight: 800; }

    /* RECORDING COUNTDOWN */
    .countdown-overlay {
      position: absolute;
      inset: 0;
      z-index: 99;
      display: none;
      align-items: center;
      justify-content: center;
      background: rgba(4, 6, 13, 0.88);
      backdrop-filter: blur(6px);
    }
    .countdown-overlay.show { display: flex; }
    .countdown-num {
      font-size: 120px;
      font-weight: 900;
      font-family: 'JetBrains Mono', monospace;
      background: linear-gradient(135deg, #38bdf8, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: cdPop 0.9s ease-out both;
    }
    @keyframes cdPop {
      0% { transform: scale(2.2); opacity: 0; }
      30% { transform: scale(1); opacity: 1; }
      100% { transform: scale(0.85); opacity: 0.2; }
    }

    /* FX CANVAS (CONFETTI) */
    #fxCanvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 89;
    }

    /* MUSIC CONTROLS */
    .music-ctrl { display: flex; align-items: center; gap: 6px; }
    .music-ctrl input[type=range] { width: 80px; accent-color: #6366f1; cursor: pointer; }
  </style>
</head>
<body>

  <!-- TOP TOOLBAR -->
  <header class="top-dock">
    <div style="display:flex; align-items:center; gap:12px;">
      <span class="badge-cifpec">CITEC / CIFPEC 2026</span>
      <div>
        <div style="font-size:14px; font-weight:800; color:#fff;">Vertical AI Pitch Reel (9:16)</div>
        <div style="font-size:11px; color:var(--cyan);" data-en="Dashboard ADTEC Melaka • TVET Innovation">Dashboard ADTEC Melaka • Inovasi TVET</div>
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

    <canvas id="particlesCanvas"></canvas>
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>
    <div class="reel-vignette"></div>
    <div class="scene-flash" id="sceneFlash"></div>

    <!-- STORY-STYLE SEGMENTED PROGRESS -->
    <div class="reel-progress-bar" id="progressSegments"></div>

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
      <div style="display:flex; align-items:center; gap:6px;">
        <div class="strip-tag scene-chip" id="sceneChip">01 / 06</div>
        <div class="strip-tag" id="timerTag">0:00 / 3:18</div>
      </div>
    </div>

    <!-- ==========================================
         SCENE 0: CINEMATIC INTRO (BM & EN)
         ========================================== -->
    <section class="scene-view active" id="scene-0">
      <div class="intro-ring"></div>
      <div class="intro-wrap">
        <div class="reveal reveal-pop" data-d-bm="0.2" data-d-en="0.15" style="--d:0.2s;">
          <div class="intro-logo"><img src="${bannerLogoBase64}" alt="Logo Rasmi"></div>
        </div>
        <div class="reveal" data-d-bm="0.8" data-d-en="0.5" style="--d:0.8s;">
          <div class="intro-kicker" data-en="CIFPEC 2026 • Proudly Presents">CIFPEC 2026 • Dengan Bangganya Mempersembahkan</div>
        </div>
        <div class="reveal" data-d-bm="1.4" data-d-en="0.9" style="--d:1.4s;">
          <h1 class="intro-title">DASHBOARD<br>ADTEC MELAKA</h1>
        </div>
        <div class="reveal" data-d-bm="2.2" data-d-en="1.4" style="--d:2.2s;">
          <p class="intro-sub" data-en="Smart Digital Campus Hub &amp; AI-Powered Lost &amp; Found">Hab Kampus Digital Pintar &amp; Lost-Found Berkuasa AI</p>
        </div>
        <div class="reveal" data-d-bm="3.0" data-d-en="2.0" style="--d:3.0s;">
          <div class="intro-team">
            <div class="intro-member"><div class="ava"><img src="${member1Base64}" alt="Adam"></div><span>Adam Darwish</span></div>
            <div class="intro-member"><div class="ava"><img src="${member2Base64}" alt="Hazim"></div><span>Hazim Afiq</span></div>
            <div class="intro-member"><div class="ava"><img src="${member3Base64}" alt="Syahmi"></div><span>M. Syahmi</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==========================================
         SCENE 1: HOOK & CAMPUS PROBLEM
         ========================================== -->
    <section class="scene-view" id="scene-1">
      <div>
        <div class="reveal reveal-left" style="--d:0.1s;">
          <span class="hook-badge" id="lblScene1" data-en="⚠️ Campus Issues &amp; Challenges">⚠️ Isu &amp; Cabaran Kampus</span>
        </div>
        <div class="reveal" style="--d:0.35s;">
          <h1 class="hook-title" id="titleScene1" data-en="Missed Campus Announcements? Lost Items in the Workshop?">Terlepas Hebahan Kolej? Barang Hilang di Bengkel?</h1>
        </div>
        <div class="reveal" style="--d:0.7s;">
          <p style="font-size:11.5px; color:var(--text-muted); line-height:1.4;" id="descScene1" data-en="Conventional methods bury important information and expose student privacy.">
            Kaedah konvensional menyebabkan maklumat penting tenggelam dan mendedahkan privasi pelajar.
          </p>
        </div>
      </div>

      <!-- SIMULATED NOTIFICATIONS STACK (synced with narration) -->
      <div style="display:flex; flex-direction:column; gap:9px; margin:10px 0;">
        <div class="noti-bubble reveal reveal-left sfx-pop" style="--d:1.0s;">
          <div class="noti-avatar wa">💬</div>
          <div class="noti-content" style="flex:1;">
            <h4><span data-en="College WhatsApp Group">Grup WhatsApp Kolej</span> <span style="font-size:9.5px; color:#22c55e;" class="count-up" data-target="1429" data-suffix=" mesej" data-suffix-en=" messages">1,429 mesej</span></h4>
            <p data-en="&quot;Has anyone seen a Yamaha motorcycle key left at the workshop?&quot;">"Siapa ada nampak kunci motor Yamaha tertinggal kat bengkel tadi?"</p>
          </div>
        </div>

        <div class="noti-bubble reveal reveal-left sfx-pop" style="border-left-color:var(--rose);" data-d-bm="17" data-d-en="9">
          <div class="noti-avatar warn">📄</div>
          <div class="noti-content" style="flex:1;">
            <h4><span data-en="Damaged Paper Notice Boards">Papan Notis Kertas Rosak</span> <span style="font-size:9.5px; color:var(--rose);" data-en="WASTEFUL">MEMBAZIR</span></h4>
            <p data-en="Paper notices tear easily, wear out and burden college printing costs.">Notis kertas mudah koyak, lapuk dan membebankan kos cetakan kolej.</p>
          </div>
        </div>

        <div class="noti-bubble reveal reveal-left sfx-pop" style="border-left-color:var(--amber);" data-d-bm="23" data-d-en="11.5">
          <div class="noti-avatar priv">🔒</div>
          <div class="noti-content" style="flex:1;">
            <h4><span data-en="Phone Number Privacy Risk">Risiko Privasi Nombor Telefon</span> <span style="font-size:9.5px; color:var(--amber);" data-en="DANGER">BAHAYA</span></h4>
            <p data-en="Sharing phone numbers in public groups exposes students to scams.">Berkongsi nombor telefon di grup awam mendedahkan pelajar kepada ancaman scam.</p>
          </div>
        </div>
      </div>

      <!-- HERO CALLOUT BOX -->
      <div class="reveal reveal-pop sfx-pop" data-d-bm="27" data-d-en="18">
        <div class="hero-callout-box">
          <span id="calloutTag" data-en="💡 SMART TVET SOLUTION">💡 PENYELESAIAN PINTAR TVET</span>
          <h3>DASHBOARD ADTEC MELAKA</h3>
        </div>
      </div>
    </section>

    <!-- ==========================================
         SCENE 2: SOLUTION & ARCHITECTURE
         ========================================== -->
    <section class="scene-view" id="scene-2">
      <div>
        <div class="reveal reveal-left" style="--d:0.1s;">
          <span class="hook-badge" style="background:rgba(56,189,248,0.16); border-color:rgba(56,189,248,0.45); color:var(--cyan);" id="lblScene2" data-en="🚀 Digital Innovation">🚀 Inovasi Digital</span>
        </div>
        <div class="reveal" style="--d:0.35s;">
          <h2 class="hook-title" style="background:linear-gradient(135deg, #38bdf8 0%, #818cf8 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;" id="titleScene2" data-en="Digital Campus Hub &amp; Smart Lost-Found">
            Hab Kampus Digital &amp; Lost-Found Pintar
          </h2>
        </div>
        <div class="reveal" style="--d:0.7s;">
          <p style="font-size:11.5px; color:var(--text-muted); line-height:1.4;" id="descScene2" data-en="Powered by modern cloud database architecture and Artificial Intelligence (AI).">
            Dikuasakan seni bina pangkalan data awan moden dan Kecerdasan Buatan (AI).
          </p>
        </div>
      </div>

      <!-- TECH GRID -->
      <div class="tech-pill-grid">
        <div class="tp-card reveal reveal-pop sfx-pop" style="--d:1.0s;">
          <span class="tp-icon">⚛️</span>
          <h5>React 19 + Vite</h5>
          <p data-en="Blazing-Fast PWA">PWA Sangat Pantas</p>
        </div>
        <div class="tp-card reveal reveal-pop sfx-pop" style="--d:1.3s;">
          <span class="tp-icon">⚡</span>
          <h5>Supabase Cloud</h5>
          <p data-en="Realtime WebSockets">WebSockets Masa Nyata</p>
        </div>
        <div class="tp-card reveal reveal-pop sfx-pop" style="--d:1.6s;">
          <span class="tp-icon">🤖</span>
          <h5>Google Gemini AI</h5>
          <p data-en="24/7 Assistant Bot">Bot Pembantu 24 Jam</p>
        </div>
        <div class="tp-card reveal reveal-pop sfx-pop" style="--d:1.9s;">
          <span class="tp-icon">🛡️</span>
          <h5 data-en="OTP, RLS &amp; AI Shield">OTP, RLS &amp; Perisai AI</h5>
          <p data-en="Data Privacy Protected">Privasi Data Terpelihara</p>
        </div>
      </div>

      <!-- DEVICES DISPLAY -->
      <div class="reveal" style="--d:2.6s;">
        <div class="devices-strip">
          <div class="dev-item">
            <span class="di-icon">📱</span>
            <span class="di-lbl" data-en="PWA Phone">Telefon PWA</span>
          </div>
          <div class="dev-item">
            <span class="di-icon">💻</span>
            <span class="di-lbl" data-en="Web Portal">Portal Web</span>
          </div>
          <div class="dev-item">
            <span class="di-icon">📺</span>
            <span class="di-lbl" data-en="Campus TV Kiosk">Kiosk TV Kampus</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==========================================
         SCENE 3: LIVE DEMO & SIMULATION
         ========================================== -->
    <section class="scene-view" id="scene-3">
      <div>
        <div class="reveal reveal-left" style="--d:0.1s;">
          <span class="hook-badge" style="background:rgba(16,185,129,0.16); border-color:rgba(16,185,129,0.45); color:var(--emerald);" id="lblScene3" data-en="✨ Live System Demonstration">✨ Demonstrasi Sistem Sebenar</span>
        </div>
        <div class="reveal" style="--d:0.35s;">
          <h2 style="font-size:21px; font-weight:900; color:#fff; margin-top:6px;" id="titleScene3" data-en="Smart Ecosystem in Action">Ekosistem Pintar Beroperasi</h2>
        </div>
      </div>

      <!-- LIVE BROWSER MOCKUP -->
      <div class="reveal" style="--d:0.6s;">
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
            <div class="ticker-text" data-en="📢 New Semester Registration • 🔍 Found: Yamaha Motorcycle Key at the Surau • ⏰ 12:45 PM">
              📢 Pendaftaran Semester Baharu • 🔍 Dijumpai: Kunci Motor Yamaha di Surau • ⏰ 12:45 PM
            </div>
          </div>
        </div>
      </div>

      <!-- FEATURE STEP RAIL (lights up in sync with narration) -->
      <div class="step-rail">
        <div class="step-chip" style="--d:1.0s;"><span class="sc-ic">📰</span><span class="sc-lb" data-en="Notices">Memo Rasmi</span></div>
        <div class="step-chip" data-d-bm="10" data-d-en="10.6"><span class="sc-ic">📺</span><span class="sc-lb">Kiosk TV</span></div>
        <div class="step-chip" data-d-bm="22" data-d-en="20.6"><span class="sc-ic">📸</span><span class="sc-lb" data-en="Report Item">Lapor Barang</span></div>
        <div class="step-chip" data-d-bm="33" data-d-en="30.6"><span class="sc-ic">💬</span><span class="sc-lb" data-en="Private Chat">Sembang Sulit</span></div>
        <div class="step-chip" data-d-bm="42" data-d-en="38.6"><span class="sc-ic">🤖</span><span class="sc-lb">AdtecBot AI</span></div>
      </div>

      <!-- IN-APP CHAT & AI DEMO -->
      <div class="chat-sim-box">
        <div class="chat-head" data-en="🔒 Built-in Private Chat">🔒 Sembang Sulit Dalam Aplikasi</div>
        <div class="chat-bubble in reveal reveal-left sfx-pop" data-d-bm="33.5" data-d-en="31" data-en="&quot;Hi bro, I found this motorcycle key at the Surau.&quot;">
          "Salam bro, saya jumpa kunci motor ni dekat Surau."
        </div>
        <div class="chat-bubble out reveal sfx-pop" data-d-bm="36" data-d-en="33.5" data-en="&quot;Alhamdulillah! Is it the red PROTON keychain, bro?&quot;">
          "Alhamdulillah! Keychain warna merah PROTON ke bro?"
        </div>
        <div class="chat-bubble bot reveal reveal-pop sfx-pop" data-d-bm="42" data-d-en="38.6" data-en="🤖 AdtecBot: &quot;Protected by built-in private chat. Phone numbers stay hidden.&quot;">
          🤖 AdtecBot: "Dilindungi Sembang Sulit Terbina. Nombor telefon tidak didedahkan."
        </div>
      </div>
    </section>

    <!-- ==========================================
         SCENE 4: METRICS & GREEN CAMPUS
         ========================================== -->
    <section class="scene-view" id="scene-4">
      <div>
        <div class="reveal reveal-left" style="--d:0.1s;">
          <span class="hook-badge" style="background:rgba(16,185,129,0.16); border-color:rgba(16,185,129,0.45); color:var(--emerald);" id="lblScene4" data-en="🌿 Green Campus &amp; Added Value">🌿 Kampus Hijau &amp; Nilai Tambah</span>
        </div>
        <div class="reveal" style="--d:0.35s;">
          <h2 class="hook-title" style="color:#fff;" id="titleScene4" data-en="Measurable Impact &amp; Sustainability">Impak Ketara &amp; Kelestarian</h2>
        </div>
      </div>

      <div class="metrics-2x2-grid">
        <div class="metric-m-card reveal reveal-pop sfx-pop" data-d-bm="0.7" data-d-en="8">
          <div class="mm-val green count-up" data-target="90" data-suffix="%">90%</div>
          <div class="mm-title" id="m1Title" data-en="Paper Savings">Penjimatan Kertas</div>
          <div class="mm-sub" id="m1Sub" data-en="Zero physical notices">Sifar notis fizikal</div>
        </div>
        <div class="metric-m-card reveal reveal-pop sfx-pop" data-d-bm="1.3" data-d-en="0.7">
          <div class="mm-val count-up" data-target="100" data-suffix="%">100%</div>
          <div class="mm-title" id="m2Title" data-en="Realtime">Masa Nyata</div>
          <div class="mm-sub" id="m2Sub" data-en="Instant cloud data push">Tolakan data awan serta-merta</div>
        </div>
        <div class="metric-m-card reveal reveal-pop sfx-pop" data-d-bm="9.4" data-d-en="16">
          <div class="mm-val purple">0</div>
          <div class="mm-title" id="m3Title" data-en="Privacy Leaks">Ketirisan Privasi</div>
          <div class="mm-sub" id="m3Sub" data-en="Protected internal chat">Sembang dalaman terlindung</div>
        </div>
        <div class="metric-m-card reveal reveal-pop sfx-pop" data-d-bm="19.4" data-d-en="21">
          <div class="mm-val green count-up" data-target="3" data-suffix="x">3x</div>
          <div class="mm-title" id="m4Title" data-en="Faster Returns">Pemulangan Pantas</div>
          <div class="mm-sub" id="m4Sub" data-en="Weeks ➔ Hours">Minggu ➔ Jam</div>
        </div>
      </div>

      <div class="reveal" data-d-bm="24" data-d-en="23">
        <div style="background:rgba(30,41,59,0.7); border:1px solid var(--border); border-radius:12px; padding:10px; text-align:center;">
          <span style="font-size:11px; font-weight:700; color:var(--emerald);" data-en="🌱 UN Sustainable Development Goals: SDG 12 &amp; SDG 9">🌱 Matlamat Pembangunan Mampan PBB: SDG 12 &amp; SDG 9</span>
        </div>
      </div>
    </section>

    <!-- ==========================================
         SCENE 5: SCALABILITY & QR CODE
         ========================================== -->
    <section class="scene-view" id="scene-5">
      <div>
        <div class="reveal reveal-left" style="--d:0.1s;">
          <span class="hook-badge" id="lblScene5" data-en="🎓 TVET Scalability">🎓 Kebolehskalaan TVET</span>
        </div>
        <div class="reveal" style="--d:0.35s;">
          <h2 style="font-size:22px; font-weight:900; color:#fff; margin-top:4px;" id="titleScene5">
            <span data-en="Ready to Replicate Across">Sedia Direplikasi ke</span> <span class="count-up" style="color:var(--cyan);" data-target="33">33</span> ILJTM
          </h2>
        </div>
        <div class="reveal" style="--d:0.7s;">
          <p style="font-size:11px; color:var(--text-muted);" id="descScene5" data-en="Modular cloud architecture ready to scale to every training institute nationwide.">
            Seni bina awan modular sedia diperluas ke semua institusi latihan seluruh negara.
          </p>
        </div>
      </div>

      <div class="scan-now-wrap reveal reveal-pop sfx-pop" data-d-bm="19.2" data-d-en="19.3">
        <span class="scan-now" data-en="📱 SCAN NOW">📱 IMBAS SEKARANG</span>
      </div>

      <!-- QR CODE CARD -->
      <div class="reveal reveal-pop" style="--d:1.2s;">
        <div class="qr-hero-box">
          <span style="font-size:9.5px; font-weight:800; color:#0f172a; text-transform:uppercase;" id="qrLabel" data-en="SCAN TO TRY THE LIVE PORTAL">IMBAS UNTUK UJI PORTAL LIVE</span>
          <img src="${qrBase64}" alt="QR Code">
          <span class="qr-hero-url">dashboard-information-nu.vercel.app</span>
        </div>
      </div>

      <!-- TEAM MEMBERS ROW -->
      <div class="reveal" style="--d:2.0s; text-align:center;">
        <div style="font-size:11.5px; font-weight:800; color:var(--cyan); margin-bottom:4px;" data-en="FINAL YEAR PROJECT 2 • CIFPEC 2026">PROJEK TAHUN AKHIR 2 • CIFPEC 2026</div>
        <div class="team-mini-row">
          <div class="team-avatar-mini" title="Muhammad Adam Darwish"><img src="${member1Base64}" alt="Adam"></div>
          <div class="team-avatar-mini" title="Hazim Afiq"><img src="${member2Base64}" alt="Hazim"></div>
          <div class="team-avatar-mini" title="Muhammad Syahmi"><img src="${member3Base64}" alt="Syahmi"></div>
        </div>
        <div class="team-names">Adam Darwish • Hazim Afiq • Muhammad Syahmi</div>
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

    <!-- OUTRO END CARD -->
    <div class="outro-overlay" id="outroOverlay">
      <div class="o-item" style="--d:0.1s;"><div class="intro-logo"><img src="${bannerLogoBase64}" alt="Logo Rasmi"></div></div>
      <div class="o-item outro-title" style="--d:0.4s;" data-en="Thank You!">Terima Kasih!</div>
      <div class="o-item outro-sub" style="--d:0.7s;">Dashboard ADTEC Melaka • CIFPEC 2026</div>
      <div class="o-item outro-qr" style="--d:1.0s;"><img src="${qrBase64}" alt="QR Code"></div>
      <div class="o-item outro-url" style="--d:1.2s;">dashboard-information-nu.vercel.app</div>
      <div class="o-item team-names" style="--d:1.5s; font-size:11px; color:#e2e8f0;">Adam Darwish • Hazim Afiq • Muhammad Syahmi</div>
    </div>

    <!-- FX CANVAS (CONFETTI) -->
    <canvas id="fxCanvas"></canvas>

    <!-- RECORDING COUNTDOWN -->
    <div class="countdown-overlay" id="countdownOverlay"></div>

  </main>

  <!-- AUDIO CONTROLS DOCK -->
  <div class="audio-player-dock" id="audioDock" style="flex-wrap:wrap;">
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
      <div class="music-ctrl">
        <button class="btn-action" id="btnMusic" style="padding:5px 10px; font-size:12px;" onclick="toggleMusic()" title="Muzik latar">🎵 ON</button>
        <input type="range" id="musicVol" min="0" max="100" value="35" oninput="setMusicVolume(this.value)" title="Kelantangan muzik latar">
      </div>
      <button class="btn-action" style="padding:5px 10px; font-size:12px;" onclick="seekAudio(-5)">-5s</button>
      <button class="btn-action" style="padding:5px 10px; font-size:12px;" onclick="seekAudio(5)">+5s</button>
    </div>
  </div>

  <script>
    const audio = document.getElementById('audioEl');
    const playBtn = document.getElementById('btnMainPlay');
    const recBtn = document.getElementById('btnRec');
    const timerTag = document.getElementById('timerTag');
    const captionText = document.getElementById('captionText');
    const audioDock = document.getElementById('audioDock');
    const recBadge = document.getElementById('recBadge');
    const audioTrackTitle = document.getElementById('audioTrackTitle');
    const audioTrackSub = document.getElementById('audioTrackSub');
    const sceneChip = document.getElementById('sceneChip');
    const sceneFlash = document.getElementById('sceneFlash');
    const progressSegments = document.getElementById('progressSegments');
    const outroOverlay = document.getElementById('outroOverlay');
    const countdownOverlay = document.getElementById('countdownOverlay');
    const reelContainer = document.getElementById('reelContainer');

    let currentLang = 'bm';
    const DUR = { bm: 197.5, en: 173.0 };

    // TIMESTAMPS FOR BAHASA MELAYU (Durasi ~197.5s = 3m 18s)
    const scenesBM = [
      { id: 'scene-0', start: 0, end: 12.0 },
      { id: 'scene-1', start: 12.0, end: 43.0 },
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
      { id: 'scene-0', start: 0, end: 6.0 },
      { id: 'scene-1', start: 6.0, end: 33.2 },
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

    function getScenes() { return currentLang === 'bm' ? scenesBM : scenesEN; }
    function getCaptions() { return currentLang === 'bm' ? captionsBM : captionsEN; }
    function getTotal() {
      return (audio.duration && isFinite(audio.duration)) ? audio.duration : DUR[currentLang];
    }
    function fmtTime(t) {
      const m = Math.floor(t / 60);
      const s = String(Math.floor(t % 60)).padStart(2, '0');
      return m + ':' + s;
    }

    // ---------- BILINGUAL ON-SCREEN TEXT ----------
    function formatCount(el, value) {
      const suffix = (currentLang === 'en' && el.dataset.suffixEn !== undefined) ? el.dataset.suffixEn : (el.dataset.suffix || '');
      return Math.round(value).toLocaleString('en-US') + suffix;
    }
    function applyLanguageTexts(lang) {
      document.querySelectorAll('[data-en]').forEach(el => {
        if (el.dataset.bm === undefined) el.dataset.bm = el.innerHTML;
        el.innerHTML = (lang === 'en') ? el.dataset.en : el.dataset.bm;
      });
      document.querySelectorAll('[data-d-bm]').forEach(el => {
        const d = (lang === 'en') ? el.dataset.dEn : el.dataset.dBm;
        el.style.setProperty('--d', d + 's');
      });
      document.querySelectorAll('.count-up').forEach(el => {
        el.textContent = formatCount(el, Number(el.dataset.target) || 0);
      });
    }

    // ---------- COUNT-UP NUMBERS ----------
    function runCountUp(el) {
      const target = Number(el.dataset.target) || 0;
      const duration = 1300;
      const t0 = performance.now();
      function step(now) {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = formatCount(el, target * eased);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // Fires exactly when each delayed reveal begins (synced with narration)
    document.addEventListener('animationstart', (e) => {
      const t = e.target;
      if (!t || !t.classList) return;
      if (!(t.classList.contains('reveal') || t.classList.contains('step-chip'))) return;
      if (e.animationName !== 'revealUp' && e.animationName !== 'revealLeft' && e.animationName !== 'revealPop' && e.animationName !== 'stepOn') return;
      if ((t.classList.contains('sfx-pop') || t.classList.contains('step-chip')) && !audio.paused) playSfx('pop');
      t.querySelectorAll('.count-up').forEach(runCountUp);
    });

    // ---------- STORY-STYLE PROGRESS SEGMENTS ----------
    function buildSegments() {
      progressSegments.innerHTML = '';
      getScenes().forEach(sc => {
        const seg = document.createElement('div');
        seg.className = 'prog-seg';
        seg.style.flex = String(sc.end - sc.start);
        const fill = document.createElement('div');
        fill.className = 'prog-seg-fill';
        seg.appendChild(fill);
        progressSegments.appendChild(seg);
      });
    }
    function updateSegments(cur) {
      const fills = progressSegments.querySelectorAll('.prog-seg-fill');
      getScenes().forEach((sc, i) => {
        const p = Math.max(0, Math.min(1, (cur - sc.start) / (sc.end - sc.start)));
        if (fills[i]) fills[i].style.width = (p * 100) + '%';
      });
    }

    // ---------- SCENE SWITCHING ----------
    let currentSceneIdx = -1;
    function activateScene(i, offset, silent) {
      const list = getScenes();
      const sc = list[i];
      if (!sc) return;
      currentSceneIdx = i;
      document.querySelectorAll('.scene-view').forEach(el => el.classList.remove('active'));
      const target = document.getElementById(sc.id);
      if (target) {
        target.style.setProperty('--off', Math.max(0, offset || 0) + 's');
        void target.offsetWidth; // force reflow so CSS animations restart
        target.classList.add('active');
      }
      sceneChip.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
      if (!silent) {
        sceneFlash.classList.remove('go');
        void sceneFlash.offsetWidth;
        sceneFlash.classList.add('go');
        playSfx('whoosh');
      }
    }

    // ---------- WORD-BY-WORD KINETIC CAPTIONS ----------
    let currentCapIdx = -1;
    function renderCaption(html) {
      captionText.innerHTML = html;
      let idx = 0;
      const walk = (node) => {
        Array.from(node.childNodes).forEach(child => {
          if (child.nodeType === 3) {
            const parts = child.textContent.split(' ');
            const frag = document.createDocumentFragment();
            parts.forEach((w, i) => {
              if (w) {
                const s = document.createElement('span');
                s.className = 'cap-word';
                s.style.animationDelay = (idx++ * 0.06) + 's';
                s.textContent = w;
                frag.appendChild(s);
              }
              if (i < parts.length - 1) frag.appendChild(document.createTextNode(' '));
            });
            child.replaceWith(frag);
          } else if (child.nodeType === 1) {
            walk(child);
          }
        });
      };
      walk(captionText);
    }

    // ---------- MASTER SYNC ----------
    function sync() {
      const cur = audio.currentTime;
      const total = getTotal();
      updateSegments(cur);
      timerTag.textContent = fmtTime(cur) + ' / ' + fmtTime(total);

      const list = getScenes();
      let idx = list.length - 1;
      for (let i = 0; i < list.length; i++) {
        if (cur >= list[i].start && cur < list[i].end) { idx = i; break; }
      }
      if (idx !== currentSceneIdx) activateScene(idx, cur - list[idx].start, false);

      if (cur > 0 || !audio.paused) {
        const caps = getCaptions();
        let ci = 0;
        for (let i = 0; i < caps.length; i++) {
          if (cur >= caps[i].start) ci = i;
        }
        if (ci !== currentCapIdx) {
          currentCapIdx = ci;
          renderCaption(caps[ci].text);
        }
      }

      if (!audio.ended && outroOverlay.classList.contains('show') && cur < total - 0.3) hideOutro();
    }

    function tick() {
      if (!audio.paused) {
        sync();
        requestAnimationFrame(tick);
      }
    }

    function playLabel() { return currentLang === 'bm' ? '▶️ Play Suara AI' : '▶️ Play AI Pitch'; }
    function recLabel() { return currentLang === 'bm' ? '🎥 Rakam & Export Video' : '🎥 Record & Export Video'; }
    function stopRecLabel() { return currentLang === 'bm' ? '⏹ Henti Rakaman' : '⏹ Stop Recording'; }

    audio.addEventListener('play', () => {
      playBtn.innerText = '⏸ Pause';
      audioDock.classList.add('playing');
      hideOutro();
      musicStart();
      requestAnimationFrame(tick);
    });
    audio.addEventListener('pause', () => {
      if (audio.ended) return;
      playBtn.innerText = playLabel();
      audioDock.classList.remove('playing');
      musicStop();
    });
    audio.addEventListener('timeupdate', sync);
    audio.addEventListener('seeked', sync);
    audio.addEventListener('ended', () => {
      playBtn.innerText = '🔄 Replay';
      audioDock.classList.remove('playing');
      showOutro();
      setTimeout(() => { if (audio.paused) musicStop(); }, 3800);
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        setTimeout(stopRecording, 4800);
      }
    });

    function togglePlay() {
      if (audio.paused) {
        if (audio.ended) audio.currentTime = 0;
        ensureCtx();
        playSfx('ping');
        audio.play().catch(err => {
          alert((currentLang === 'bm' ? 'Ralat memainkan audio: ' : 'Error playing audio: ') + err.message);
        });
      } else {
        audio.pause();
      }
    }

    function seekAudio(delta) {
      audio.currentTime = Math.max(0, Math.min(getTotal(), audio.currentTime + delta));
      playSfx('whoosh');
      sync();
    }

    function switchLanguage(lang) {
      currentLang = lang;
      const wasPlaying = !audio.paused;
      audio.pause();
      document.getElementById('btnBm').classList.toggle('active', lang === 'bm');
      document.getElementById('btnEn').classList.toggle('active', lang === 'en');

      if (lang === 'bm') {
        audio.src = 'audio/full_voiceover_bahasa_melayu.wav';
        audioTrackTitle.innerText = 'Suara AI: Bahasa Melayu (Aoede)';
        audioTrackSub.innerText = 'Master Pitch Audio • Durasi 3m 18s (Format CIFPEC Rasmi)';
        captionText.innerHTML = 'Tekan <span class="caption-highlight">▶️ Play Suara AI</span> untuk memulakan persembahan.';
        document.getElementById('btnMusic').title = 'Muzik latar';
        document.getElementById('musicVol').title = 'Kelantangan muzik latar';
      } else {
        audio.src = 'audio/full_citec_style_voiceover.wav';
        audioTrackTitle.innerText = 'AI Voiceover: English (Aoede)';
        audioTrackSub.innerText = 'Master Pitch Audio • Duration 2m 53s (CITEC Style)';
        captionText.innerHTML = 'Press <span class="caption-highlight">▶️ Play AI Pitch</span> to start presentation.';
        document.getElementById('btnMusic').title = 'Background music';
        document.getElementById('musicVol').title = 'Background music volume';
      }
      playBtn.innerText = playLabel();
      if (!mediaRecorder || mediaRecorder.state !== 'recording') {
        recBtn.innerText = recLabel();
      } else {
        recBtn.innerText = stopRecLabel();
      }
      timerTag.innerText = '0:00 / ' + fmtTime(DUR[lang]);

      applyLanguageTexts(lang);
      buildSegments();
      updateSegments(0);
      audio.currentTime = 0;
      currentCapIdx = -1;
      hideOutro();
      activateScene(0, 0, true);

      if (wasPlaying) {
        audio.play().catch(() => {});
      } else {
        audioDock.classList.remove('playing');
      }
    }

    function toggleFullscreen() {
      if (!document.fullscreenElement) {
        reelContainer.requestFullscreen ? reelContainer.requestFullscreen() : reelContainer.webkitRequestFullscreen();
      } else {
        document.exitFullscreen ? document.exitFullscreen() : null;
      }
    }

    // Keyboard shortcuts: Space = play/pause, Arrow = seek 5s
    document.addEventListener('keydown', (e) => {
      if (e.target && e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        seekAudio(5);
      } else if (e.code === 'ArrowLeft') {
        seekAudio(-5);
      }
    });

    // ---------- OUTRO ----------
    function showOutro() {
      applyLanguageTexts(currentLang);
      outroOverlay.classList.add('show');
      burstConfetti();
      playSfx('ping');
    }
    function hideOutro() {
      outroOverlay.classList.remove('show');
    }

    // =====================================================
    // WEB AUDIO: SFX + GENERATIVE BACKGROUND MUSIC
    // =====================================================
    let audioCtx = null;
    let noiseBuffer = null;
    function ensureCtx() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }
    function getNoise() {
      if (noiseBuffer) return noiseBuffer;
      const ctx = ensureCtx();
      const len = ctx.sampleRate;
      noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      return noiseBuffer;
    }

    function playSfx(type) {
      try {
        const ctx = ensureCtx();
        const now = ctx.currentTime;
        if (type === 'whoosh') {
          const src = ctx.createBufferSource();
          src.buffer = getNoise();
          const f = ctx.createBiquadFilter();
          f.type = 'bandpass';
          f.Q.value = 1.2;
          f.frequency.setValueAtTime(350, now);
          f.frequency.exponentialRampToValueAtTime(3200, now + 0.22);
          f.frequency.exponentialRampToValueAtTime(600, now + 0.5);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, now);
          g.gain.exponentialRampToValueAtTime(0.16, now + 0.14);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
          src.connect(f); f.connect(g); g.connect(ctx.destination);
          src.start(now); src.stop(now + 0.55);
        } else if (type === 'ping') {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
          g.gain.setValueAtTime(0.12, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(now); osc.stop(now + 0.3);
        } else if (type === 'pop') {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(1180, now + 0.06);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
          osc.connect(g); g.connect(ctx.destination);
          osc.start(now); osc.stop(now + 0.16);
        }
      } catch (e) {}
    }

    // Lo-fi corporate-tech loop (Am - F - C - G @ 96 BPM), generated live — no copyright issues
    const music = { enabled: true, volume: 0.35, master: null, timer: null, nextTime: 0, step: 0, playing: false };
    const MUSIC_BPM = 96;
    const STEP_SEC = 60 / MUSIC_BPM / 2; // eighth notes
    const CHORDS = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]];
    const BASS = [45, 41, 48, 43];
    const ARP = [0, 1, 2, 1, 2, 0, 1, 2];
    function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

    function musicSetup() {
      const ctx = ensureCtx();
      if (music.master) return;
      music.master = ctx.createGain();
      music.master.gain.value = 0.0001;
      const comp = ctx.createDynamicsCompressor();
      music.master.connect(comp);
      comp.connect(ctx.destination);
    }
    function mVoice(type, freq, t, dur, peak, attack, filterFreq, detune) {
      const ctx = audioCtx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      if (detune) o.detune.setValueAtTime(detune, t);
      let node = o;
      if (filterFreq) {
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = filterFreq;
        o.connect(f);
        node = f;
      }
      node.connect(g);
      g.connect(music.master);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
    function mNoise(t, freq, type, peak, dur) {
      const ctx = audioCtx;
      const src = ctx.createBufferSource();
      src.buffer = getNoise();
      const f = ctx.createBiquadFilter();
      f.type = type;
      f.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(f); f.connect(g); g.connect(music.master);
      src.start(t); src.stop(t + dur + 0.02);
    }
    function scheduleStep(step, t) {
      const bar = Math.floor(step / 8) % 4;
      const s = step % 8;
      const chord = CHORDS[bar];
      if (s === 0) {
        chord.forEach(n => {
          mVoice('sawtooth', mtof(n), t, STEP_SEC * 8 + 0.4, 0.016, 0.6, 900, -7);
          mVoice('triangle', mtof(n), t, STEP_SEC * 8 + 0.4, 0.03, 0.6, 1800, 6);
        });
      }
      if (s === 0 || s === 3 || s === 4 || s === 6) {
        mVoice('sine', mtof(BASS[bar]), t, STEP_SEC * 1.6, 0.11, 0.02);
      }
      const arpNote = chord[ARP[s]] + 12 + (s >= 4 ? 12 : 0);
      mVoice('triangle', mtof(arpNote), t, STEP_SEC * 0.9, 0.02, 0.01, 3200);
      if (s === 0 || s === 4) {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(110, t);
        o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.3, t + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        o.connect(g); g.connect(music.master);
        o.start(t); o.stop(t + 0.32);
      }
      if (s === 2 || s === 6) mNoise(t, 1800, 'bandpass', 0.05, 0.12);
      if (s % 2 === 1) mNoise(t, 7000, 'highpass', 0.022, 0.05);
    }
    function musicScheduler() {
      while (music.nextTime < audioCtx.currentTime + 0.15) {
        scheduleStep(music.step, music.nextTime);
        music.nextTime += STEP_SEC;
        music.step++;
      }
    }
    function musicTarget() { return Math.max(0.0001, music.volume * 0.8); }
    function musicStart() {
      if (!music.enabled) return;
      musicSetup();
      const ctx = audioCtx;
      music.master.gain.cancelScheduledValues(ctx.currentTime);
      music.master.gain.setTargetAtTime(musicTarget(), ctx.currentTime, 0.5);
      if (music.playing) return;
      music.playing = true;
      music.nextTime = ctx.currentTime + 0.05;
      music.step = 0;
      if (music.timer) clearInterval(music.timer);
      music.timer = setInterval(musicScheduler, 25);
    }
    function musicStop() {
      if (!music.master) return;
      const ctx = audioCtx;
      music.master.gain.cancelScheduledValues(ctx.currentTime);
      music.master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.35);
      if (music.timer) clearInterval(music.timer);
      music.timer = null;
      music.playing = false;
    }
    function toggleMusic() {
      music.enabled = !music.enabled;
      document.getElementById('btnMusic').innerText = music.enabled ? '🎵 ON' : '🔇 OFF';
      if (music.enabled && !audio.paused) musicStart(); else musicStop();
    }
    function setMusicVolume(v) {
      music.volume = Number(v) / 100;
      if (music.playing && music.master) {
        music.master.gain.setTargetAtTime(musicTarget(), audioCtx.currentTime, 0.1);
      }
    }

    // =====================================================
    // BACKGROUND PARTICLES + CONFETTI FX
    // =====================================================
    const pCanvas = document.getElementById('particlesCanvas');
    const ctx = pCanvas.getContext('2d');
    const fxCanvas = document.getElementById('fxCanvas');
    const fx = fxCanvas.getContext('2d');
    let particles = [];
    let confetti = [];

    function resizeCanvas() {
      pCanvas.width = pCanvas.offsetWidth;
      pCanvas.height = pCanvas.offsetHeight;
      fxCanvas.width = fxCanvas.offsetWidth;
      fxCanvas.height = fxCanvas.offsetHeight;
      initParticles();
    }
    window.addEventListener('resize', resizeCanvas);

    function initParticles() {
      particles = [];
      const count = 40;
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

    function burstConfetti() {
      const colors = ['#38bdf8', '#6366f1', '#a855f7', '#10b981', '#f59e0b', '#f43f5e', '#ffffff'];
      for (let i = 0; i < 160; i++) {
        confetti.push({
          x: fxCanvas.width / 2 + (Math.random() - 0.5) * 60,
          y: fxCanvas.height * 0.32,
          vx: (Math.random() - 0.5) * 10,
          vy: -Math.random() * 10 - 3,
          size: Math.random() * 5 + 3,
          rot: Math.random() * 6.28,
          vr: (Math.random() - 0.5) * 0.3,
          color: colors[i % colors.length],
          life: 1
        });
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
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

      fx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
      if (confetti.length) {
        for (let i = confetti.length - 1; i >= 0; i--) {
          const c = confetti[i];
          c.vy += 0.22;
          c.vx *= 0.99;
          c.x += c.vx;
          c.y += c.vy;
          c.rot += c.vr;
          c.life -= 0.005;
          if (c.y > fxCanvas.height + 20 || c.life <= 0) { confetti.splice(i, 1); continue; }
          fx.save();
          fx.globalAlpha = Math.max(0, c.life);
          fx.translate(c.x, c.y);
          fx.rotate(c.rot);
          fx.fillStyle = c.color;
          fx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
          fx.restore();
        }
      }
      requestAnimationFrame(animateParticles);
    }
    setTimeout(resizeCanvas, 100);
    requestAnimationFrame(animateParticles);

    // =====================================================
    // EXPORT VIDEO (crops to the 9:16 reel when supported)
    // =====================================================
    let mediaRecorder = null;
    let recordedChunks = [];
    let recStream = null;
    let recExt = 'webm';

    function pickMime() {
      const candidates = [
        ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'mp4'],
        ['video/mp4', 'mp4'],
        ['video/webm;codecs=vp9,opus', 'webm'],
        ['video/webm;codecs=vp8,opus', 'webm'],
        ['video/webm', 'webm']
      ];
      for (let i = 0; i < candidates.length; i++) {
        if (window.MediaRecorder && MediaRecorder.isTypeSupported(candidates[i][0])) {
          return { mime: candidates[i][0], ext: candidates[i][1] };
        }
      }
      return { mime: '', ext: 'webm' };
    }

    function runCountdown() {
      return new Promise(resolve => {
        countdownOverlay.classList.add('show');
        let n = 3;
        const show = () => {
          if (n === 0) {
            countdownOverlay.classList.remove('show');
            countdownOverlay.innerHTML = '';
            setTimeout(resolve, 250);
            return;
          }
          const el = document.createElement('div');
          el.className = 'countdown-num';
          el.textContent = n;
          countdownOverlay.innerHTML = '';
          countdownOverlay.appendChild(el);
          playSfx('ping');
          n--;
          setTimeout(show, 900);
        };
        show();
      });
    }

    function stopRecording() {
      if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop();
    }

    function onRecordingStop() {
      const type = (mediaRecorder && mediaRecorder.mimeType) ? mediaRecorder.mimeType.split(';')[0] : 'video/' + recExt;
      const blob = new Blob(recordedChunks, { type: type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = (currentLang === 'bm')
        ? 'Video-Inovasi-Dashboard-ADTEC-Melaka-BM.' + recExt
        : 'Video-Inovasi-Dashboard-ADTEC-Melaka-EN.' + recExt;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      if (recStream) recStream.getTracks().forEach(t => t.stop());
      recStream = null;
      recBadge.classList.remove('active');
      recBtn.innerText = recLabel();
      alert(
        currentLang === 'bm'
          ? 'Tahniah! Rakaman video inovasi (.' + recExt + ') berjaya dimuat turun ke folder Downloads anda!'
          : 'Congratulations! Your innovation video recording (.' + recExt + ') has been downloaded to your Downloads folder!'
      );
    }

    async function toggleRecordVideo() {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        stopRecording();
        return;
      }
      try {
        ensureCtx();
        recStream = await navigator.mediaDevices.getDisplayMedia({
          video: { frameRate: 60 },
          audio: true,
          preferCurrentTab: true,
          selfBrowserSurface: 'include'
        });
        const vTrack = recStream.getVideoTracks()[0];
        let cropped = false;
        if (window.CropTarget && vTrack && typeof vTrack.cropTo === 'function') {
          try {
            const cropTarget = await CropTarget.fromElement(reelContainer);
            await vTrack.cropTo(cropTarget);
            cropped = true;
          } catch (e) {
            console.warn('Region Capture tidak disokong, merakam seluruh tab:', e);
          }
        }
        if (vTrack) {
          vTrack.addEventListener('ended', () => stopRecording());
        }
        if (recStream.getAudioTracks().length === 0) {
          alert(
            currentLang === 'bm'
              ? 'Nota: Audio tab tidak dikongsi. Pastikan pilihan \u0022Share tab audio\u0022 ditanda supaya suara AI & muzik turut dirakam.'
              : 'Note: Tab audio was not shared. Please enable \u0022Share tab audio\u0022 so the AI voiceover and background music are recorded.'
          );
        }

        audio.pause();
        audio.currentTime = 0;
        hideOutro();
        currentCapIdx = -1;
        await runCountdown();

        const picked = pickMime();
        recExt = picked.ext;
        recordedChunks = [];
        mediaRecorder = picked.mime
          ? new MediaRecorder(recStream, { mimeType: picked.mime, videoBitsPerSecond: 8000000 })
          : new MediaRecorder(recStream);
        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) recordedChunks.push(e.data);
        };
        mediaRecorder.onstop = onRecordingStop;

        activateScene(0, 0, true);
        mediaRecorder.start(1000);
        recBadge.classList.add('active');
        recBtn.innerText = stopRecLabel();
        if (!cropped) console.info('Tip: Gunakan Google Chrome terkini supaya rakaman dipotong tepat pada bingkai 9:16 sahaja.');
        await audio.play();
      } catch (err) {
        alert(
          currentLang === 'bm'
            ? 'Untuk merakam secara manual tanpa perkongsian skrin, anda juga boleh menggunakan OBS Studio atau Xbox Game Bar (Win + G). Ralat: ' + err.message
            : 'To record manually without screen sharing, you can also use OBS Studio or Xbox Game Bar (Win + G). Error: ' + err.message
        );
      }
    }

    // ---------- INIT ----------
    applyLanguageTexts('bm');
    buildSegments();
    activateScene(0, 0, true);

    // Preview helper: ?scene=N shows a scene with all reveals completed (for thumbnails/testing)
    (function () {
      const params = new URLSearchParams(location.search);
      if (params.get('lang') === 'en') switchLanguage('en');
      const sceneParam = params.get('scene');
      if (sceneParam !== null) {
        const n = parseInt(sceneParam, 10);
        if (sceneParam === 'outro') {
          outroOverlay.classList.add('show');
        } else if (!isNaN(n)) {
          activateScene(n, 999, true);
          document.querySelectorAll('.count-up').forEach(el => { el.textContent = formatCount(el, Number(el.dataset.target) || 0); });
        }
      }
    })();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(workspaceDir, 'video', 'vertical-reel.html'), html, 'utf8');
fs.writeFileSync(path.join(workspaceDir, 'public', 'video.html'), html, 'utf8');
console.log('Berjaya mengemas kini video/vertical-reel.html & public/video.html (v2 Cinematic Edition: intro, reveal segerak, muzik latar, outro & export 9:16)!');
