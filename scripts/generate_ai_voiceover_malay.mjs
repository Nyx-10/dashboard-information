import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.resolve(__dirname, '..');
const audioDir = path.join(workspaceDir, 'video', 'audio');

function pcmToWav(pcmBuffer, sampleRate = 24000, channels = 1) {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * channels * 2, 28);
  header.writeUInt16LE(channels * 2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmBuffer.length, 40);
  return Buffer.concat([header, pcmBuffer]);
}

function wavToPcm(wavBuffer) {
  return wavBuffer.subarray(44);
}

async function generateTTSMalay(text, voiceName = 'Aoede', timeoutMs = 45000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash-tts:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: text
          }]
        }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceName
              }
            }
          }
        }
      })
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    const b64 = data.candidates[0].content.parts[0].inlineData.data;
    return Buffer.from(b64, 'base64');
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

const scriptsBM = [
  {
    filename: 'part1_hook_problem_bm.wav',
    title: 'Babak 1: Isu Semasa & Soalan Pembuka (BM)',
    text: "Assalamualaikum dan salam sejahtera kepada barisan panel penilai CIFPEC 2026. Kami dari ADTEC Melaka dengan bangganya mempersembahkan inovasi Dashboard ADTEC Melaka. Pernahkah anda terlepas hebahan penting kolej kerana tertimbus dalam ratusan mesej harian WhatsApp? Atau anda pernah kehilangan kunci kenderaan, kad matrik, mahupun komputer riba di bengkel kolej tanpa sebarang platform berpusat untuk menjejaknya? Kaedah konvensional menggunakan papan kenyataan kertas yang mudah rosak dan usang, manakala perkongsian nombor telefon peribadi secara terbuka di grup awam mendedahkan pelajar kepada risiko pencerobohan privasi dan penipuan. Atas faktor inilah, kami membangunkan penyelesaian pintar ini."
  },
  {
    filename: 'part2_solution_architecture_bm.wav',
    title: 'Babak 2: Pengenalan Solusi & Seni Bina (BM)',
    text: "Dashboard ADTEC Melaka merupakan hab kampus digital mesra alam yang menyatukan hebahan rasmi kolej, paparan Kiosk TV digital, serta sistem penjejakan barangan hilang berkuasa kecerdasan buatan dalam satu platform bersepadu. Dibangunkan berasaskan teknologi web moden terkini React 19, pangkalan data masa nyata Supabase WebSockets, dan Google Gemini AI, ia membolehkan data dikemas kini secara langsung tanpa perlu memuat semula pelayar. Malah melalui sokongan Progressive Web App, warga kolej boleh memasangnya terus ke telefon pintar Android dan iOS seperti aplikasi natif tanpa melalui app store."
  },
  {
    filename: 'part3_demo_walkthrough_bm.wav',
    title: 'Babak 3: Demonstrasi Sistem Langsung (BM)',
    text: "Jadi, bagaimanakah sistem ini berfungsi? Pertama, pengguna melayari dashboard berpusat untuk melihat memo rasmi pentadbiran, aktiviti sukan, dan hebahan akademik secara teratur. Kedua, bagi paparan menyeluruh kampus, Mod Kiosk TV beroperasi pada skrin televisyen di lobi dan kafeteria berserta jam masa nyata dan berita bergulir. Ketiga, apabila pelajar menjumpai barang tercicir, mereka hanya perlu memuat naik gambar, memilih lokasi penemuan seperti di bengkel atau surau, dan laporan akan terus terpapar kepada seluruh warga kolej dalam masa nyata. Akhir sekali, pemilik boleh menuntut barangan melalui ruang sembang tertutup tanpa perlu mendedahkan nombor WhatsApp peribadi. Selain itu, pembantu maya AdtecBot berkuasa Google Gemini sedia membantu menjawab sebarang pertanyaan seputar kolej 24 jam sehari."
  },
  {
    filename: 'part4_novelty_advantages_bm.wav',
    title: 'Babak 4: Nilai Tambah & Kampus Hijau (BM)',
    text: "Bukan sekadar menyelesaikan kelewatan komunikasi melalui penyegerakan awan seratus peratus masa nyata, inovasi ini turut menyokong inisiatif Kampus Hijau dengan mengurangkan pembaziran cetakan kertas notis sehingga 90 peratus. Keselamatan dan privasi data pelajar dipelihara sepenuhnya menggunakan pengesahan OTP e-mel rasmi serta polisi Row Level Security Supabase. Tempoh pemulangan barangan tercicir juga berjaya disingkatkan daripada berminggu-minggu kepada beberapa jam sahaja."
  },
  {
    filename: 'part5_impact_conclusion_bm.wav',
    title: 'Babak 5: Skalabiliti TVET & Penutup (BM)',
    text: "Dari sudut kebolehpasaran dan pelaksanaan, seni bina modularnya membolehkan sistem ini direplikasi dengan mudah ke kesemua 33 buah institusi latihan JTM dan politeknik di seluruh negara. Kesimpulannya, Dashboard ADTEC Melaka mentransformasikan tadbir urus kampus ke arah ekosistem TVET yang pintar, selamat dan mampan. Imbas kod QR di skrin anda sekarang untuk mencuba sistem live kami di dashboard-information-nu.vercel.app. Sekian, terima kasih kepada barisan panel penilai CIFPEC 2026!"
  }
];

async function main() {
  console.log('Mula menjana suara AI Bahasa Melayu (5 bahagian)...');
  const pcmList = [];

  for (let i = 0; i < scriptsBM.length; i++) {
    const item = scriptsBM[i];
    const targetFile = path.join(audioDir, item.filename);
    console.log(`[${i + 1}/${scriptsBM.length}] Menjana: ${item.title}...`);
    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const pcm = await generateTTSMalay(item.text, 'Aoede', 45000);
        const wav = pcmToWav(pcm, 24000, 1);
        fs.writeFileSync(targetFile, wav);
        pcmList.push(pcm);
        console.log(`  -> Berjaya: ${item.filename} (${(wav.length / 1024).toFixed(1)} KB)`);
        success = true;
        break;
      } catch (err) {
        console.warn(`  -> Cubaan ${attempt} gagal: ${err.message}. Mencuba lagi...`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    if (!success) {
      console.error(`Gagal menjana ${item.filename}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  if (pcmList.length === scriptsBM.length) {
    const masterPcm = Buffer.concat(pcmList);
    const masterWav = pcmToWav(masterPcm, 24000, 1);
    const masterPath = path.join(audioDir, 'full_voiceover_bahasa_melayu.wav');
    fs.writeFileSync(masterPath, masterWav);
    console.log(`\n🎉 MASTER AUDIO BAHASA MELAYU BERJAYA DIJANA: full_voiceover_bahasa_melayu.wav (${(masterWav.length / 1024 / 1024).toFixed(2)} MB, durasi ~${(masterPcm.length / 48000).toFixed(1)}s)`);
  }
}

main();
