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

app.post('/api/send-notification-email', async (req, res) => {
  const { email, title, message, html } = req.body;

  if (!email || !title || !message) {
    return res.status(400).json({ message: 'Maklumat tidak lengkap.' });
  }

  try {
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
      subject: title,
      text: message,
      html: html || `<b>${title}</b><br><br><p>${message}</p>`,
    });

    res.status(200).json({ success: true, message: 'Notifikasi e-mel berjaya dihantar.' });
  } catch (error) {
    console.error('Ralat menghantar e-mel notifikasi:', error);
    res.status(500).json({ message: 'Gagal menghantar e-mel.' });
  }
});

// Langganan kehadiran Supabase Realtime untuk menyemak status pengguna online
const onlineUsersSet = new Set();
try {
  const presenceChannel = supabase.channel('online-users');
  presenceChannel
    .on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState();
      onlineUsersSet.clear();
      Object.keys(state).forEach(id => onlineUsersSet.add(id));
    })
    .subscribe();
} catch (e) {
  console.warn('Backend presence channel error:', e.message);
}

app.post('/api/send-message-notification', async (req, res) => {
  const { recipientId, senderId, senderName, content, recipientEmail, isRecipientOnline } = req.body;

  if (!recipientId && !recipientEmail) {
    return res.status(400).json({ message: 'Maklumat penerima diperlukan.' });
  }

  // 1. Sekiranya penerima sedang ONLINE, BATALKAN notifikasi e-mel serta-merta
  if (isRecipientOnline === true || (recipientId && onlineUsersSet.has(recipientId))) {
    console.log(`[NOTIF] Penerima (${recipientId}) disahkan sedang ONLINE. E-mel tidak dihantar.`);
    return res.status(200).json({ 
      success: true, 
      sent: false, 
      message: 'Penerima sedang online di dalam sistem; notifikasi e-mel tidak diperlukan.' 
    });
  }

  // 2. Pastikan PENGIRIM tidak sesekali menerima e-mel untuk mesej yang dihantar sendiri
  if (senderId && recipientId && String(senderId) === String(recipientId)) {
    console.log(`[NOTIF] Pengirim (${senderId}) sama dengan penerima (${recipientId}). Tiada e-mel dihantar.`);
    return res.status(200).json({ 
      success: true, 
      sent: false, 
      message: 'Pengirim tidak akan menerima notifikasi e-mel mesej sendiri.' 
    });
  }

  try {
    // 2. Dapatkan rekod profil penerima secara tepat dari database
    let recipientProfile = null;
    if (recipientId) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, username, email_notifs')
        .eq('id', recipientId)
        .single();
      if (!error && data) recipientProfile = data;
    } else if (recipientEmail) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, username, email_notifs')
        .eq('email', recipientEmail)
        .single();
      if (!error && data) recipientProfile = data;
    }

    if (!recipientProfile) {
      console.warn(`[NOTIF] Profil penerima tidak ditemui.`);
      return res.status(404).json({ message: 'Profil penerima tidak ditemui.' });
    }

    // 3. Pastikan HANYA hantar jika penerima klik/aktifkan "Terima e-mel apabila ada mesej baru masuk" (email_notifs === true)
    if (recipientProfile.email_notifs !== true) {
      console.log(`[NOTIF] Penerima (${recipientProfile.email}) tidak mengaktifkan tetapan terima e-mel (email_notifs is not true).`);
      return res.status(200).json({ 
        success: true, 
        sent: false, 
        message: 'Penerima tidak mengaktifkan pilihan terima notifikasi e-mel.' 
      });
    }

    const targetEmail = recipientProfile.email;
    const targetName = recipientProfile.username || 'Warga ADTEC';

    if (!targetEmail) {
      return res.status(400).json({ message: 'E-mel penerima tidak sah atau tidak dijumpai.' });
    }

    // 4. Semak profil pengirim untuk memastikan bukan akaun/e-mel yang sama
    let senderDisplay = senderName;
    if (senderId) {
      const { data: senderProfile } = await supabase
        .from('profiles')
        .select('id, email, username')
        .eq('id', senderId)
        .single();

      if (senderProfile) {
        if (senderProfile.email && senderProfile.email.trim().toLowerCase() === targetEmail.trim().toLowerCase()) {
          console.log(`[NOTIF] E-mel pengirim sama dengan penerima (${targetEmail}). Tiada e-mel dihantar.`);
          return res.status(200).json({ 
            success: true, 
            sent: false, 
            message: 'E-mel penerima sama dengan pengirim; dielakkan daripada menghantar salinan ke akaun sendiri.' 
          });
        }
        if (senderProfile.username) {
          senderDisplay = senderProfile.username;
        }
      }
    }

    senderDisplay = senderDisplay || 'Pengguna ADTEC';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const isImage = content && content.startsWith('[IMAGE]');
    const cleanContent = isImage 
      ? '📷 [Gambar Dihantar]' 
      : (content && content.length > 250 ? content.substring(0, 250) + '...' : (content || 'Mesej baharu'));

    const subject = `💬 Mesej Baharu daripada ${senderDisplay} - Dashboard ADTEC Melaka`;
    const frontendUrl = req.body.origin || req.headers.origin || process.env.VITE_FRONTEND_URL || 'http://localhost:5173';
    const chatLink = senderId ? `${frontendUrl}/messages?chat=${senderId}` : `${frontendUrl}/messages`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 32px 24px; text-align: center;">
          <img src="https://esijil.jtm.gov.my/images/toplogo1.png" alt="ADTEC Melaka" style="height: 48px; border-radius: 8px; margin-bottom: 12px; background: white; padding: 4px;" />
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.02em;">Dashboard ADTEC Melaka</h1>
          <p style="color: rgba(255, 255, 255, 0.85); margin: 6px 0 0; font-size: 13px;">Pusat Maklumat & Sistem Lost & Found Pintar (PROTON Institute)</p>
        </div>

        <!-- Body Content -->
        <div style="padding: 32px 28px; color: #1e293b;">
          <p style="font-size: 16px; margin: 0 0 16px; color: #0f172a;">Hai <strong>${targetName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px; color: #475569;">
            Anda mempunyai satu mesej baharu daripada <strong style="color: #4F46E5;">${senderDisplay}</strong> di Dashboard ADTEC Melaka:
          </p>

          <!-- Message Box -->
          <div style="background-color: #f8fafc; border-left: 4px solid #4F46E5; border-radius: 8px; padding: 18px 20px; margin: 0 0 28px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);">
            <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Pratonton Mesej</div>
            <div style="font-size: 14px; color: #0f172a; line-height: 1.5; font-style: italic;">
              "${cleanContent}"
            </div>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${chatLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: #4F46E5; color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);">
              💬 Buka & Balas Mesej
            </a>
            <p style="font-size: 12px; color: #64748b; margin-top: 14px; word-break: break-all; line-height: 1.5;">
              Sekiranya butang di atas tidak berfungsi, klik atau salin pautan ini untuk terus ke website:<br>
              <a href="${chatLink}" target="_blank" rel="noopener noreferrer" style="color: #4F46E5; text-decoration: underline; font-weight: 500;">${chatLink}</a>
            </p>
          </div>

          <!-- Divider -->
          <div style="height: 1px; background-color: #f1f5f9; margin-bottom: 20px;"></div>

          <!-- Footer Note -->
          <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
            🔔 E-mel ini dihantar khas kepada <strong>${targetEmail}</strong> kerana anda telah mengaktifkan tetapan <strong>"Terima e-mel apabila ada mesej baru masuk"</strong>. Anda boleh menukar pilihan ini pada bila-bila masa di menu <a href="${frontendUrl}/profile" style="color: #4F46E5;">Tetapan Profil</a>.
          </p>
        </div>
      </div>
    `;

    const plainText = `Hai ${targetName},\n\nAnda mempunyai satu mesej baharu daripada ${senderDisplay}:\n\n"${cleanContent}"\n\nSila klik pautan ini untuk terus membuka website dan membalas mesej:\n${chatLink}\n\nDashboard ADTEC Melaka`;

    // Pastikan HANYA penerima (targetEmail) yang menerima e-mel ini. Tiada CC dan tiada BCC.
    const info = await transporter.sendMail({
      from: `"Dashboard ADTEC Melaka" <${process.env.EMAIL_USER}>`,
      to: targetEmail,
      subject: subject,
      text: plainText,
      html: htmlContent,
    });

    console.log(`[EMAIL] Notifikasi mesej HANYA dihantar kepada penerima sah: ${targetEmail} (MessageId: ${info.messageId})`);

    res.status(200).json({ success: true, sent: true, recipient: targetEmail, messageId: info.messageId });
  } catch (error) {
    console.error('Ralat menghantar e-mel notifikasi mesej:', error);
    res.status(500).json({ message: 'Gagal menghantar e-mel: ' + error.message });
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
