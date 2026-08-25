import React, { useContext } from 'react';
import { MapPin, Calendar, MessageSquare } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

export function ItemCard({ item, onContact, currentUser }) {
  const { t } = useContext(LanguageContext);
  const currentUserId = currentUser ? currentUser.id : null;

  return (
    <div className="item-card">
      <div style={{ position: 'relative' }}>
        {item.image && (
          <a href={item.image} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
            <img src={item.image} alt={item.title} className="item-image" style={{ cursor: 'zoom-in' }} />
          </a>
        )}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
          <span className={`badge ${item.type === 'lost' ? 'badge-lost' : item.type === 'found' ? 'badge-found' : 'badge-info'}`}>
            {item.type === 'lost' ? t('badgeLost') : item.type === 'found' ? t('badgeFound') : t('badgeInfo')}
          </span>
        </div>
      </div>
      <div className="item-details">
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          {item.type === 'info' ? `${t('defaultInfoTitle')} (${item.date})` : item.title}
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem', flex: 1 }}>{item.description}</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} /> {item.type === 'info' ? t('defaultLocation') : item.location}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} /> {item.date}
          </div>
          {item.type !== 'info' && currentUserId && item.created_by !== currentUserId && (
            <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => { if (onContact) onContact(item.created_by, item.title); else alert(t('messagingComingSoon')); }}>
              <MessageSquare size={16} /> {t('contactReporter')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
