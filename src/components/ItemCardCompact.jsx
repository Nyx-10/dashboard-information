import React, { useContext, useEffect, useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';

export function ItemCardCompact({ item, onContact }) {
  const { t } = useContext(LanguageContext);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setCurrentUserId(user.id);
    });
  }, []);

  return (
    <div className="item-card" style={{ flexDirection: 'row', borderRadius: '0.5rem', alignItems: 'stretch' }}>
      {item.image && (
        <img src={item.image} alt={item.title} style={{ width: '80px', minHeight: '80px', objectFit: 'cover', flexShrink: 0 }} />
      )}
      <div style={{ padding: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.25rem', marginBottom: '0.2rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.2 }}>{item.title}</h3>
          <span className={`badge ${item.type === 'lost' ? 'badge-lost' : item.type === 'found' ? 'badge-found' : 'badge-info'}`} style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem', flexShrink: 0 }}>
            {item.type}
          </span>
        </div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem', lineHeight: 1.3 }}>
          {item.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 'auto', marginBottom: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={10} /> {item.location}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Calendar size={10} /> {item.date}</span>
        </div>
        {item.type !== 'info' && item.created_by !== currentUserId && (
            <button className="btn-primary" style={{ width: '100%', padding: '0.25rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => { if (onContact) onContact(item.created_by, item.title); else alert('Sistem pemesejan dengan pemilik akan datang!'); }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              {item.type === 'lost' ? 'Contact Owner' : 'Contact Finder'}
            </button>
        )}
      </div>
    </div>
  );
}
