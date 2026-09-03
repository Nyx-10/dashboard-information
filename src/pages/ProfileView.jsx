import React, { useState, useContext, useEffect } from 'react';
import { Settings, Sun, Moon } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { AppContext } from '../context/AppContext';
import { ItemCardCompact } from '../components/ItemCardCompact';
import { supabase } from '../supabaseClient';

export function ProfileView({ onContact, currentUser }) {
  const { lang, setLang, t } = useContext(LanguageContext);
  const { setUser: setGlobalUser } = useContext(AppContext);
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  async function fetchProfileData() {
    try {
      setLoading(true);
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (supabaseUser) {
        // Fetch profiles table for avatar_url
        const { data: profileData } = await supabase.from('profiles').select('avatar_url').eq('id', supabaseUser.id).single();
        
        setUser({
          name: currentUser?.name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.username || 'User',
          email: supabaseUser.email,
          avatar_url: profileData?.avatar_url || currentUser?.avatar_url
        });

        // Fetch items reported by this user
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .eq('created_by', supabaseUser.id)
          .neq('status', 'deleted')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        if (data) setUserItems(data);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Saiz fail terlalu besar (maksimum 5MB).');
      return;
    }

    try {
      setUploadingAvatar(true);
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      if (!supabaseUser) throw new Error('Sila log masuk semula.');

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${supabaseUser.id}_${Date.now()}.${fileExt}`;

      // Upload to item-images bucket
      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(`avatars/${fileName}`, file);

      if (uploadError) throw new Error('Gagal memuat naik gambar: ' + uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(`avatars/${fileName}`);

      // Update profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', supabaseUser.id);
        
      if (updateError) {
         if (updateError.code === 'PGRST204' || updateError.message.includes('avatar_url')) {
            throw new Error('Sistem pangkalan data perlu dikemas kini. Sila run SQL script yang diberikan.');
         }
         throw updateError;
      }

      setUser(prev => ({ ...prev, avatar_url: publicUrl }));
      
      // Update global context state so Topbar re-renders
      if (setGlobalUser) {
        setGlobalUser(prev => ({ ...prev, avatar_url: publicUrl }));
      } else if (currentUser) {
         currentUser.avatar_url = publicUrl;
      }

      // Forceful dispatch to ensure all components sync instantly
      window.dispatchEvent(new CustomEvent('avatarUpdated', { detail: publicUrl }));

      alert('Gambar profil berjaya ditukar!');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm(t ? t('logoutConfirm')?.replace('Log Out', 'Delete') || 'Are you sure you want to delete this report?' : 'Are you sure?');
    if (!confirmDelete) return;

    setDeletingItemId(itemId);
    try {
      // Soft delete: set status to 'deleted'
      const { error } = await supabase
        .from('items')
        .update({ status: 'deleted' })
        .eq('id', itemId);
        
      if (error) throw error;
      
      setTimeout(() => {
        setUserItems(userItems.filter(item => item.id !== itemId));
        setDeletingItemId(null);
      }, 500);
    } catch (error) {
      console.error('Error deleting item:', error.message);
      alert(t('alertFailedDelete'));
      setDeletingItemId(null);
    }
  };

  return (
    <div className="page-bg-common bg-profile">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="glass-panel profile-header" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div 
          style={{ position: 'relative', cursor: 'pointer' }}
          onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
          title={t('uploadAvatar') || 'Tukar Gambar Profil'}
        >
          <img 
            className="profile-avatar" 
            src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff&size=120`} 
            alt="User" 
            style={{ borderRadius: '50%', width: '120px', height: '120px', objectFit: 'cover', opacity: uploadingAvatar ? 0.5 : 1 }} 
          />
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleAvatarUpload} 
            style={{ display: 'none' }} 
          />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{user?.name || 'User Name'}</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{user?.email || 'Email'}</p>
          <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 20, flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }} onClick={() => setShowSettings(!showSettings)}>
              <Settings size={18} /> {t('languageSettings')}
            </button>
            <button className="btn-primary" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }} onClick={() => {
              const html = document.documentElement;
              const currentTheme = html.getAttribute('data-theme');
              const newTheme = currentTheme === 'light' ? 'dark' : 'light';
              html.setAttribute('data-theme', newTheme);
              localStorage.setItem('theme', newTheme);
            }}>
              {document.documentElement.getAttribute('data-theme') === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              {' '}{document.documentElement.getAttribute('data-theme') === 'light' ? (t('darkMode') || 'Dark Mode') : (t('lightMode') || 'Light Mode')}
            </button>

            {showSettings && (
              <div className="glass-panel notif-dropdown-enter" style={{ position: 'absolute', top: '110%', left: 0, width: '200px', zIndex: 10, padding: '1rem', boxShadow: 'var(--shadow-lg)', maxHeight: '150px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="radio" name="lang" checked={lang === 'ms'} onChange={() => setLang('ms')} /> {t('malay')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="radio" name="lang" checked={lang === 'en'} onChange={() => setLang('en')} /> {t('english')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="radio" name="lang" checked={lang === 'zh'} onChange={() => setLang('zh')} /> {t('chinese')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="radio" name="lang" checked={lang === 'ta'} onChange={() => setLang('ta')} /> {t('tamil')}
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{t('myReports')}</h2>
      
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('loadingReports')}</p>
      ) : userItems.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('noReportsMade')}</p>
      ) : (
        <div className="grid-cards">
          {userItems.map(item => (
            <ItemCardCompact key={item.id} item={item} onContact={onContact} currentUser={currentUser} onDelete={handleDelete} isDeleting={deletingItemId === item.id} />
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
