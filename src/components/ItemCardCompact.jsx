import React, { useContext } from 'react';
import { MapPin, Calendar, Trash2, Share2 } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

export function ItemCardCompact({ item, onContact, currentUser, onDelete }) {
  const { t } = useContext(LanguageContext);
  const currentUserId = currentUser ? currentUser.id : null;

  return (
    <div className="item-card item-card-wrapper" style={{ flexDirection: 'row', borderRadius: '0.5rem', alignItems: 'stretch', overflow: 'hidden' }}>
      {item.image && (
        <a href={item.image} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '120px', flexShrink: 0, overflow: 'hidden' }}>
          <img className="item-card-image" src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }} />
        </a>
      )}
      <div style={{ padding: '0.75rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.2 }}>
            {item.type === 'info' ? `${t('defaultInfoTitle')} (${item.date})` : item.title}
          </h3>
          <span className={`badge ${item.type === 'lost' ? 'badge-lost' : item.type === 'found' ? 'badge-found' : 'badge-info'}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', flexShrink: 0 }}>
            {item.type === 'lost' ? t('badgeLost') : item.type === 'found' ? t('badgeFound') : t('badgeInfo')}
          </span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', lineHeight: 1.4 }}>
          {item.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 'auto', marginBottom: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={10} /> {item.type === 'info' ? t('defaultLocation') : item.location}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Calendar size={10} /> {item.date}</span>

          <button 
            onClick={() => {
              const title = item.type === 'info' ? `${t('defaultInfoTitle')} (${item.date})` : item.title;
              const text = `*${title}*\n📍 ${item.type === 'info' ? t('defaultLocation') : item.location}\n📅 ${item.date}\n\n${item.description || ''}\n\n${window.location.origin}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'none', border: 'none', color: '#25D366', cursor: 'pointer', fontSize: '0.65rem', marginLeft: 'auto', padding: 0 }}
            title="Share to WhatsApp"
          >
            <Share2 size={10} /> Share
          </button>
        </div>
        
        {item.type !== 'info' && currentUserId && item.created_by !== currentUserId && (
            <button className="btn-primary" style={{ width: '100%', padding: '0.25rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => { if (onContact) onContact(item.created_by, item.title); else alert(t('messagingComingSoon')); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              {t('contactReporter')}
            </button>
        )}

        {onDelete && currentUser && (item.created_by === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
            <button className="btn-primary" style={{ width: '100%', padding: '0.25rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', background: '#fee2e2', color: '#ef4444', border: '1px solid #f87171', cursor: 'pointer', marginTop: '0.25rem' }} onClick={() => onDelete(item.id)}>
              <Trash2 size={12} />
              {t('deleteBtn')}
            </button>
        )}
      </div>
    </div>
  );
}
