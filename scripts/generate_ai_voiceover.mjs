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
        contents: [{ parts: [{ text: `Please read aloud clearly: ${text}` }] }],
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

const scripts = [
  {
    filename: 'part1_hook_problem.wav',
    title: 'Part 1: The Hook & Campus Problems',
    text: "Have you ever faced problems such as missing critical campus announcements because they are buried under hundreds of daily WhatsApp messages? Or have you ever lost your vehicle keys, student matric card, or laptop in college workshops, with no centralized platform to trace them? Traditional methods rely on physical notice boards with damaged paper posters, or public chat groups where sharing your personal phone number exposes you to scams and privacy risks. That is why our team at ADTEC Melaka came up with an intelligent solution called Dashboard ADTEC Melaka."
  },
  {
    filename: 'part2_solution_architecture.wav',
    title: 'Part 2: The Solution & Technical Architecture',
    text: "Dashboard ADTEC Melaka is a modern, eco-friendly digital campus hub that unites official announcements, digital TV kiosk signage, and an AI-powered lost and found tracking system into a single unified platform. Developed using modern web architecture including React 19, Supabase Realtime WebSockets, and Google Gemini AI, it delivers instant live updates without requiring any page refreshes. Furthermore, with Progressive Web App support, students and staff can install it directly on Android and iOS devices without third-party app stores."
  },
  {
    filename: 'part3_demo_walkthrough.wav',
    title: 'Part 3: Step-by-Step Live Demonstration',
    text: "So, how does it work? First, users access the centralized campus dashboard to view categorized administrative notices, academic schedules, and club activities. Second, for campus-wide visibility, our TV Kiosk mode runs on displays in lobbies and cafeterias, featuring real-time clocks and automated news tickers. Third, when a student finds a misplaced item, they snap a photo, tag the campus location, and submit a report. The item is published instantly across the entire network. Lastly, the owner can claim the item through our built-in private chat, allowing safe verification without revealing personal WhatsApp numbers. In addition, our 24/7 virtual assistant, AdtecBot powered by Google Gemini, is always ready to guide students on campus procedures."
  },
  {
    filename: 'part4_novelty_advantages.wav',
    title: 'Part 4: Key Novelty & Sustainability',
    text: "Not only does Dashboard ADTEC Melaka eliminate communication delays with 100% realtime cloud synchronization, but it also champions the Green Campus initiative by reducing physical paper waste by up to 90%. Security and privacy are strictly safeguarded using official email OTP verification and Supabase Row Level Security. Lost item recovery time is shortened from weeks to just a few hours."
  },
  {
    filename: 'part5_impact_conclusion.wav',
    title: 'Part 5: Scalability & Conclusion',
    text: "From a commercialization and deployment perspective, its modular design enables seamless replication across all 33 ILJTM training institutes and polytechnics nationwide. In conclusion, Dashboard ADTEC Melaka transforms campus administration into a modern, sustainable, and smart TVET environment. Scan the QR code on your screen now to test the live portal at dashboard-information-nu.vercel.app. Thank you to the CIFPEC judging panel!"
  }
];

async function main() {
  console.log('Menyemak fail suara AI yang belum siap...');
  for (let i = 0; i < scripts.length; i++) {
    const item = scripts[i];
    const targetFile = path.join(audioDir, item.filename);
    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 100000) {
      console.log(`[${i+1}/${scripts.length}] Fail sedia ada: ${item.filename}`);
      continue;
    }
    console.log(`[${i+1}/${scripts.length}] Menjana: ${item.title}...`);
    let success = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const pcm = await generateTTSWithTimeout(item.text, 'Aoede', 15000);
        const wav = pcmToWav(pcm, 24000, 1);
        fs.writeFileSync(targetFile, wav);
        console.log(`  -> Berjaya cubaan ${attempt}: ${item.filename} (${(wav.length / 1024).toFixed(1)} KB)`);
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
    console.log(`MASTER AUDIO BERJAYA DISIMPAN: full_citec_style_voiceover.wav (${(masterWav.length / 1024 / 1024).toFixed(2)} MB, durasi ~${(masterPcm.length / 48000).toFixed(0)} saat)`);
  }
}

main();
