import React, { useContext } from 'react';
import { MapPin, Calendar, MessageSquare } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

export function ItemCard({ item }) {
  const { t } = useContext(LanguageContext);
  return (
    <div className="item-card">
      <div style={{ position: 'relative' }}>
        {item.image && (
          <img src={item.image} alt={item.title} className="item-image" />
        )}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <span className={`badge ${item.type === 'lost' ? 'badge-lost' : item.type === 'found' ? 'badge-found' : 'badge-info'}`}>
            {item.type}
          </span>
        </div>
      </div>
      <div className="item-details">
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{item.title}</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>{item.description}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} /> {item.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} /> {item.date}
          </div>
          {item.type !== 'info' && (
            <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => alert('Sistem pemesejan dengan pemilik akan datang!')}>
              <MessageSquare size={16} /> {t ? t('contactReporter') : 'Contact Reporter'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
