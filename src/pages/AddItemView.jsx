import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';

export function AddItemView({ onSuccess }) {
  const { t } = useContext(LanguageContext);
  
  const [type, setType] = useState('lost');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (type !== 'info') {
      if (!title || !date || !location) {
        alert('Sila isikan medan yang diwajibkan (Nama, Tarikh, Lokasi).');
        return;
      }
    } else {
      if (!date || !description) {
        alert('Sila isikan tarikh dan penerangan untuk maklumat ini.');
        return;
      }
    }

    const finalTitle = type === 'info' ? 'Maklumat (' + date + ')' : title;
    const finalLocation = type === 'info' ? 'Umum' : location;
    
    setLoading(true);

    try {
      // Get current logged in user
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('items')
        .insert([
          { 
            title: finalTitle,
            type,
            location: finalLocation,
            date,
            description,
            status: 'open',
            created_by: user ? user.id : null 
          }
        ]);

      if (error) throw error;
      
      alert('Berjaya ditambah!');
      if (onSuccess) onSuccess();
    } catch (error) {
      alert('Gagal menambah data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-bg-common bg-add-item">
      <div style={{ maxWidth: '600px', margin: '0 auto' }} className="glass-panel">
        <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>{t('reportTitle')}</h1>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t('reportTypeField')}</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <label style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="type" value="lost" checked={type === 'lost'} onChange={() => setType('lost')} /> {t('typeLost')}
              </label>
              <label style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="type" value="found" checked={type === 'found'} onChange={() => setType('found')} /> {t('typeFound')}
              </label>
              <label style={{ flex: '1 1 150px', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="type" value="info" checked={type === 'info'} onChange={() => setType('info')} /> {t('typeInfo')}
              </label>
            </div>
          </div>

          {type !== 'info' && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t('itemName')}</label>
              <input type="text" className="input-field" placeholder={t('itemNamePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t('date')}</label>
              <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            {type !== 'info' && (
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t('location')}</label>
                <input type="text" className="input-field" placeholder={t('locationPlaceholder')} value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t('description')}</label>
            <textarea className="input-field" rows="4" placeholder={t('descriptionPlaceholder')} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t('photo')}</label>
            <div style={{ border: '2px dashed var(--border)', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
               {t('photoUpload')}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? t('saving') : t('submitReport')}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}
