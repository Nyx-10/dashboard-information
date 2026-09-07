import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { AppContext } from '../context/AppContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

export function ChatbotWidget() {
  const { t } = useContext(LanguageContext);
  const { user, isChatbotOpen: isOpen, setIsChatbotOpen: setIsOpen } = useContext(AppContext);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hai! Saya **AdtecBot** ✨. Ada apa-apa soalan tentang sistem ini?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const generateBotResponse = async (userInput, currentMessages) => {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        return 'Sistem AI masih belum diaktifkan (API Key tiada). Sila masukkan API Key ke dalam fail .env ??';
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

      let historyText = "";
      if (currentMessages && currentMessages.length > 0) {
        // limit memory to last 8 messages to save tokens and keep context fresh
        const recentMessages = currentMessages.slice(-8);
        recentMessages.forEach(m => {
          historyText += `${m.sender === 'user' ? 'Pengguna' : 'AdtecBot'}: ${m.text}\n`;
        });
      }

      const prompt = `
Anda ialah AdtecBot, sebuah pembantu maya yang mesra, profesional, dan pintar untuk "Sistem Dashboard ADTEC Melaka" (kini dijenamakan sebagai Institut Teknologi Automotif Termaju PROTON / PROTON Institute).
Sistem ini berfungsi sebagai pusat maklumat rasmi (information hub) bagi warga institusi, DAN JUGA menyediakan kemudahan "Lost & Found" (Barang Hilang & Jumpa).
Tugas anda adalah menjawab SEBARANG soalan yang diajukan oleh pengguna tanpa sebarang had topik. Anda boleh menjawab soalan berkaitan sistem, ADTEC Melaka / PROTON Institute, sains, teknologi, nasihat, perbualan santai, dan apa sahaja topik umum seperti sebuah AI (Google Gemini) yang serba tahu. Jika anda tidak tahu maklumat terperinci tentang spesifik institusi, barulah suruh mereka rujuk pentadbiran.

Maklumat Sistem & Institusi:
1. Jika pengguna mahu melaporkan barang hilang, suruh mereka klik butang '+' (Missing Item) di menu kiri dan pilih kategori 'Lost Item'. Isikan nama, lokasi, dan gambar.
2. Jika pengguna menjumpai barang, suruh mereka klik butang '+' (Missing Item) dan pilih 'Found Item'.
3. Sistem ada fungsi 'Messages' (Mesej) untuk berbual dengan pengguna lain (secara 1 lawan 1) jika mereka mahu menghubungi orang yang terjumpa barang.
4. Terdapat fungsi carian pintar (Smart Search) di bahagian atas untuk mencari barang dengan pantas.
5. Jika masalah teknikal atau bot tidak dapat membantu, suruh pengguna tekan pautan 'Hubungi Admin' di bahagian bawah kotak sembang ini untuk menghantar e-mel secara terus kepada Admin.
6. Nama pengguna yang sedang bercakap dengan anda sekarang ialah: ${user?.name || 'Pelajar/Staf'}.
7. Mengenai Institusi & Portal Rasmi ADTEC Melaka / PROTON Institute:
   - Institusi ini adalah Institut Teknologi Automotif Termaju PROTON (PROTON Institute), iaitu Pusat Latihan Teknologi Tinggi (ADTEC) Melaka di bawah Jabatan Tenaga Manusia (JTM) dengan kerjasama syarikat automotif PROTON.
   - Lokasi Kampus: Bandar Vendor, Taboh Naning, 78000 Alor Gajah, Melaka (berhampiran Plaza Tol Simpang Ampat).
   - Laman Web Rasmi ADTEC Melaka / PROTON Institute: https://www.adtecmlk.gov.my
   - Portal Utama Jabatan Tenaga Manusia (JTM): https://www.jtm.gov.my
   - Portal Permohonan Kemasukan TVET (UP_TVET): https://mohon.tvet.gov.my
   - Laman Facebook Rasmi: https://www.facebook.com/people/Institut-Teknologi-Automotif-Termaju-Proton/100057440238476/
   - Hubungi: No. Telefon 06-552 7227, Emel proton_adtecmlk@jtm.gov.my
   - PENTING: Laman web rasmi institusi ini ialah https://www.adtecmlk.gov.my. JANGAN berikan domain lama "adtecmelaka.jtm.gov.my" (kerana sudah rosak/tidak wujud).

Gaya bahasa:
Gunakan Bahasa Melayu yang santai tapi profesional (seperti bercakap dengan rakan universiti). Boleh campur sikit singkatan biasa seperti 'nak', 'tak', 'boleh', tapi kekalkan adab. Gunakan emoji untuk nampak mesra. 
JANGAN beri jawapan terlalu panjang. Jawab dengan ringkas dan padat (maksimum 2-3 perenggan pendek).

Sejarah Perbualan:
${historyText}

Mesej terbaru pengguna: "${userInput}"
AdtecBot:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("AI Error:", error);
      return "Maaf, otak AI saya sedang mengalami masalah teknikal buat masa ini. Error: " + error.message;
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const botResponse = await generateBotResponse(userMsg.text, messages);
    
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: 'bot',
      text: botResponse,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setIsTyping(false);
  };

  const formatText = (text) => {
    const regex = /(\[.*?\]\(https?:\/\/[^\s\)]+\)|\*\*.*?\*\*|https?:\/\/[^\s]+)/g;
    const parts = text.split(regex);
    return parts.map((part, i) => {
      if (!part) return null;
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: 'inherit' }}>{part.slice(2, -2)}</strong>;
      }
      const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/[^\s\)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={i}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#818CF8', textDecoration: 'underline', wordBreak: 'break-all' }}
          >
            {linkMatch[1]}
          </a>
        );
      }
      if (part.startsWith('http://') || part.startsWith('https://')) {
        let cleanUrl = part;
        let trailingPunct = '';
        const punctMatch = cleanUrl.match(/[.,!?)]+$/);
        if (punctMatch) {
          trailingPunct = punctMatch[0];
          cleanUrl = cleanUrl.slice(0, -trailingPunct.length);
        }
        return (
          <span key={i}>
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#818CF8', textDecoration: 'underline', wordBreak: 'break-all' }}
            >
              {cleanUrl}
            </a>
            {trailingPunct}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-container">
      <div className="chatbot-window modal-bounce">
        <div className="chatbot-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #4F46E5, #ec4899)', padding: '0.5rem', borderRadius: '50%', color: 'white', display: 'flex', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)' }}>
              <Bot size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                AdtecBot <Sparkles size={14} color="#fcd34d" />
              </h3>
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: 6, height: 6, background: '#10B981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 5px #10B981' }}></span> Sentiasa Online (AI)
              </span>
            </div>
          </div>
          <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="chatbot-messages-container">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot';
            return (
              <div key={msg.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignSelf: isBot ? 'flex-start' : 'flex-end', flexDirection: isBot ? 'row' : 'row-reverse', maxWidth: '85%' }}>
                {isBot && (
                  <div style={{ background: 'linear-gradient(135deg, #4F46E5, #ec4899)', width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginTop: '0.25rem' }}>
                    <Bot size={16} />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isBot ? 'flex-start' : 'flex-end' }}>
                  <div className={isBot ? 'chatbot-bubble-bot' : 'chatbot-bubble-user'}>
                    {msg.text.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {formatText(line)}
                        {idx !== msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem', padding: '0 0.25rem' }}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignSelf: 'flex-start', maxWidth: '85%' }}>
              <div style={{ background: 'linear-gradient(135deg, #4F46E5, #ec4899)', width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginTop: '0.25rem' }}>
                <Bot size={16} />
              </div>
              <div className="chatbot-bubble-bot typing-indicator-bubble" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '1rem' }}>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="chatbot-input-area">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya sesuatu kepada AI..." 
            className="chatbot-input"
          />
          <button type="submit" className="chatbot-send-btn" disabled={!input.trim() || isTyping}>
            <Send size={18} />
          </button>
        </form>
        <div style={{ textAlign: 'center', padding: '0.5rem', background: 'var(--surface)', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.75rem' }}>
          <a href="mailto:adam.darwish.it@gmail.com" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
            Bot tidak dapat membantu? <span style={{ color: '#818CF8', fontWeight: 600 }}>Hubungi Admin</span>
          </a>
        </div>
      </div>
    </div>
  );
}
