import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mel diperlukan.' });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minit
    
    // Simpan OTP ke dalam database Supabase (supaya Vercel tak lupa)
    await supabase.from('otps').upsert({ email, otp, expires_at: expires });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Adtec Melaka Dashboard" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Kod Pengesahan (OTP) Pendaftaran Anda",
      text: `Kod OTP anda ialah: ${otp}. Kod ini sah selama 10 minit.`,
      html: `<b>Kod OTP pendaftaran anda ialah:</b> <h2 style="letter-spacing: 5px; color: #4F46E5;">${otp}</h2><p>Kod ini sah selama 10 minit. Sila masukkan kod ini di laman pendaftaran.</p>`,
    });

    res.status(200).json({ message: 'OTP telah dihantar ke peti masuk anda!' });

  } catch (error) {
    console.error('Ralat menghantar e-mel:', error);
    res.status(500).json({ message: 'Gagal menghantar OTP. Sila pastikan e-mel dan App Password betul.' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, otp, password, name } = req.body;
  
  if (!email || !otp || !password) {
    return res.status(400).json({ message: 'Maklumat tidak lengkap.' });
  }

  // Dapatkan OTP dari Supabase
  const { data: record, error: fetchError } = await supabase.from('otps').select('*').eq('email', email).single();
  
  if (fetchError || !record || record.otp !== otp) {
    return res.status(400).json({ message: 'Kod OTP tidak sah.' });
  }
  
  if (record.expires_at < Date.now()) {
    await supabase.from('otps').delete().eq('email', email);
    return res.status(400).json({ message: 'Kod OTP telah luput.' });
  }

  try {
    // Daftar pengguna dalam Supabase melalui Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name: name || '' }
    });

    if (error) {
      throw error;
    }

    // Padam OTP selepas berjaya daftar
    await supabase.from('otps').delete().eq('email', email);
    
    res.status(200).json({ success: true, user: data.user, message: 'Pendaftaran berjaya disahkan.' });
  } catch (error) {
    console.error('Ralat pendaftaran Supabase:', error);
    res.status(500).json({ message: error.message || 'Gagal mendaftar pengguna.' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mel diperlukan.' });
  }

  try {
    // Cipta "transporter" SMTP untuk e-mel sebenar (Contoh: Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Gunakan 'gmail' jika menggunakan Google
      auth: {
        user: process.env.EMAIL_USER, // e-mel anda dari fail .env
        pass: process.env.EMAIL_PASS, // App Password anda dari fail .env
      },
    });

    // Gunakan VITE_FRONTEND_URL dari .env jika ada, jika tidak guna IP Address local anda (untuk testing di telefon)
    const frontendUrl = process.env.VITE_FRONTEND_URL || 'http://192.168.100.100:5173';
    
    // Jana link sebenar dari Supabase
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${frontendUrl}/reset-password`
      }
    });

    if (linkError) {
      throw new Error(linkError.message);
    }

    const resetLink = linkData.properties.action_link;
    // Hantar e-mel ke peti masuk (inbox) pengguna
    const info = await transporter.sendMail({
      from: `"Adtec Melaka Dashboard" <${process.env.EMAIL_USER}>`,
      to: email, // e-mel sebenar pengguna
      subject: "Tetapkan Semula Kata Laluan (Reset Password)",
      text: `Sila klik pautan ini untuk menetapkan semula kata laluan anda: ${resetLink}`,
      html: `<b>Sila klik pautan ini untuk menetapkan semula kata laluan anda:</b> <br><br> <a href="${resetLink}">${resetLink}</a>`,
    });

    console.log("\n-----------------------------------------");
    console.log("Mesej e-mel berjaya dihantar kepada: %s", email);
    console.log("Mesej ID: %s", info.messageId);
    console.log("Link dijana: %s", resetLink);
    console.log("-----------------------------------------\n");

    res.status(200).json({ 
      message: 'E-mel tetapan semula telah dihantar ke peti masuk anda!'
    });

  } catch (error) {
    console.error('Ralat menghantar e-mel:', error);
    res.status(500).json({ message: 'Ralat terperinci SMTP: ' + (error.message || 'Tidak diketahui') });
  }
});

// Untuk Local Development (Bukan di Vercel)
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`✅ Backend Server sedang berjalan di http://localhost:${PORT}`);
    console.log(`Menunggu permintaan API untuk menghantar e-mel sebenar...`);
  });
}

// Untuk Vercel Serverless Function
export default app;
