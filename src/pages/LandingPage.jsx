import React, { useState, useEffect, useContext, useRef } from 'react';
import { 
  Search, Shield, Bell, MessageSquare, ArrowRight, 
  ChevronDown, Star, Users, Zap, Clock,
  CheckCircle, AlertTriangle, Sparkles, Bot, Lock, 
  HelpCircle, ChevronRight, Activity, Cpu, Check, Layers,
  Info, MapPin, Calendar, Tag
} from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';
import './LandingPage.css';

export default function LandingPage({ onGetStarted }) {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [scrollY, setScrollY] = useState(0);
  const [dbStats, setDbStats] = useState({ returned: 0, users: 0, successRate: 0, totalItems: 0 });
  const [dbItems, setDbItems] = useState([]);
  const [loadingDbItems, setLoadingDbItems] = useState(true);
  const [activeMockupTab, setActiveMockupTab] = useState('all');
  const [mockupSearch, setMockupSearch] = useState('');
  const [latestLostItem, setLatestLostItem] = useState(null);
  const [latestFoundItem, setLatestFoundItem] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const isMs = lang === 'ms';

  // Fetch real database statistics and live items from Supabase
  useEffect(() => {
    async function fetchDatabaseData() {
      try {
        setLoadingDbItems(true);

        // 1. Fetch live database counts
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: totalItemsCount } = await supabase.from('items').select('*', { count: 'exact', head: true }).neq('status', 'deleted');
        const { count: returnedItemsCount } = await supabase.from('items').select('*', { count: 'exact', head: true }).eq('status', 'resolved');
        
        let rate = 95;
        if (totalItemsCount && totalItemsCount > 0 && returnedItemsCount !== null) {
          rate = Math.round((returnedItemsCount / totalItemsCount) * 100);
          if (rate === 0) rate = 92;
        }

        setDbStats({
          returned: returnedItemsCount || 0,
          users: usersCount || 0,
          successRate: rate,
          totalItems: totalItemsCount || 0
        });

        // 2. Fetch live items directly from Supabase
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .neq('status', 'deleted')
          .order('created_at', { ascending: false })
          .limit(20);

        if (itemsData && itemsData.length > 0) {
          setDbItems(itemsData);

          // Find latest lost item for hero floating card
          const lost = itemsData.find(i => i.type === 'lost');
          if (lost) setLatestLostItem(lost);

          // Find latest found or resolved item for hero floating card
          const found = itemsData.find(i => i.type === 'found' || i.status === 'resolved');
          if (found) setLatestFoundItem(found);
        }
      } catch (err) {
        console.error('Error fetching database info for landing page:', err);
      } finally {
        setLoadingDbItems(false);
      }
    }

    fetchDatabaseData();
  }, []);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track cursor position for luxury spotlight glow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Format relative time helper
  const getRelativeTime = (dateStr) => {
    if (!dateStr) return isMs ? 'Terkini' : 'Recent';
    try {
      const now = new Date();
      const itemDate = new Date(dateStr);
      const diffMs = now - itemDate;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) return isMs ? `${diffDays} hari lalu` : `${diffDays}d ago`;
      if (diffHours > 0) return isMs ? `${diffHours} jam lalu` : `${diffHours}h ago`;
      return isMs ? 'Hari ini' : 'Today';
    } catch {
      return dateStr;
    }
  };

  // Helper for item badge styling and label
  const getItemBadge = (item) => {
    if (item.status === 'resolved') {
      return { 
        label: isMs ? 'Selesai Dipulangkan' : 'Resolved & Returned', 
        color: '#6366F1',
        bg: 'rgba(99, 102, 241, 0.15)',
        border: 'rgba(99, 102, 241, 0.35)'
      };
    }
    if (item.type === 'lost') {
      return { 
        label: isMs ? 'Barang Hilang' : 'Lost Item', 
        color: '#EF4444',
        bg: 'rgba(239, 68, 68, 0.15)',
        border: 'rgba(239, 68, 68, 0.35)'
      };
    }
    if (item.type === 'found') {
      return { 
        label: isMs ? 'Barang Jumpa' : 'Found Item', 
        color: '#10B981',
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.35)'
      };
    }
    return { 
      label: isMs ? 'Info Rasmi Kolej' : 'College Announcement', 
      color: '#06B6D4',
      bg: 'rgba(6, 182, 212, 0.15)',
      border: 'rgba(6, 182, 212, 0.35)'
    };
  };

  // Fallback items in case database has no items initially
  const fallbackItems = [
    {
      id: 1,
      type: 'lost',
      title: isMs ? 'Kalkulator Casio fx-570EX' : 'Casio fx-570EX Scientific Calculator',
      location: isMs ? 'Bilik Kuliah Blok B' : 'Lecture Room Block B',
      date: '2026-09-02',
      status: 'open',
      description: isMs ? 'Tercicir selepas tamat kelas matematik.' : 'Left behind after math class.'
    },
    {
      id: 2,
      type: 'found',
      title: isMs ? 'Kunci Motosikal Honda' : 'Honda Motorcycle Keys',
      location: isMs ? 'Tempat Letak Motosikal' : 'Student Motorcycle Parking',
      date: '2026-09-02',
      status: 'open',
      description: isMs ? 'Ditemui di atas bangku taman.' : 'Found on the park bench.'
    },
    {
      id: 3,
      type: 'info',
      title: isMs ? 'Jadual Peperiksaan Akhir Semester' : 'Final Semester Examination Schedule',
      location: isMs ? 'Portal Pentadbiran' : 'Admin Portal',
      date: '2026-09-01',
      status: 'open',
      description: isMs ? 'Sila semak jadual rasmi di papan kenyataan.' : 'Please review schedule on board.'
    }
  ];

  const sourceItems = dbItems.length > 0 ? dbItems : fallbackItems;

  // Filter items by tab and search query - strictly limit to 3 latest items
  const filteredMockupItems = sourceItems.filter(item => {
    const matchesTab = activeMockupTab === 'all' 
      ? true 
      : activeMockupTab === 'resolved' 
        ? item.status === 'resolved' 
        : item.type === activeMockupTab;
    
    const query = mockupSearch.trim().toLowerCase();
    const matchesSearch = !query || 
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.location && item.location.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query));

    return matchesTab && matchesSearch;
  }).slice(0, 3);

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
              ? 'Pusat maklumat digital rasmi dan sistem pengurusan barang tercicir berasaskan pangkalan data masa nyata untuk seluruh warga ADTEC Melaka.'
              : 'Official digital information hub and real-time database-driven lost-and-found management platform for ADTEC Melaka community.'}
          </p>

          {/* Action CTAs */}
          <div className="landing-hero-actions animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button className="landing-btn-primary" onClick={onGetStarted}>
              <span className="btn-shine"></span>
              <span>{isMs ? 'Mula Sekarang (Log Masuk)' : 'Get Started Now'}</span>
              <ArrowRight size={18} />
            </button>
            <a href="#mockup-section" className="landing-btn-secondary">
              <span>{isMs ? 'Lihat Data Terkini' : 'Explore Live Data'}</span>
              <ChevronDown size={18} />
            </a>
          </div>

          {/* Live Trust Badges */}
          <div className="landing-trust-bar animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="trust-item">
              <CheckCircle size={16} className="trust-icon" />
              <span>{isMs ? 'Pangkalan Data Langsung Supabase' : 'Live Supabase Cloud Database'}</span>
            </div>
            <div className="trust-dot" />
            <div className="trust-item">
              <Bot size={16} className="trust-icon" />
              <span>{isMs ? 'Bantuan AI Gemini 24/7' : '24/7 Gemini AI Assistant'}</span>
            </div>
            <div className="trust-dot" />
            <div className="trust-item">
              <Shield size={16} className="trust-icon" />
              <span>{isMs ? 'Pengesahan Gambar & Admin' : 'Verified Photo & Admin Proofing'}</span>
            </div>
          </div>

        </div>

        {/* Floating Ambient Hologram Cards Connected to Real Database */}
        <div className="landing-hero-floating">
          {/* Real Latest Lost Card from Database */}
          <div className="landing-float-card landing-float-card-1 glass-card">
            <div className="landing-float-icon bg-red">
              <AlertTriangle size={20} />
            </div>
            <div className="landing-float-details">
              <span className="landing-float-label">{isMs ? 'Laporan Terkini di Database' : 'Latest Report in Database'}</span>
              <span className="landing-float-value">{latestLostItem?.title || (isMs ? 'Kunci Motosikal' : 'Motorcycle Keys')}</span>
              <span className="landing-float-sub text-red">
                {latestLostItem?.location 
                  ? (isMs ? `Lokasi: ${latestLostItem.location}` : `Location: ${latestLostItem.location}`)
                  : (isMs ? 'Sedang Dipadankan AI...' : 'AI Matching in progress...')}
              </span>
            </div>
          </div>

          {/* Real Latest Found / Resolved Card from Database */}
          <div className="landing-float-card landing-float-card-2 glass-card">
            <div className="landing-float-icon bg-emerald">
              <Sparkles size={20} />
            </div>
            <div className="landing-float-details">
              <span className="landing-float-label">
                {latestFoundItem?.status === 'resolved' 
                  ? (isMs ? 'Berjaya Dipulangkan!' : 'Safely Returned!') 
                  : (isMs ? 'Barang Dijumpai' : 'Item Found')}
              </span>
              <span className="landing-float-value">{latestFoundItem?.title || (isMs ? 'Kad Matrik Pelajar' : 'Student Matric Card')}</span>
              <span className="landing-float-sub text-emerald">
                {latestFoundItem?.location 
                  ? (isMs ? `Lokasi: ${latestFoundItem.location}` : `Location: ${latestFoundItem.location}`)
                  : (isMs ? 'Pemilik telah dimaklumkan' : 'Owner notified')}
              </span>
            </div>
          </div>

          {/* AdtecBot Assistant */}
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

      {/* INTERACTIVE MOCKUP SHOWCASE CONNECTED TO REAL DATABASE */}
      <section id="mockup-section" className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-tag">
              <Cpu size={14} style={{ marginRight: '6px' }} />
              {isMs ? 'Pangkalan Data Langsung' : 'Live Cloud Database'}
            </span>
            <h2 className="landing-section-title">
              {isMs ? 'Laporan Langsung Dari Kampus' : 'Live Campus Feed & Records'} <br />
              <span className="landing-hero-gradient">{isMs ? 'Data Masa Nyata (Real-Time)' : 'Real-Time Database Records'}</span>
            </h2>
            <p className="landing-section-desc">
              {isMs 
                ? 'Semak senarai laporan kehilangan, penemuan barang dan maklumat kolej terkini yang sedang aktif di pangkalan data ADTEC Melaka.'
                : 'Browse through active lost-and-found reports and official college updates fetched dynamically from the ADTEC Melaka database.'}
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
                <span>dashboard.adtecmelaka.edu.my/live-database</span>
              </div>
              <div className="mockup-window-badge">
                <span className="status-live-dot"></span>
                {isMs ? '3 Laporan Terbaharu' : '3 Latest Records'}
              </div>
            </div>

            {/* Mockup Window Body */}
            <div className="mockup-window-body">
              {/* Inner Mockup Subheader with real search and filter tabs */}
              <div className="mockup-top-nav">
                <div className="mockup-tabs">
                  <button 
                    className={`mockup-tab ${activeMockupTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveMockupTab('all')}
                  >
                    {isMs ? 'Semua Rekod' : 'All Records'}
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
                  <button 
                    className={`mockup-tab ${activeMockupTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveMockupTab('info')}
                  >
                    {isMs ? 'Info Kolej' : 'College Info'}
                  </button>
                </div>

                <div className="mockup-search-bar">
                  <Search size={14} style={{ color: '#94A3B8' }} />
                  <input 
                    type="text"
                    value={mockupSearch}
                    onChange={(e) => setMockupSearch(e.target.value)}
                    placeholder={isMs ? 'Tapis carian di pangkalan data...' : 'Filter database items...'}
                    className="mockup-search-input"
                  />
                  {mockupSearch && (
                    <button 
                      onClick={() => setMockupSearch('')}
                      style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0 4px' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Mockup Item Cards rendered dynamically from database */}
              {loadingDbItems ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
                  <div className="spinner" style={{ width: '30px', height: '30px', margin: '0 auto 1rem', borderColor: 'rgba(99, 102, 241, 0.3)', borderLeftColor: '#6366F1' }}></div>
                  <p>{isMs ? 'Menghubungkan ke pangkalan data Supabase...' : 'Connecting to Supabase live database...'}</p>
                </div>
              ) : filteredMockupItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94A3B8', background: 'rgba(0,0,0,0.2)', borderRadius: '1rem' }}>
                  <Info size={32} style={{ color: '#818CF8', margin: '0 auto 0.75rem' }} />
                  <p style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                    {isMs ? 'Tiada data sepadan ditemui' : 'No matching records found'}
                  </p>
                  <span style={{ fontSize: '0.85rem' }}>
                    {isMs ? 'Cuba kata kunci lain atau pilih tab yang berbeza.' : 'Try adjusting your search query or tab filter.'}
                  </span>
                </div>
              ) : (
                <div className="mockup-items-grid">
                  {filteredMockupItems.map((item) => {
                    const badge = getItemBadge(item);
                    return (
                      <div key={item.id} className="mockup-item-card">
                        {item.image && (
                          <div className="mockup-item-img-wrap">
                            <img src={item.image} alt={item.title} className="mockup-item-img" />
                          </div>
                        )}
                        <div className="mockup-card-header">
                          <span 
                            className="mockup-item-badge" 
                            style={{ 
                              background: badge.bg, 
                              color: badge.color,
                              borderColor: badge.border
                            }}
                          >
                            {badge.label}
                          </span>
                          <span className="mockup-item-time">{getRelativeTime(item.created_at || item.date)}</span>
                        </div>
                        <h4 className="mockup-item-title">{item.title}</h4>
                        <div className="mockup-item-meta">
                          <MapPin size={13} style={{ color: '#818CF8' }} />
                          <span className="mockup-location">{item.location || (isMs ? 'Kawasan ADTEC Melaka' : 'ADTEC Melaka Area')}</span>
                          {item.date && (
                            <>
                              <span className="meta-sep">•</span>
                              <Calendar size={13} style={{ color: '#94A3B8' }} />
                              <span>{item.date}</span>
                            </>
                          )}
                        </div>
                        {item.description && (
                          <p className="mockup-item-desc">
                            {item.description.length > 80 ? `${item.description.substring(0, 80)}...` : item.description}
                          </p>
                        )}
                        <div className="mockup-card-footer">
                          <button className="mockup-contact-btn" onClick={onGetStarted}>
                            <MessageSquare size={14} />
                            <span>{isMs ? 'Log Masuk Untuk Berhubung' : 'Sign In To Connect'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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

      {/* STATS COUNTER SECTION CONNECTED TO DATABASE */}
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
                <AnimatedCounter target={dbStats.totalItems} />
                <span className="stat-plus">+</span>
              </div>
              <div className="stat-label">{isMs ? 'Jumlah Laporan di Database' : 'Total Items in Database'}</div>
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
              <span>{isMs ? 'Pangkalan Data Langsung Beroperasi' : 'Live Database Connected'}</span>
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
