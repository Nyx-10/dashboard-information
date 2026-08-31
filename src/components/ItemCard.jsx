import React, { useContext } from 'react';
import { MapPin, Calendar, MessageSquare, Share2 } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

export function ItemCard({ item, onContact, currentUser, onDelete }) {
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
          {item.category && <span style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{item.category}</span>}
          <button 
            onClick={() => {
              const title = item.type === 'info' ? `${t('defaultInfoTitle')} (${item.date})` : item.title;
              const text = `*${title}*\n📍 ${item.type === 'info' ? t('defaultLocation') : item.location}\n📅 ${item.date}\n\n${item.description || ''}\n\n${window.location.origin}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#25D366', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            <Share2 size={16} /> WhatsApp
          </button>
          {item.type !== 'info' && currentUserId && item.created_by !== currentUserId && (
            <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => { if (onContact) onContact(item.created_by, item.title); else alert(t('messagingComingSoon')); }}>
              <MessageSquare size={16} /> {t('contactReporter')}
            </button>
          )}
          {onDelete && currentUser && (item.created_by === currentUser.id || currentUser.role === 'admin' || currentUser.role === 'superadmin') && (
            <button className="btn-primary" style={{ width: '100%', padding: '0.25rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', background: '#fee2e2', color: '#ef4444', border: '1px solid #f87171', cursor: 'pointer', marginTop: '0.5rem' }} onClick={() => onDelete(item.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              {t('deleteBtn') || 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
