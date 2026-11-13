import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const TARGET_URL = (process.argv[2] || 'https://dashboard-information-nu.vercel.app').replace(/\/+$/, '');
const DISPLAY_DOMAIN = TARGET_URL.replace(/^https?:\/\//, '');
const ADTEC_PORTAL_URL = 'https://www.adtecmlk.gov.my';
const GITHUB_REPO_URL = 'https://github.com/Nyx-10/dashboard-information';

const outputDir = path.join(rootDir, 'qr-codes');
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateAll() {
  console.log(`\n======================================================`);
  console.log(`🚀 Menjana Kod QR untuk: ${TARGET_URL}`);
  console.log(`======================================================\n`);

  // 1. Standard PNG (1024x1024, Error Correction M)
  const png1024Path = path.join(outputDir, 'dashboard-adtec-melaka-1024.png');
  await QRCode.toFile(png1024Path, TARGET_URL, {
    width: 1024,
    margin: 2,
    color: {
      dark: '#0f172a', // Slate 900
      light: '#ffffff'
    },
    errorCorrectionLevel: 'M'
  });
  console.log(`✅ [1/7] PNG 1024x1024: qr-codes/dashboard-adtec-melaka-1024.png`);

  // 2. High-Res PNG for Print / Poster (2048x2048, Error Correction H)
  const png2048Path = path.join(outputDir, 'dashboard-adtec-melaka-print-2048.png');
  await QRCode.toFile(png2048Path, TARGET_URL, {
    width: 2048,
    margin: 3,
    color: {
      dark: '#0a0f1d',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });
  console.log(`✅ [2/7] PNG Cetakan HD 2048x2048: qr-codes/dashboard-adtec-melaka-print-2048.png`);

  // 3. Transparent PNG (1024x1024)
  const pngTransPath = path.join(outputDir, 'dashboard-adtec-melaka-transparent.png');
  await QRCode.toFile(pngTransPath, TARGET_URL, {
    width: 1024,
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#00000000'
    },
    errorCorrectionLevel: 'H'
  });
  console.log(`✅ [3/7] PNG Lutsinar (Transparent): qr-codes/dashboard-adtec-melaka-transparent.png`);

  // 4. Clean Vector SVG
  const rawSvg = await QRCode.toString(TARGET_URL, {
    type: 'svg',
    margin: 2,
    color: {
      dark: '#0f172a',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  });
  const svgPath = path.join(outputDir, 'dashboard-adtec-melaka.svg');
  fs.writeFileSync(svgPath, rawSvg, 'utf8');
  console.log(`✅ [4/7] Vektor SVG: qr-codes/dashboard-adtec-melaka.svg`);

  // 5. Branded Poster / Standee SVG Card (Vector Ready)
  // Extract pure QR SVG content (without outer svg tags)
  const innerSvgMatch = rawSvg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerSvgContent = innerSvgMatch ? innerSvgMatch[1] : '';
  const viewBoxMatch = rawSvg.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 35 35';

  const brandedCardSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1080" width="800" height="1080">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0f1d" />
      <stop offset="50%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.95" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
    <linearGradient id="btnGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#000000" flood-opacity="0.5" />
    </filter>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="30" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;family=JetBrains+Mono:wght@600&amp;display=swap');
    text { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>

  <!-- Background Canvas -->
  <rect width="800" height="1080" fill="url(#bgGrad)" />

  <!-- Background Decorative Glowing Orbs -->
  <circle cx="200" cy="200" r="160" fill="#38bdf8" opacity="0.12" filter="url(#glow)" />
  <circle cx="650" cy="550" r="180" fill="#6366f1" opacity="0.12" filter="url(#glow)" />
  <circle cx="250" cy="950" r="150" fill="#a855f7" opacity="0.10" filter="url(#glow)" />

  <!-- Outer Card Frame -->
  <rect x="50" y="50" width="700" height="980" rx="36" fill="url(#cardGrad)" stroke="#334155" stroke-width="2" filter="url(#shadow)" />

  <!-- Top Accent Color Bar -->
  <rect x="50" y="50" width="700" height="8" rx="4" fill="url(#accentGrad)" />

  <!-- Institution Pill -->
  <g transform="translate(400, 115)">
    <rect x="-180" y="-18" width="360" height="36" rx="18" fill="#1e293b" stroke="#475569" stroke-width="1.2" />
    <text text-anchor="middle" y="5" font-size="13" font-weight="700" fill="#38bdf8" letter-spacing="1.5">ADTEC MELAKA • PROTON INSTITUTE</text>
  </g>

  <!-- Main Heading -->
  <text text-anchor="middle" x="400" y="195" font-size="34" font-weight="800" fill="#ffffff" letter-spacing="-0.5">SISTEM DASHBOARD KAMPUS</text>
  <text text-anchor="middle" x="400" y="230" font-size="16" font-weight="500" fill="#94a3b8">Portal Maklumat Digital &amp; Lost-and-Found Pintar Realtime</text>

  <!-- QR Code White Card Container -->
  <g transform="translate(160, 275)" filter="url(#shadow)">
    <!-- White Card Background -->
    <rect width="480" height="480" rx="28" fill="#ffffff" />
    <!-- Inner Accent Border -->
    <rect x="12" y="12" width="456" height="456" rx="20" fill="none" stroke="#e2e8f0" stroke-width="2" />

    <!-- Pure Scannable QR Code -->
    <svg x="25" y="25" width="430" height="430" viewBox="${viewBox}" shape-rendering="crispEdges">
      ${innerSvgContent}
    </svg>
  </g>

  <!-- URL Pill Button -->
  <g transform="translate(400, 815)">
    <rect x="-240" y="-22" width="480" height="44" rx="22" fill="url(#btnGrad)" />
    <!-- Lock Icon -->
    <g transform="translate(-205, -9) scale(0.8)">
      <path fill="#ffffff" d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 7a2 2 0 0 1 2 2v1a2 2 0 1 1-4 0v-1a2 2 0 0 1 2-2z"/>
    </g>
    <text text-anchor="middle" x="12" y="6" font-size="16" font-weight="700" fill="#ffffff" class="mono">${DISPLAY_DOMAIN}</text>
  </g>

  <!-- Scan Instruction -->
  <g transform="translate(400, 900)">
    <!-- Scan Icon -->
    <g transform="translate(-18, -32) scale(1.5)">
      <path fill="#38bdf8" d="M3 7V5a2 2 0 0 1 2-2h2 M17 3h2a2 2 0 0 1 2 2v2 M21 17v2a2 2 0 0 1-2 2h-2 M7 21H5a2 2 0 0 1-2-2v-2" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" fill="none"/>
      <circle cx="12" cy="12" r="2.5" fill="#38bdf8" />
    </g>
    <text text-anchor="middle" y="24" font-size="16" font-weight="600" fill="#f1f5f9">Imbas kod QR menggunakan kamera telefon anda</text>
    <text text-anchor="middle" y="48" font-size="13" font-weight="500" fill="#64748b">Akses terus ke aplikasi web tanpa perlu pasang sebarang aplikasi luar</text>
  </g>

  <!-- Card Footer -->
  <line x1="100" y1="975" x2="700" y2="975" stroke="#1e293b" stroke-width="1.5" />
  <text text-anchor="middle" x="400" y="1002" font-size="12" font-weight="500" fill="#475569">
    © 2026 Pusat Latihan Teknologi Tinggi (ADTEC) Melaka • Jabatan Tenaga Manusia (JTM)
  </text>
</svg>`;

  const brandedCardPath = path.join(outputDir, 'dashboard-adtec-melaka-card.svg');
  fs.writeFileSync(brandedCardPath, brandedCardSvg, 'utf8');
  console.log(`✅ [5/7] Kad Jenama (Branded Card) SVG: qr-codes/dashboard-adtec-melaka-card.svg`);

  // 6. Secondary QR Codes (Portal Rasmi & GitHub)
  const adtecPortalPng = path.join(outputDir, 'portal-rasmi-adtec.png');
  await QRCode.toFile(adtecPortalPng, ADTEC_PORTAL_URL, {
    width: 600,
    margin: 2,
    color: { dark: '#0f172a', light: '#ffffff' }
  });

  const githubPng = path.join(outputDir, 'github-repo.png');
  await QRCode.toFile(githubPng, GITHUB_REPO_URL, {
    width: 600,
    margin: 2,
    color: { dark: '#0f172a', light: '#ffffff' }
  });
  console.log(`✅ [6/7] QR Tambahan: portal-rasmi-adtec.png & github-repo.png`);

  // 7. Copy to public/ directory for direct web access
  fs.copyFileSync(png1024Path, path.join(publicDir, 'qr-code.png'));
  fs.copyFileSync(svgPath, path.join(publicDir, 'qr-code.svg'));
  fs.copyFileSync(brandedCardPath, path.join(publicDir, 'qr-code-card.svg'));
  fs.copyFileSync(png2048Path, path.join(publicDir, 'qr-code-print.png'));
  console.log(`✅ [7/7] Disalin ke folder public/ (public/qr-code.png, qr-code.svg, dsb.)`);

  // 8. Generate HTML Interactive Preview Page
  const htmlPreview = generatePreviewHtml(TARGET_URL);
  const htmlPath = path.join(outputDir, 'index.html');
  fs.writeFileSync(htmlPath, htmlPreview, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'qr-preview.html'), htmlPreview, 'utf8');
  console.log(`\n🎉 Selesai! Halaman Pratonton Interaktif siap di:`);
  console.log(`   - qr-codes/index.html`);
  console.log(`   - public/qr-preview.html\n`);
}

function generatePreviewHtml(url) {
  return `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QR Code — Dashboard ADTEC Melaka</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(17, 24, 39, 0.85);
      --card-border: rgba(255, 255, 255, 0.08);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #4f46e5;
      --primary-hover: #4338ca;
      --accent: #38bdf8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, var(--bg) 70%);
      color: var(--text);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 32px 16px;
    }
    .container {
      width: 100%;
      max-width: 720px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
    }
    .header {
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      color: var(--accent);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      color: var(--text-muted);
      font-size: 15px;
    }
    .qr-card {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      border-radius: 28px;
      padding: 36px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px rgba(99, 102, 241, 0.15);
      backdrop-filter: blur(16px);
      width: 100%;
    }
    .qr-canvas-wrap {
      background: #ffffff;
      padding: 20px;
      border-radius: 22px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qr-canvas-wrap img {
      width: 260px;
      height: 260px;
      display: block;
      image-rendering: pixelated;
    }
    .url-chip {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 10px 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #38bdf8;
      margin-bottom: 20px;
      word-break: break-all;
    }
    .url-chip a {
      color: inherit;
      text-decoration: none;
    }
    .url-chip a:hover {
      text-decoration: underline;
    }
    .copy-btn {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 4px;
      border-radius: 6px;
    }
    .copy-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.1);
    }
    .instructions {
      color: #94a3b8;
      font-size: 14px;
      text-align: center;
      margin-bottom: 28px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .download-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      width: 100%;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 18px;
      border-radius: 14px;
      font-size: 13.5px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-primary {
      background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    .footer {
      color: #64748b;
      font-size: 13px;
      text-align: center;
    }
    @media (max-width: 600px) {
      .qr-card { padding: 24px 16px; }
      .qr-canvas-wrap img { width: 200px; height: 200px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">Pusat Latihan Teknologi Tinggi Melaka</div>
      <h1>Kod QR Laman Web Projek</h1>
      <p class="subtitle">Imbas untuk akses terus ke Dashboard ADTEC Melaka</p>
    </div>

    <div class="qr-card">
      <div class="qr-canvas-wrap">
        <img src="dashboard-adtec-melaka-1024.png" alt="QR Code Dashboard ADTEC Melaka" id="qrImage" />
      </div>

      <div class="url-chip">
        <span>🔒</span>
        <a href="${url}" target="_blank" rel="noopener noreferrer" id="targetUrlText">${url}</a>
        <button class="copy-btn" onclick="copyUrl()" title="Salin URL">📋</button>
      </div>

      <div class="instructions">
        <span>📱</span> Halakan kamera telefon pintar anda untuk membuka portal
      </div>

      <div class="download-grid">
        <a href="dashboard-adtec-melaka-1024.png" download="dashboard-adtec-melaka-qr.png" class="btn btn-primary">
          💾 Muat Turun PNG (HD)
        </a>
        <a href="dashboard-adtec-melaka.svg" download="dashboard-adtec-melaka-qr.svg" class="btn btn-secondary">
          📐 Muat Turun SVG (Vektor)
        </a>
        <a href="dashboard-adtec-melaka-card.svg" download="dashboard-adtec-melaka-card.svg" class="btn btn-secondary">
          🎨 Kad Poster SVG
        </a>
        <a href="dashboard-adtec-melaka-print-2048.png" download="dashboard-adtec-melaka-2048.png" class="btn btn-secondary">
          🖨️ Format Cetakan (2K)
        </a>
      </div>
    </div>

    <div class="footer">
      Sistem Pengurusan Maklumat & Lost-Found Komuniti ADTEC Melaka © 2026
    </div>
  </div>

  <script>
    function copyUrl() {
      const text = document.getElementById('targetUrlText').innerText;
      navigator.clipboard.writeText(text).then(() => {
        alert('URL berjaya disalin: ' + text);
      });
    }
  </script>
</body>
</html>`;
}

generateAll().catch(err => {
  console.error('Error generating QR code:', err);
  process.exit(1);
});
