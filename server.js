import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

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

    const resetLink = `http://localhost:5173/reset-password?token=dummy-token-123`;

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
    console.log("-----------------------------------------\n");

    res.status(200).json({ 
      message: 'E-mel tetapan semula telah dihantar ke peti masuk anda!'
    });

  } catch (error) {
    console.error('Ralat menghantar e-mel:', error);
    res.status(500).json({ message: 'Gagal menghantar e-mel. Sila pastikan e-mel dan App Password (kata laluan aplikasi) anda diisi dengan betul dalam fail .env.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend Server sedang berjalan di http://localhost:${PORT}`);
  console.log(`Menunggu permintaan API untuk menghantar e-mel sebenar...`);
});
