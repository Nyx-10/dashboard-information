import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export function ForgotPasswordView({ onSwitchBack }) {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // PERHATIAN: Gantikan URL di bawah dengan URL API Backend anda yang sebenar
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Gagal menghantar e-mel. Sila pastikan e-mel anda berdaftar.');
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Ralat Forgot Password:', err);
      if (err.message === 'Failed to fetch' || err.message === 'Load failed') {
        setError('Tidak dapat menyambung ke pelayan Backend (Port 5000). Sila pastikan Firewall komputer anda ditutup atau membenarkan port 5000.');
      } else {
        setError(err.message || 'Sistem mengalami ralat. Sila cuba lagi nanti.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-auth" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          style={{ padding: '0.4rem', borderRadius: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', outline: 'none', cursor: 'pointer', fontWeight: 500 }}
        >
          <option value="ms">Melayu</option>
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>
      <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <img src="https://esijil.jtm.gov.my/images/toplogo1.png" alt="Adtec Melaka Logo" style={{ height: '60px', margin: '0 auto 1rem', display: 'block' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t ? t('forgotTitle') : 'Lupa Kata Laluan'}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {t ? t('forgotDesc') : 'Masukkan e-mel anda dan kami akan menghantar pautan untuk menetapkan semula kata laluan.'}
        </p>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'left', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t ? t('emailLabel') : 'Email'}</label>
              <input 
                type="email" 
                required 
                className="input-field" 
                placeholder="student@adtec.edu.my" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '1rem', padding: '0.75rem', width: '100%', opacity: loading ? 0.7 : 1 }}>
              {loading ? (t ? (t('sending') || 'Sending...') : 'Sending...') : (t ? t('sendLinkBtn') : 'Hantar Pautan')}
            </button>
          </form>
        ) : (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#10B981', fontWeight: 600 }}>{t ? t('linkSentTitle') : 'Pautan telah dihantar!'}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {t ? t('linkSentDesc') : 'Sila semak peti masuk e-mel anda untuk arahan selanjutnya.'}
            </p>
          </div>
        )}
        
        <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          <button 
            onClick={onSwitchBack} 
            style={{ color: 'var(--text-main)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}
          >
            {t ? t('backToLoginBtn') : 'Kembali ke Log Masuk'}
          </button>
        </p>
      </div>
    </div>
  );
}
