import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { AppContext } from '../context/AppContext';

export function ChatbotWidget() {
  const { t } = useContext(LanguageContext);
  const { user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hai! Saya **AdtecBot** 🤖\n\nSaya pembantu pintar anda. Ada apa-apa soalan mengenai cara melaporkan barang hilang, atau anda sedang mencari sesuatu?',
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

  const generateBotResponse = (userInput) => {
    const text = userInput.toLowerCase();
    if (text.includes('hilang') || text.includes('hilangkan')) {
      return 'Untuk melaporkan barang yang hilang, anda boleh klik butang **"Missing Item"** (ikon +) di menu sebelah kiri. Pilih kategori **"Lost Item"** dan isikan butiran seperti nama barang, lokasi akhir dan gambar jika ada.';
    } else if (text.includes('jumpa') || text.includes('dijumpai')) {
      return 'Wah, bagusnya anda jumpa barang! 🎉\nSila klik butang **"Missing Item"** (ikon +) dan pilih kategori **"Found Item"** supaya pemiliknya boleh menuntut barang tersebut.';
    } else if (text.includes('admin') || text.includes('pejabat')) {
      return 'Jika anda mempunyai isu teknikal atau pertanyaan lanjut, anda boleh mesej **Super Admin** atau terus rujuk kepada Pejabat HEP Adtec Melaka.';
    } else if (text.includes('nama') && text.includes('saya')) {
      return `Nama anda ialah ${user?.name || 'Pengguna'}. Boleh saya bantu perkara lain?`;
    } else if (text.includes('hai') || text.includes('hello') || text.includes('salam')) {
      return 'Hai! Selamat datang ke platform Lost & Found Adtec Melaka. Ada apa-apa yang boleh saya bantu?';
    } else if (text.includes('terima kasih') || text.includes('tq')) {
      return 'Sama-sama! Gembira dapat membantu. 😊';
    }
    
    return 'Maaf, buat masa ini saya masih dalam proses pembelajaran (Beta). 😅\n\nSila gunakan kata kunci seperti **hilang**, **jumpa**, atau **admin** untuk saya bantu anda dengan lebih baik.';
  };

  const handleSend = (e) => {
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

    setTimeout(() => {
      const botResponse = generateBotResponse(userMsg.text);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setIsTyping(false);
    }, 1200);
  };

  const formatText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ color: 'inherit' }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="chatbot-container">
      {isOpen && (
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
                  <span style={{ width: 6, height: 6, background: '#10B981', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 5px #10B981' }}></span> Sentiasa Online
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
              placeholder="Tanya sesuatu..." 
              className="chatbot-input"
            />
            <button type="submit" className="chatbot-send-btn" disabled={!input.trim() || isTyping}>
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button className={`chatbot-fab ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)} title="Bantuan AdtecBot">
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}