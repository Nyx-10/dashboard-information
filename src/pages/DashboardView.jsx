import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { ItemCardCompact } from '../components/ItemCardCompact';
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

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const { error } = await supabase.from('items').update({ status: 'deleted' }).eq('id', itemId);
        if (error) throw error;
        alert(t('alertSuccessDelete') || 'Successfully deleted!');
        fetchItems();
      } catch (err) {
        alert((t('alertFailedDelete') || 'Failed to delete: ') + err.message);
      }
    }
  };

  const infoItems = items.filter(item => item.type === 'info').slice(0, 8);
  const reportItems = items.filter(item => item.type !== 'info').slice(0, 8);

  return (
    <div style={{ backgroundImage: 'url(/night_sky_bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: 'calc(100vh - 60px)', margin: '-1.5rem', padding: '1.5rem' }}>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>{t('loadingReports')}</div>
      ) : (
        <>
          <div style={{ marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('infoOnly')}</h2>
            {infoItems.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {infoItems.map(item => (
                  <ItemCardCompact key={item.id} item={item} onContact={onContact} currentUser={currentUser} onDelete={((currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && item.created_by !== currentUser?.id) ? handleDelete : undefined} />
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('noInfoYet')}</p>
            )}
          </div>

          <div>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('recentlyReported')}</h2>
            {reportItems.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {reportItems.map(item => (
                  <ItemCardCompact key={item.id} item={item} onContact={onContact} currentUser={currentUser} onDelete={((currentUser?.role === 'admin' || currentUser?.role === 'superadmin') && item.created_by !== currentUser?.id) ? handleDelete : undefined} />
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
