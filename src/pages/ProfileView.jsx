import React, { useState, useContext } from 'react';
import { Settings } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { ItemCardCompact } from '../components/ItemCardCompact';
import { MOCK_ITEMS } from '../data/mockData';

export function ProfileView() {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="page-bg-common bg-profile">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <img src="https://ui-avatars.com/api/?name=User+Name&background=4F46E5&color=fff&size=120" alt="User" style={{ borderRadius: '50%' }} />
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>John Doe</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Computer Science Student • Member since 2024</p>
          <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 20 }}>
            <button className="btn-primary" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }} onClick={() => setShowSettings(!showSettings)}>
              <Settings size={18} /> {t('languageSettings')}
            </button>

            {showSettings && (
              <div className="glass-panel" style={{ position: 'absolute', top: '110%', left: 0, width: '200px', zIndex: 10, padding: '1rem', boxShadow: 'var(--shadow-lg)', maxHeight: '150px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="radio" name="lang" checked={lang === 'ms'} onChange={() => setLang('ms')} /> {t('malay')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="radio" name="lang" checked={lang === 'en'} onChange={() => setLang('en')} /> {t('english')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="radio" name="lang" checked={lang === 'zh'} onChange={() => setLang('zh')} /> {t('chinese')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="radio" name="lang" checked={lang === 'ta'} onChange={() => setLang('ta')} /> {t('tamil')}
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{t('myReports')}</h2>
      <div className="grid-cards">
        <ItemCardCompact item={MOCK_ITEMS[0]} />
        <ItemCardCompact item={MOCK_ITEMS[2]} />
      </div>
    </div>
    </div>
  );
}
