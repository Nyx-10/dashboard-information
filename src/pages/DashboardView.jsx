import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { ItemCardCompact } from '../components/ItemCardCompact';
import { ItemCard } from '../components/ItemCard';
import { supabase } from '../supabaseClient';

export function DashboardView({ onContact, currentUser }) {
  const { t } = useContext(LanguageContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();

    const channel = supabase.channel('dashboard_items_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, () => {
        fetchItems();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .neq('status', 'deleted')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const infoItems = items.filter(item => item.type === 'info').slice(0, 8);
  const reportItems = items.filter(item => item.type !== 'info').slice(0, 8);

  return (
    <div style={{ backgroundImage: 'url(/night_sky_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: 'calc(100vh - 60px)', margin: '-1.5rem', padding: '1.5rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Dashboard Adtec Melaka</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('welcomeBack')}</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t('loadingReports')}</div>
      ) : (
        <>
          <div style={{ marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('infoOnly')}</h2>
            {infoItems.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {infoItems.map(item => (
                  <ItemCardCompact key={item.id} item={item} onContact={onContact} currentUser={currentUser} />
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('noInfoYet')}</p>
            )}
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>{t('recentlyReported')}</h2>
            {reportItems.length > 0 ? (
              <div className="grid-cards">
                {reportItems.map(item => (
                  <ItemCard key={item.id} item={item} onContact={onContact} currentUser={currentUser} />
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>{t('noReportsYet')}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
