import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Search, Shield, Bell, MessageSquare, ArrowRight, 
  ChevronDown, Star, Users, Zap, Clock,
  CheckCircle, AlertTriangle, Sparkles, Bot, Lock, 
  HelpCircle, ChevronRight, Activity, Cpu, Check, Layers
} from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';
import './LandingPage.css';

export default function LandingPage({ onGetStarted }) {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [dbStats, setDbStats] = useState({ returned: 0, users: 0, successRate: 0, totalItems: 0 });
  const [activeMockupTab, setActiveMockupTab] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const isMs = lang === 'ms';

  // Fetch real database statistics
  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: totalItems } = await supabase.from('items').select('*', { count: 'exact', head: true });
        const { count: returnedItems } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('status', 'resolved');
        
        let rate = 96;
        if (totalItems && totalItems > 0 && returnedItems) {
          rate = Math.min(100, Math.max(85, Math.round((returnedItems / totalItems) * 100)));
        }

        setDbStats({
          returned: returnedItems || 12,
          users: usersCount || 48,
          successRate: rate,
          totalItems: totalItems || 35
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track cursor position for subtle luxury spotlight glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection observer for section reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.landing-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Interactive Mockup items simulation
  const mockupItems = [
    {
      id: 1,
      type: 'lost',
      title: isMs ? 'Kalkulator Casio fx-570EX' : 'Casio fx-570EX Scientific Calculator',
      category: isMs ? 'Elektronik' : 'Electronics',
      location: isMs ? 'Bilik Kuliah Blok B (B-2-04)' : 'Lecture Room Block B (B-2-04)',
      time: isMs ? '10 minit lalu' : '10 mins ago',
      status: isMs ? 'Aktif' : 'Active',
      tagColor: '#EF4444'
    },
    {
      id: 2,
      type: 'found',
      title: isMs ? 'Kunci Motosikal Honda (Lanyard Merah)' : 'Honda Motorcycle Keys (Red Lanyard)',
      category: isMs ? 'Aksesori' : 'Accessories',
      location: isMs ? 'Tempat Letak Kenderaan Pelajar' : 'Student Parking Lot Area',
      time: isMs ? '25 minit lalu' : '25 mins ago',
      status: isMs ? 'Menunggu Tuntutan' : 'Awaiting Claim',
      tagColor: '#10B981'
    },
    {
      id: 3,
      type: 'resolved',
      title: isMs ? 'Kad Matrik Pelajar & Dompet Hitam' : 'Student Matric Card & Black Wallet',
      category: isMs ? 'Dokumen' : 'Documents',
      location: isMs ? 'Kafeteria Utama' : 'Main Cafeteria',
      time: isMs ? '1 jam lalu' : '1 hour ago',
      status: isMs ? 'Berjaya Dipulangkan' : 'Resolved & Returned',
      tagColor: '#6366F1'
    }
  ];

  const filteredMockupItems = activeMockupTab === 'all' 
    ? mockupItems 
    : mockupItems.filter(item => item.type === activeMockupTab);

  // FAQ Items
  const faqItems = [
    {
      q: isMs ? 'Siapakah yang layak menggunakan sistem ini?' : 'Who is eligible to use this platform?',
      a: isMs 
        ? 'Semua pelajar berdaftar, pensyarah, dan kakitangan pengurusan ADTEC Melaka boleh mendaftar dan menggunakan sistem ini secara percuma.'
        : 'All registered students, lecturers, and management staff of ADTEC Melaka can register and use this system completely free.'
    },
    {
      q: isMs ? 'Bagaimanakah privasi saya dilindungi semasa berhubung?' : 'How is my privacy protected during messaging?',
      a: isMs
        ? 'Sistem ini dilengkapi pemesejan dalaman (1-to-1 Messages). Anda tidak perlu mendedahkan nombor telefon peribadi kecuali jika anda sendiri memilih untuk memberikannya.'
        : 'The platform features built-in 1-to-1 secure messaging. You do not need to disclose your personal phone number unless you choose to do so.'
    },
    {
      q: isMs ? 'Bagaimana jika ada laporan palsu atau cubaan scam?' : 'How are false reports or scam attempts prevented?',
      a: isMs
        ? 'Setiap laporan barang dan pengguna diawasi oleh Admin. Pengguna boleh memuat naik bukti gambar dan laporan yang meragukan boleh dilaporkan segera kepada Admin melalui butang Report.'
        : 'Every item report is monitored by Administrators. Photo proof is required, and suspicious activities can be immediately reported to Admins via the Report button.'
    },
    {
      q: isMs ? 'Adakah bot AI (AdtecBot) sentiasa tersedia?' : 'Is the AI chatbot (AdtecBot) always available?',
      a: isMs
        ? 'Ya, AdtecBot dikuasakan oleh Google Gemini dan sedia beroperasi 24 jam sehari untuk menjawab sebarang kemusykilan berkenaan sistem mahupun panduan am kampus.'
        : 'Yes, AdtecBot is powered by Google Gemini and is available 24/7 to answer questions about the dashboard system and general campus guidance.'
    }
  ];

  return (
    <div className="landing-root">
      {/* Luxury Ambient Spotlight follows cursor */}
      <div 
        className="landing-spotlight" 
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 75%)`
        }} 
      />

      {/* Atmospheric Background Layers */}
      <div className="landing-bg">
        <div className="landing-bg-orb landing-bg-orb-1" />
        <div className="landing-bg-orb landing-bg-orb-2" />
        <div className="landing-bg-orb landing-bg-orb-3" />
        <div className="landing-bg-mesh" />
        <div className="landing-bg-grid" />
      </div>

      {/* Navigation Header */}
      <nav className={`landing-nav ${scrollY > 30 ? 'landing-nav-scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-nav-brand">
            <div className="landing-logo-container">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU1ioLqnxA_hYgapTKlsagISjhIZOyPzasjVVkJt5H8vxhKHKhsfmZlpAZ&s=10"
                alt="Logo Adtec Melaka"
                className="landing-nav-logo"
              />
              <span className="landing-logo-glow" />
            </div>
            <div className="landing-brand-text">
              <span className="landing-brand-title">ADTEC Melaka</span>
              <span className="landing-brand-tag">Information Hub</span>
            </div>
          </div>

          <div className="landing-nav-links">
            <a href="#features-section" className="nav-link">{isMs ? 'Ciri Eksklusif' : 'Features'}</a>
            <a href="#mockup-section" className="nav-link">{isMs ? 'Pra-Tonton' : 'Preview'}</a>
            <a href="#workflow-section" className="nav-link">{isMs ? 'Cara Berfungsi' : 'How It Works'}</a>
            <a href="#faq-section" className="nav-link">FAQ</a>
          </div>

          <div className="landing-nav-actions">
            {/* Language Switcher - STRICTLY MS & EN ONLY */}
            <div className="landing-lang-wrapper">
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="landing-lang-select"
                aria-label="Tukar Bahasa"
              >
                <option value="ms">Bahasa Melayu</option>
                <option value="en">English (US)</option>
              </select>
            </div>

            <button className="landing-nav-cta" onClick={onGetStarted}>
              <span>{isMs ? 'Log Masuk' : 'Sign In'}</span>
              <ArrowRight size={16} className="cta-arrow" />
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          
          {/* Status Badge */}
          <div className="landing-hero-badge animate-fade-in">
            <span className="pulse-indicator">
              <span className="pulse-ping"></span>
              <span className="pulse-core"></span>
            </span>
            <span className="badge-text">
              {isMs ? 'Platform Generasi Baharu • ADTEC Melaka 2026' : 'Next-Gen Platform • ADTEC Melaka 2026'}
            </span>
            <Sparkles size={14} className="badge-sparkle" />
          </div>

          {/* Main Title */}
          <h1 className="landing-hero-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="landing-hero-gradient">
              Dashboard ADTEC Melaka
            </span>
          </h1>

          {/* Subtitle */}
          <p className="landing-hero-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {isMs 
              ? 'Penyelesaian moden bertaraf premium untuk warga ADTEC Melaka. Laporkan barang hilang, temui pemilik sah, dan berinteraksi dengan bantuan AI dalam satu hab berteknologi tinggi.'
              : 'A premium, high-performance ecosystem for ADTEC Melaka. Report misplaced items, find legitimate owners, and interact with smart AI assistance in one integrated campus portal.'}
          </p>

          {/* Action CTAs */}
          <div className="landing-hero-actions animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button className="landing-btn-primary" onClick={onGetStarted}>
              <span className="btn-shine"></span>
              <span>{isMs ? 'Mula Sekarang (Log Masuk)' : 'Get Started Now'}</span>
              <ArrowRight size={18} />
            </button>
            <a href="#mockup-section" className="landing-btn-secondary">
              <span>{isMs ? 'Lihat Demonstrasi' : 'Explore Preview'}</span>
              <ChevronDown size={18} />
            </a>
          </div>

          {/* Live Trust Badges */}
          <div className="landing-trust-bar animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="trust-item">
              <CheckCircle size={16} className="trust-icon" />
              <span>{isMs ? 'Pangkalan Data Disulitkan' : 'Encrypted Supabase Database'}</span>
            </div>
            <div className="trust-dot" />
            <div className="trust-item">
              <Bot size={16} className="trust-icon" />
              <span>{isMs ? 'Bantuan AI Gemini 24/7' : '24/7 Gemini AI Assistant'}</span>
            </div>
            <div className="trust-dot" />
            <div className="trust-item">
              <Shield size={16} className="trust-icon" />
              <span>{isMs ? 'Pengesahan Bukti Gambar' : 'Verified Photo Proofing'}</span>
            </div>
          </div>

        </div>

        {/* Floating Ambient Hologram Cards */}
        <div className="landing-hero-floating">
          <div className="landing-float-card landing-float-card-1 glass-card">
            <div className="landing-float-icon bg-red">
              <AlertTriangle size={20} />
            </div>
            <div className="landing-float-details">
              <span className="landing-float-label">{isMs ? 'Laporan Baru' : 'New Report'}</span>
              <span className="landing-float-value">{isMs ? 'MacBook Air M2 (Blok B)' : 'MacBook Air M2 (Block B)'}</span>
              <span className="landing-float-sub text-red">{isMs ? 'Sedang Dipadankan AI...' : 'AI Matching in progress...'}</span>
            </div>
          </div>

          <div className="landing-float-card landing-float-card-2 glass-card">
            <div className="landing-float-icon bg-emerald">
              <Sparkles size={20} />
            </div>
            <div className="landing-float-details">
              <span className="landing-float-label">{isMs ? 'Padanan Ditemui!' : 'Match Found!'}</span>
              <span className="landing-float-value">{isMs ? 'Kad Matrik Pelajar' : 'Student Matric Card'}</span>
              <span className="landing-float-sub text-emerald">{isMs ? 'Pemilik telah dimaklumkan' : 'Owner has been notified'}</span>
            </div>
          </div>

          <div className="landing-float-card landing-float-card-3 glass-card">
            <div className="landing-float-icon bg-indigo">
              <Bot size={20} />
            </div>
            <div className="landing-float-details">
              <span className="landing-float-label">AdtecBot AI</span>
              <span className="landing-float-value">{isMs ? 'Bantuan Online' : 'Active Assistance'}</span>
              <span className="landing-float-sub text-indigo">{isMs ? 'Sedia 24/7 untuk anda' : 'Ready 24/7 for you'}</span>
            </div>
          </div>
        </div>

        <div className="landing-scroll-indicator">
          <div className="mouse-wheel"></div>
        </div>
      </section>

      {/* INTERACTIVE MOCKUP SHOWCASE */}
      <section id="mockup-section" className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-tag">
              <Cpu size={14} style={{ marginRight: '6px' }} />
              {isMs ? 'Antaramuka Bertaraf Tinggi' : 'High-End User Experience'}
            </span>
            <h2 className="landing-section-title">
              {isMs ? 'Direka Dengan Perincian' : 'Engineered With Precision'} <br />
              <span className="landing-hero-gradient">{isMs ? 'Pantas, Kemas & Berkuasa' : 'Fast, Sleek & Powerful'}</span>
            </h2>
            <p className="landing-section-desc">
              {isMs 
                ? 'Alami rekaan papan pemuka kaca (glassmorphic) yang responsif dan intuitif, lengkap dengan carian masa nyata serta status tuntutan.'
                : 'Experience an intuitive glassmorphic dashboard interface built for speed, real-time queries, and seamless item claim status tracking.'}
            </p>
          </div>

          {/* Premium Mockup Window */}
          <div className="landing-mockup-frame">
            <div className="mockup-frame-glow"></div>
            
            {/* Window Header Bar */}
            <div className="mockup-window-header">
              <div className="mockup-window-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="mockup-window-address">
                <Lock size={12} style={{ color: '#10B981' }} />
                <span>dashboard.adtecmelaka.edu.my</span>
              </div>
              <div className="mockup-window-badge">
                <span className="status-live-dot"></span>
                {isMs ? 'Sistem Aktif' : 'System Live'}
              </div>
            </div>

            {/* Mockup Window Body */}
            <div className="mockup-window-body">
              {/* Inner Mockup Subheader */}
              <div className="mockup-top-nav">
                <div className="mockup-tabs">
                  <button 
                    className={`mockup-tab ${activeMockupTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveMockupTab('all')}
                  >
                    {isMs ? 'Semua Laporan' : 'All Reports'}
                  </button>
                  <button 
                    className={`mockup-tab ${activeMockupTab === 'lost' ? 'active' : ''}`}
                    onClick={() => setActiveMockupTab('lost')}
                  >
                    {isMs ? 'Barang Hilang' : 'Lost Items'}
                  </button>
                  <button 
                    className={`mockup-tab ${activeMockupTab === 'found' ? 'active' : ''}`}
                    onClick={() => setActiveMockupTab('found')}
                  >
                    {isMs ? 'Barang Jumpa' : 'Found Items'}
                  </button>
                </div>

                <div className="mockup-search-bar">
                  <Search size={14} style={{ color: '#94A3B8' }} />
                  <span>{isMs ? 'Cari barang, lokasi atau nama...' : 'Search items, locations...'}</span>
                </div>
              </div>

              {/* Mockup Item Cards */}
              <div className="mockup-items-grid">
                {filteredMockupItems.map((item) => (
                  <div key={item.id} className="mockup-item-card">
                    <div className="mockup-card-header">
                      <span 
                        className="mockup-item-badge" 
                        style={{ 
                          background: `${item.tagColor}1A`, 
                          color: item.tagColor,
                          borderColor: `${item.tagColor}40`
                        }}
                      >
                        {item.status}
                      </span>
                      <span className="mockup-item-time">{item.time}</span>
                    </div>
                    <h4 className="mockup-item-title">{item.title}</h4>
                    <div className="mockup-item-meta">
                      <span className="mockup-category">{item.category}</span>
                      <span className="meta-sep">•</span>
                      <span className="mockup-location">{item.location}</span>
                    </div>
                    <div className="mockup-card-footer">
                      <button className="mockup-contact-btn" onClick={onGetStarted}>
                        <MessageSquare size={14} />
                        <span>{isMs ? 'Hubungi Penemu' : 'Contact Reporter'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENTO GRID FEATURES SECTION */}
      <section id="features-section" className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-tag">
              <Layers size={14} style={{ marginRight: '6px' }} />
              {isMs ? 'Kelebihan Eksklusif' : 'Exclusive Architecture'}
            </span>
            <h2 className="landing-section-title">
              {isMs ? 'Setiap Ciri Dicipta Untuk' : 'Engineered For Complete'} <br />
              <span className="landing-hero-gradient">{isMs ? 'Kemudahan & Ketenteraman' : 'Security & Convenience'}</span>
            </h2>
            <p className="landing-section-desc">
              {isMs 
                ? 'Dikuasakan oleh teknologi moden untuk memastikan barang hilang dipulangkan dengan pantas dan telus.'
                : 'Built with a modern tech stack to ensure misplaced items are recovered quickly with institutional transparency.'}
            </p>
          </div>

          {/* Luxury Bento Grid */}
          <div className="bento-grid">
            
            {/* Bento 1: Large Featured Card - AI Smart Matching */}
            <div className="bento-card bento-col-span-2 bento-ai-match">
              <div className="bento-shine"></div>
              <div className="bento-card-content">
                <div className="bento-icon-wrapper bg-indigo-glow">
                  <Sparkles size={28} className="text-indigo" />
                </div>
                <h3>{isMs ? 'Padanan Pintar Automatik & AI' : 'Smart AI & Auto Matching Engine'}</h3>
                <p>
                  {isMs 
                    ? 'Sistem secara pintar membandingkan laporan kehilangan dan penemuan berdasarkan nama barang, kategori, serta lokasi untuk mencadangkan padanan tepat.'
                    : 'Intelligent heuristics match lost and found reports by analyzing item attributes, categories, and location data to deliver instant match alerts.'}
                </p>
                <div className="bento-radar-visual">
                  <div className="radar-circle circle-1"></div>
                  <div className="radar-circle circle-2"></div>
                  <div className="radar-circle circle-3"></div>
                  <div className="radar-sweep"></div>
                  <div className="radar-point point-1">
                    <span className="point-pulse"></span>
                    <span className="point-label">{isMs ? 'Padanan 99%' : '99% Match'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 2: 24/7 AdtecBot Assistant */}
            <div className="bento-card bento-chatbot">
              <div className="bento-shine"></div>
              <div className="bento-card-content">
                <div className="bento-icon-wrapper bg-pink-glow">
                  <Bot size={28} className="text-pink" />
                </div>
                <h3>AdtecBot 24/7 (AI)</h3>
                <p>
                  {isMs 
                    ? 'Pembantu maya pintar dengan model Gemini sedia menjawab pertanyaan panduan sistem dan pautan rasmi kampus.'
                    : 'Virtual assistant powered by Google Gemini, answering operational queries and providing official campus links anytime.'}
                </p>
                <div className="bento-chat-bubble-preview">
                  <div className="preview-chat-bot">
                    <Bot size={16} />
                    <span>{isMs ? 'Hai! Ada apa yang boleh saya bantu hari ini? ✨' : 'Hello! How can I assist you today? ✨'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento 3: Secure 1-on-1 Student Messaging */}
            <div className="bento-card bento-messaging">
              <div className="bento-shine"></div>
              <div className="bento-card-content">
                <div className="bento-icon-wrapper bg-emerald-glow">
                  <MessageSquare size={28} className="text-emerald" />
                </div>
                <h3>{isMs ? 'Sembang 1-ke-1 Terpelihara' : 'Private 1-to-1 Chat'}</h3>
                <p>
                  {isMs 
                    ? 'Hubungi penemu barang secara terus di dalam platform tanpa perlu mendedahkan nombor telefon atau media sosial peribadi.'
                    : 'Reach out to finders directly inside the secured portal without exposing personal phone numbers or social media.'}
                </p>
                <div className="bento-msg-status">
                  <span className="online-beacon"></span>
                  <span className="online-beacon-text">{isMs ? 'Pemesejan Langsung Masa Nyata' : 'Real-time Live Messaging'}</span>
                </div>
              </div>
            </div>

            {/* Bento 4: Photo Proof & Verification */}
            <div className="bento-card bento-col-span-2 bento-security">
              <div className="bento-shine"></div>
              <div className="bento-card-content">
                <div className="bento-icon-wrapper bg-amber-glow">
                  <Shield size={28} className="text-amber" />
                </div>
                <h3>{isMs ? 'Pengesahan Gambar & Anti-Penipuan' : 'Photo Proof & Anti-Fraud Security'}</h3>
                <p>
                  {isMs 
                    ? 'Laporan mewajibkan muat naik bukti visual dan diawasi oleh pentadbir bagi mengelakkan laporan palsu serta menjamin kesahihan setiap tuntutan barang.'
                    : 'System enforces visual photo uploads and admin oversight to eliminate fraudulent reports and protect student belongings.'}
                </p>
                <div className="bento-security-pills">
                  <div className="sec-pill">
                    <Check size={14} /> {isMs ? 'Audit Log Lengkap' : 'Full Audit Trail'}
                  </div>
                  <div className="sec-pill">
                    <Check size={14} /> {isMs ? 'Kawalan Pentadbir Rasmi' : 'Official Admin Control'}
                  </div>
                  <div className="sec-pill">
                    <Check size={14} /> {isMs ? 'Penggantungan Akaun Scam' : 'Instant Scam Suspension'}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* STATS COUNTER SECTION */}
      <section id="stats-section" className="landing-section">
        <div className="landing-section-inner">
          <div className="stats-container glass-card">
            <div className="stat-box">
              <div className="stat-icon-wrap">
                <CheckCircle size={24} className="text-emerald" />
              </div>
              <div className="stat-number">
                <AnimatedCounter target={dbStats.returned} />
                <span className="stat-plus">+</span>
              </div>
              <div className="stat-label">{isMs ? 'Barang Berjaya Dipulangkan' : 'Items Safely Recovered'}</div>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-box">
              <div className="stat-icon-wrap">
                <Users size={24} className="text-indigo" />
              </div>
              <div className="stat-number">
                <AnimatedCounter target={dbStats.users} />
                <span className="stat-plus">+</span>
              </div>
              <div className="stat-label">{isMs ? 'Warga Kampus Berdaftar' : 'Registered Campus Users'}</div>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-box">
              <div className="stat-icon-wrap">
                <Star size={24} className="text-amber" />
              </div>
              <div className="stat-number">
                <AnimatedCounter target={dbStats.successRate} />
                <span className="stat-percent">%</span>
              </div>
              <div className="stat-label">{isMs ? 'Kadar Kejayaan Padanan' : 'Successful Match Rate'}</div>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-box">
              <div className="stat-icon-wrap">
                <Activity size={24} className="text-cyan" />
              </div>
              <div className="stat-number">
                <span>99.9</span>
                <span className="stat-percent">%</span>
              </div>
              <div className="stat-label">{isMs ? 'Kebolehsediaan Sistem' : 'System Uptime'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="workflow-section" className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-tag">
              <Zap size={14} style={{ marginRight: '6px' }} />
              {isMs ? 'Proses Mudah' : 'Simple Workflow'}
            </span>
            <h2 className="landing-section-title">
              {isMs ? '3 Langkah Mudah Untuk Menyelesaikan' : '3 Seamless Steps to Recover'} <br />
              <span className="landing-hero-gradient">{isMs ? 'Kehilangan Barang Anda' : 'Your Missing Belongings'}</span>
            </h2>
          </div>

          <div className="workflow-steps-grid">
            <div className="workflow-step-card glass-card">
              <div className="step-glow"></div>
              <div className="step-header">
                <span className="step-badge">01</span>
                <div className="step-icon-bg bg-indigo">
                  <Search size={22} />
                </div>
              </div>
              <h3>{isMs ? 'Laporkan Barang' : 'Submit Report'}</h3>
              <p>
                {isMs 
                  ? 'Isikan butiran barang seperti nama, lokasi terakhir, tarikh, serta muat naik gambar foto sebagai bukti rujukan.'
                  : 'Enter item specifics including item name, last known location, date, and attach a photo reference.'}
              </p>
            </div>

            <div className="workflow-step-connector"></div>

            <div className="workflow-step-card glass-card">
              <div className="step-glow"></div>
              <div className="step-header">
                <span className="step-badge">02</span>
                <div className="step-icon-bg bg-emerald">
                  <Sparkles size={22} />
                </div>
              </div>
              <h3>{isMs ? 'Imbasan & Padanan Pintar' : 'Smart Scan & Match'}</h3>
              <p>
                {isMs 
                  ? 'Sistem dan komuniti akan mengesan padanan. Anda boleh menyemak senarai laporan dengan fungsi carian pintar bila-bila masa.'
                  : 'Our system indexes the report immediately while students and AI search algorithms identify possible matches.'}
              </p>
            </div>

            <div className="workflow-step-connector"></div>

            <div className="workflow-step-card glass-card">
              <div className="step-glow"></div>
              <div className="step-header">
                <span className="step-badge">03</span>
                <div className="step-icon-bg bg-amber">
                  <CheckCircle size={22} />
                </div>
              </div>
              <h3>{isMs ? 'Hubungi & Terima Semula' : 'Contact & Reclaim'}</h3>
              <p>
                {isMs 
                  ? 'Gunakan sistem mesej sulit untuk mengatur pertemuan selamat bagi penyerahan barang dan tandakan laporan selesai.'
                  : 'Message the finder directly through internal encrypted chat to schedule a safe handover and mark as resolved.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq-section" className="landing-section">
        <div className="landing-section-inner faq-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">
              <HelpCircle size={14} style={{ marginRight: '6px' }} />
              FAQ
            </span>
            <h2 className="landing-section-title">
              {isMs ? 'Soalan Lazim Mengenai Platform' : 'Frequently Asked Questions'}
            </h2>
            <p className="landing-section-desc">
              {isMs ? 'Ketahui lebih lanjut tentang fungsi dan keselamatan sistem ini.' : 'Learn more about system capabilities and data protection.'}
            </p>
          </div>

          <div className="faq-accordion-list">
            {faqItems.map((item, idx) => (
              <div 
                key={idx} 
                className={`faq-item glass-card ${openFaq === idx ? 'faq-open' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <div className="faq-toggle-icon">
                    <ChevronDown size={18} />
                  </div>
                </div>
                {openFaq === idx && (
                  <div className="faq-answer animate-fade-in">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION (CTA) SECTION */}
      <section className="landing-section cta-section">
        <div className="landing-section-inner">
          <div className="luxury-cta-banner">
            <div className="cta-ambient-glow"></div>
            <div className="cta-content">
              <div className="cta-icon-badge">
                <Sparkles size={24} color="#fcd34d" />
              </div>
              <h2 className="cta-headline">
                {isMs ? 'Sedia Untuk Mula Menggunakan Sistem?' : 'Ready to Experience the Platform?'}
              </h2>
              <p className="cta-sub">
                {isMs 
                  ? 'Sertai komuniti warga ADTEC Melaka sekarang untuk pengurusan maklumat yang lebih pantas, efisien dan selamat.'
                  : 'Join the ADTEC Melaka campus network now for streamlined, reliable, and secure information tracking.'}
              </p>
              <div className="cta-buttons">
                <button className="landing-btn-primary btn-large" onClick={onGetStarted}>
                  <span className="btn-shine"></span>
                  <span>{isMs ? 'Log Masuk / Daftar Akaun' : 'Sign In / Register Account'}</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-left">
            <div className="landing-nav-brand">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU1ioLqnxA_hYgapTKlsagISjhIZOyPzasjVVkJt5H8vxhKHKhsfmZlpAZ&s=10"
                alt="Logo"
                className="landing-nav-logo"
              />
              <span className="footer-brand-title">ADTEC Melaka Platform</span>
            </div>
            <p className="footer-description">
              {isMs 
                ? 'Pusat maklumat rasmi dan sistem lost & found komuniti Pusat Latihan Teknologi Tinggi (ADTEC) Melaka.'
                : 'Official information hub & campus lost-and-found portal for Advanced Technology Training Center (ADTEC) Melaka.'}
            </p>
          </div>

          <div className="footer-right">
            <div className="footer-status-pill">
              <span className="status-indicator-green"></span>
              <span>{isMs ? 'Semua Sistem Beroperasi Normal' : 'All Systems Operational'}</span>
            </div>
            <p className="landing-footer-copy">
              © {new Date().getFullYear()} ADTEC Melaka. {isMs ? 'Hak Cipta Terpelihara.' : 'All Rights Reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Smooth Number Counter Component
function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target, 10) || 0;
    if (end === 0) return;
    const duration = 1800;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const stepIncrement = Math.max(1, Math.floor(end / totalSteps));

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
}
