import React, { useState, useEffect, useContext } from 'react';
import { 
  Search, Shield, Bell, MessageSquare, MapPin, ArrowRight, 
  ChevronDown, Star, Users, FileText, Zap, Eye, Clock,
  CheckCircle, Info, AlertTriangle
} from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';
import './LandingPage.css';

export default function LandingPage({ onGetStarted }) {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [activeFeature, setActiveFeature] = useState(0);
  const [statAnimated, setStatAnimated] = useState(false);
  const [dbStats, setDbStats] = useState({ returned: 0, users: 0, successRate: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: usersCount } = await supabase.from('profiles').select('*', {count: 'exact', head: true});
        const { count: totalItems } = await supabase.from('items').select('*', {count: 'exact', head: true});
        const { count: returnedItems } = await supabase.from('items').select('*', {count: 'exact', head: true}).eq('status', 'deleted');
        
        let rate = 0;
        if (totalItems && totalItems > 0) {
          rate = Math.round(((returnedItems || 0) / totalItems) * 100);
        }

        setDbStats({
          returned: returnedItems || 0,
          users: usersCount || 0,
          successRate: rate
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
            if (entry.target.id === 'stats-section') {
              setStatAnimated(true);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.landing-section').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Search size={28} />,
      title: 'Cari & Lapor Barang',
      desc: 'Laporkan barang hilang atau jumpa dengan mudah. Sistem carian pintar membantu memadankan item secara automatik.',
      color: '#6366F1',
    },
    {
      icon: <Bell size={28} />,
      title: 'Notifikasi Segera',
      desc: 'Terima pemberitahuan real-time apabila barang anda ditemui atau ada maklumat penting berkaitan kolej.',
      color: '#F59E0B',
    },
    {
      icon: <MessageSquare size={28} />,
      title: 'Mesej Selamat',
      desc: 'Berkomunikasi secara selamat dengan pelapor melalui sistem mesej terbina dalam. Privasi terjamin.',
      color: '#10B981',
    },
    {
      icon: <Shield size={28} />,
      title: 'Panel Admin',
      desc: 'Admin boleh mengurus pengguna, laporan, analitik, dan log audit dengan kawalan penuh.',
      color: '#EF4444',
    },
  ];

  const stats = [
    { value: dbStats.returned, suffix: '', label: 'Barang Dipulangkan', icon: <CheckCircle size={20} /> },
    { value: dbStats.users, suffix: '', label: 'Pengguna Aktif', icon: <Users size={20} /> },
    { value: dbStats.successRate, suffix: '%', label: 'Kadar Kejayaan', icon: <Star size={20} /> },
    { value: 24, suffix: '/7', label: 'Sokongan Aktif', icon: <Clock size={20} /> },
  ];

  return (
    <div className="landing-root">
      {/* Animated background */}
      <div className="landing-bg">
        <div className="landing-bg-orb landing-bg-orb-1" />
        <div className="landing-bg-orb landing-bg-orb-2" />
        <div className="landing-bg-orb landing-bg-orb-3" />
        <div className="landing-bg-grid" />
      </div>

      {/* Navbar */}
      <nav className={`landing-nav ${scrollY > 50 ? 'landing-nav-scrolled' : ''}`}>
        <div className="landing-nav-inner">
          <div className="landing-nav-brand">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU1ioLqnxA_hYgapTKlsagISjhIZOyPzasjVVkJt5H8vxhKHKhsfmZlpAZ&s=10"
              alt="Logo Adtec Melaka"
              className="landing-nav-logo"
            />
            <span>Adtec Melaka</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features-section">{t('featuresTab')}</a>
            <a href="#stats-section">{t('statsTab')}</a>
            <a href="#how-section">{t('howToTab')}</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.1)', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.2)', outline: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              <option value="ms" style={{ color: 'black' }}>Melayu</option>
              <option value="en" style={{ color: 'black' }}>English</option>
              <option value="zh" style={{ color: 'black' }}>中文</option>
              <option value="ta" style={{ color: 'black' }}>தமிழ்</option>
            </select>
            <button className="landing-nav-cta" onClick={onGetStarted}>
              {t('loginBtn')} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-hero-badge animate-fade-in">
            <Zap size={14} />
            <span>{t('heroBadge')}</span>
          </div>
          <h1 className="landing-hero-title animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t('heroTitle')}
            <br />
            <span className="landing-hero-gradient">Adtec Melaka</span>
          </h1>
          <p className="landing-hero-subtitle animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {t('heroSubtitle')}
          </p>
          <div className="landing-hero-actions animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <button className="landing-btn-primary" onClick={onGetStarted}>
              {t('startNow')} <ArrowRight size={18} />
            </button>
            <a href="#features-section" className="landing-btn-secondary">
              {t('learnMore')} <ChevronDown size={18} />
            </a>
          </div>

          {/* Floating cards */}
          <div className="landing-hero-floating animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="landing-float-card landing-float-card-1">
              <div className="landing-float-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <span className="landing-float-label">Barang Hilang</span>
                <span className="landing-float-value">MacBook Pro 14"</span>
              </div>
            </div>
            <div className="landing-float-card landing-float-card-2">
              <div className="landing-float-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
                <CheckCircle size={18} />
              </div>
              <div>
                <span className="landing-float-label">Barang Dijumpai</span>
                <span className="landing-float-value">Kunci dengan Honda Fob</span>
              </div>
            </div>
            <div className="landing-float-card landing-float-card-3">
              <div className="landing-float-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
                <Info size={18} />
              </div>
              <div>
                <span className="landing-float-label">Maklumat</span>
                <span className="landing-float-value">Notis Penyelenggaraan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="landing-scroll-indicator">
          <ChevronDown size={20} />
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features-section"
        className={`landing-section landing-features ${visibleSections.has('features-section') ? 'visible' : ''}`}
      >
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-tag">Ciri-ciri Utama</span>
            <h2 className="landing-section-title">
              Segala yang anda perlukan, <br />
              <span className="landing-hero-gradient">dalam satu platform</span>
            </h2>
            <p className="landing-section-desc">
              Direka khas untuk memudahkan pengurusan maklumat dan komunikasi di Adtec Melaka.
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`landing-feature-card ${activeFeature === i ? 'landing-feature-active' : ''}`}
                onMouseEnter={() => setActiveFeature(i)}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="landing-feature-icon" style={{ background: `${feature.color}15`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <div className="landing-feature-glow" style={{ background: feature.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        id="stats-section"
        className={`landing-section landing-stats ${visibleSections.has('stats-section') ? 'visible' : ''}`}
      >
        <div className="landing-section-inner">
          <div className="landing-stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="landing-stat-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="landing-stat-icon">{stat.icon}</div>
                <div className="landing-stat-value">
                  <AnimatedCounter target={stat.value} animate={statAnimated} />
                  {stat.suffix}
                </div>
                <div className="landing-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section
        id="how-section"
        className={`landing-section landing-how ${visibleSections.has('how-section') ? 'visible' : ''}`}
      >
        <div className="landing-section-inner">
          <div className="landing-section-header">
            <span className="landing-section-tag">Cara Penggunaan</span>
            <h2 className="landing-section-title">
              Mudah. Pantas. <span className="landing-hero-gradient">Berkesan.</span>
            </h2>
          </div>

          <div className="landing-steps">
            <div className="landing-step">
              <div className="landing-step-number">1</div>
              <div className="landing-step-content">
                <h3>Daftar Akaun</h3>
                <p>Cipta akaun menggunakan email Adtec Melaka anda dalam beberapa saat.</p>
              </div>
            </div>
            <div className="landing-step-connector" />
            <div className="landing-step">
              <div className="landing-step-number">2</div>
              <div className="landing-step-content">
                <h3>Lapor atau Cari</h3>
                <p>Laporkan barang hilang/jumpa atau cari maklumat kolej terkini.</p>
              </div>
            </div>
            <div className="landing-step-connector" />
            <div className="landing-step">
              <div className="landing-step-number">3</div>
              <div className="landing-step-content">
                <h3>Hubungi & Selesai</h3>
                <p>Mesej pelapor secara terus dan uruskan tuntutan barang dengan mudah.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta-section"
        className={`landing-section landing-cta ${visibleSections.has('cta-section') ? 'visible' : ''}`}
      >
        <div className="landing-section-inner">
          <div className="landing-cta-box">
            <div className="landing-cta-orb" />
            <h2>Sedia untuk bermula?</h2>
            <p>Sertai ratusan pelajar dan staf Adtec Melaka yang sudah menggunakan platform ini.</p>
            <button className="landing-btn-primary landing-btn-lg" onClick={onGetStarted}>
              Log Masuk Sekarang <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU1ioLqnxA_hYgapTKlsagISjhIZOyPzasjVVkJt5H8vxhKHKhsfmZlpAZ&s=10"
              alt="Logo"
              className="landing-nav-logo"
            />
            <span>Adtec Melaka</span>
          </div>
          <p className="landing-footer-copy">
            © 2026 Dashboard Adtec Melaka. Hak cipta terpelihara.
          </p>
        </div>
      </footer>
    </div>
  );
}

function AnimatedCounter({ target, animate }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [animate, target]);

  return <span>{count}</span>;
}
