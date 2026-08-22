import React, { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { ItemCardCompact } from '../components/ItemCardCompact';
import { MOCK_ITEMS } from '../data/mockData';

export function DashboardView() {
  const { t } = useContext(LanguageContext);
  return (
    <div style={{ backgroundImage: 'url(/night_sky_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: 'calc(100vh - 60px)', margin: '-1.5rem', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Dashboard Adtec Melaka</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('welcomeBack')}</p>
        </div>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('infoOnly')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {MOCK_ITEMS.filter(item => item.type === 'info').slice(0, 8).map(item => (
            <ItemCardCompact key={item.id} item={item} />
          ))}
        </div>
      </div>

      <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t('recentlyReported')}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        {MOCK_ITEMS.filter(item => item.type !== 'info').slice(0, 8).map(item => (
          <ItemCardCompact key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
