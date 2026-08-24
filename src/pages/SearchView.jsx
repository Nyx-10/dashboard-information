import React, { useState, useContext, useEffect } from 'react';
import { Search } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { ItemCard } from '../components/ItemCard';
import { supabase } from '../supabaseClient';

export function SearchView({ query, setQuery, onContact, currentUser }) {
  const { t } = useContext(LanguageContext);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const filtered = items.filter(item => {
    const queryStr = query ? query.toLowerCase() : '';
    const dynamicTitle = item.type === 'info' ? `${t('defaultInfoTitle')} (${item.date})` : item.title;
    const dynamicLocation = item.type === 'info' ? t('defaultLocation') : item.location;
    const matchesQuery = dynamicTitle.toLowerCase().includes(queryStr) || 
                         (item.description && item.description.toLowerCase().includes(queryStr)) ||
                         (dynamicLocation && dynamicLocation.toLowerCase().includes(queryStr));
    
    let typeMatches = false;
    if (filter === 'all') typeMatches = true;
    else if (filter === 'lost' && item.type === 'lost') typeMatches = true;
    else if (filter === 'found' && item.type === 'found') typeMatches = true;
    else if (filter === 'info' && item.type === 'info') typeMatches = true;

    let dateMatches = false;
    if (!dateFilter) dateMatches = true;
    else if (item.date === dateFilter) dateMatches = true;
    
    return matchesQuery && typeMatches && dateMatches;
  });

  return (
    <div className="page-bg-common bg-search">
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t('searchResults')}</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn-primary" style={{ background: filter === 'lost' ? 'var(--primary)' : 'var(--surface)', color: filter === 'lost' ? '#fff' : 'var(--text-main)', border: filter === 'lost' ? '1px solid var(--primary)' : '1px solid var(--border)' }} onClick={() => setFilter('lost')}>{t('lostItems')}</button>
        <button className="btn-primary" style={{ background: filter === 'found' ? 'var(--primary)' : 'var(--surface)', color: filter === 'found' ? '#fff' : 'var(--text-main)', border: filter === 'found' ? '1px solid var(--primary)' : '1px solid var(--border)' }} onClick={() => setFilter('found')}>{t('foundItems')}</button>
        <button className="btn-primary" style={{ background: filter === 'info' ? 'var(--primary)' : 'var(--surface)', color: filter === 'info' ? '#fff' : 'var(--text-main)', border: filter === 'info' ? '1px solid var(--primary)' : '1px solid var(--border)' }} onClick={() => setFilter('info')}>{t('recentlyInfo')}</button>
        {filter !== 'all' && (
          <button className="btn-primary" style={{ background: 'transparent', color: '#EF4444', border: '1px solid #EF4444' }} onClick={() => setFilter('all')}>{t('all')}</button>
        )}
        
        <input 
          type="date"
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', marginLeft: 'auto', outline: 'none' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <h3>{t('loadingReports')}</h3>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <Search size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>{t('noItemsFound')}</h3>
        </div>
      ) : (
        <div className="grid-cards">
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} onContact={onContact} currentUser={currentUser} />
          ))}
        </div>
      )}
    </div>
  );
}
