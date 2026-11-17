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
  // Strip 44-byte header
  return wavBuffer.subarray(44);
}

function matchDurationWithSentencePauses(enPcm, targetByteLen) {
  if (!targetByteLen || enPcm.length >= targetByteLen) return enPcm.subarray(0, targetByteLen || enPcm.length);
  const neededBytes = targetByteLen - enPcm.length;
  const winBytes = 960;
  const nWins = Math.floor(enPcm.length / winBytes);
  const silentWins = [];
  for (let w = 2; w < nWins - 2; w++) {
    let sumSq = 0;
    const off = w * winBytes;
    for (let i = 0; i < winBytes; i += 2) {
      const s = enPcm.readInt16LE(off + i);
      sumSq += s * s;
    }
    const rms = Math.sqrt(sumSq / (winBytes / 2));
    if (rms < 120) silentWins.push(w);
  }
  if (silentWins.length === 0) {
    return Buffer.concat([enPcm, Buffer.alloc(neededBytes)]);
  }
  const extraPerWin = Math.floor(neededBytes / silentWins.length / 2) * 2;
  let rem = neededBytes - extraPerWin * silentWins.length;
  const silentSet = new Set(silentWins);
  const chunks = [];
  for (let w = 0; w < nWins; w++) {
    chunks.push(enPcm.subarray(w * winBytes, (w + 1) * winBytes));
    if (silentSet.has(w)) {
      const add = extraPerWin + (rem > 0 ? 2 : 0);
      if (rem > 0) rem -= 2;
      if (add > 0) chunks.push(Buffer.alloc(add));
    }
  }
  if (nWins * winBytes < enPcm.length) {
    chunks.push(enPcm.subarray(nWins * winBytes));
  }
  if (rem > 0) chunks.push(Buffer.alloc(rem));
  return Buffer.concat(chunks);
}

async function generateTTSWithTimeout(text, voiceName = 'Aoede', timeoutMs = 45000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: text }] }],
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

const publicAudioDir = path.join(workspaceDir, 'public', 'audio');

const scripts = [
  {
    filename: 'part1_hook_problem.wav',
    title: 'Part 1: The Hook & Campus Problems',
    text: "Assalamualaikum and warm greetings to the honorable CIFPEC 2026 judging panel. We from ADTEC Melaka proudly present our innovation, Dashboard ADTEC Melaka. Have you ever missed critical campus announcements because they were buried under hundreds of daily WhatsApp messages? Or have you ever lost your vehicle keys, student matric card, or laptop in college workshops, with no centralized platform to trace them? Conventional methods rely on physical notice boards with damaged paper posters, while sharing your personal phone number in public chat groups exposes students to privacy risks and scams. That is why we developed this integrated smart solution."
  },
  {
    filename: 'part2_solution_architecture.wav',
    title: 'Part 2: The Solution & Technical Architecture',
    text: "Dashboard ADTEC Melaka is an eco-friendly digital campus hub that unites official college announcements, digital TV kiosk signage, and an AI-powered lost and found tracking system into a single unified platform. Developed using modern web architecture including React 19, Supabase Realtime WebSockets, and Google Gemini AI, it delivers instant live updates without requiring any page refreshes. Furthermore, with Progressive Web App support, students and staff can install it directly on Android and iOS smartphones like a native app without third-party app stores."
  },
  {
    filename: 'part3_demo_walkthrough.wav',
    title: 'Part 3: Step-by-Step Live Demonstration',
    text: "So, how does this system work? First, users access the centralized dashboard to view categorized administrative memos, sports activities, and academic announcements. Second, for campus-wide visibility, our TV Kiosk mode operates on television screens in lobbies and cafeterias, complete with real-time clocks and scrolling news tickers. Third, when a student finds a misplaced item, they simply upload a photo, select the discovery location such as the workshop or surau, and the report is displayed live to the entire college community in real time. Lastly, the owner can claim the item through a built-in private chat room without exposing personal WhatsApp numbers. In addition, our virtual assistant AdtecBot powered by Google Gemini is ready to answer campus inquiries 24 hours a day."
  },
  {
    filename: 'part4_novelty_advantages.wav',
    title: 'Part 4: Key Novelty & Sustainability',
    text: "Beyond solving communication delays through 100 percent real-time cloud synchronization, this innovation also champions the Green Campus initiative by reducing physical paper notice printing waste by up to 90 percent. Student data security and privacy are fully safeguarded using official email OTP verification and Supabase Row Level Security policies. Misplaced item recovery time is also shortened from weeks to just a few hours."
  },
  {
    filename: 'part5_impact_conclusion.wav',
    title: 'Part 5: Scalability & Conclusion',
    text: "From a marketability and deployment perspective, its modular architecture enables this system to be easily replicated across all 33 JTM training institutes and polytechnics nationwide. In conclusion, Dashboard ADTEC Melaka transforms campus governance towards a smart, secure, and sustainable TVET ecosystem. Scan the QR code on your screen now to test our live system at dashboard-information-nu.vercel.app. Thank you to the honorable CIFPEC 2026 judging panel!"
  }
];

async function main() {
  console.log('Menjana semula suara AI Bahasa Inggeris (5 bahagian, sepadan 1:1 dengan Bahasa Melayu)...');
  for (let i = 0; i < scripts.length; i++) {
    const item = scripts[i];
    const targetFile = path.join(audioDir, item.filename);
    console.log(`[${i+1}/${scripts.length}] Menjana: ${item.title}...`);
    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const rawPcm = await generateTTSWithTimeout(item.text, 'Aoede', 45000);
        const bmFile = path.join(audioDir, item.filename.replace('.wav', '_bm.wav'));
        const targetByteLen = fs.existsSync(bmFile) ? wavToPcm(fs.readFileSync(bmFile)).length : rawPcm.length;
        const pcm = matchDurationWithSentencePauses(rawPcm, targetByteLen);
        const wav = pcmToWav(pcm, 24000, 1);
        fs.writeFileSync(targetFile, wav);
        fs.writeFileSync(path.join(publicAudioDir, item.filename), wav);
        console.log(`  -> Berjaya cubaan ${attempt}: ${item.filename} (${(wav.length / 1024).toFixed(1)} KB, ~${(pcm.length / 48000).toFixed(2)}s)`);
        success = true;
        break;
      } catch (err) {
        console.warn(`  -> Cubaan ${attempt} gagal (${err.message}). Menunggu 2s...`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    if (!success) {
      console.error(`Gagal menjana ${item.filename}`);
    }
    await new Promise(r => setTimeout(r, 1000));
  }

  // Combine all 5 files
  console.log('Menggabungkan kesemua 5 bahagian ke dalam satu fail master audio...');
  const pcmList = [];
  for (const item of scripts) {
    const filePath = path.join(audioDir, item.filename);
    if (fs.existsSync(filePath)) {
      const wavBuf = fs.readFileSync(filePath);
      pcmList.push(wavToPcm(wavBuf));
    }
  }

  if (pcmList.length === 5) {
    const masterPcm = Buffer.concat(pcmList);
    const masterWav = pcmToWav(masterPcm, 24000, 1);
    const masterPath = path.join(audioDir, 'full_citec_style_voiceover.wav');
    fs.writeFileSync(masterPath, masterWav);
    fs.writeFileSync(path.join(publicAudioDir, 'full_citec_style_voiceover.wav'), masterWav);
    console.log(`MASTER AUDIO BERJAYA DISIMPAN: full_citec_style_voiceover.wav (${(masterWav.length / 1024 / 1024).toFixed(2)} MB, durasi ~${(masterPcm.length / 48000).toFixed(2)} saat)`);
  }
}

main();
