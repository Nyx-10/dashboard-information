import React, { useState, useContext, useEffect, useRef } from 'react';
import { Settings, Sun, Moon, Edit2, Shield, Bell, Activity, Save, Key, User as UserIcon, List, CheckCircle, Clock } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { AppContext } from '../context/AppContext';
import { ItemCardCompact } from '../components/ItemCardCompact';
import { supabase } from '../supabaseClient';

export function ProfileView({ onContact, currentUser }) {
  const { lang, setLang, t } = useContext(LanguageContext);
  const { setUser: setGlobalUser } = useContext(AppContext);
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({ phone: '', department: '', email_notifs: true, match_notifs: true });
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Tabs state
  const [activeTab, setActiveTab] = useState('profile'); // profile, reports, security
  const [activeReportTab, setActiveReportTab] = useState('all'); // all, active, resolved

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  async function fetchProfileData() {
    try {
      setLoading(true);
      const { data: { user: supabaseUser } } = await supabase.auth.getUser();
      
      if (supabaseUser) {
        // Fetch profiles table
        const { data: pData } = await supabase.from('profiles').select('*').eq('id', supabaseUser.id).single();
        
        setUser({
          id: supabaseUser.id,
          name: currentUser?.name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.username || 'User',
          email: supabaseUser.email,
          avatar_url: pData?.avatar_url || currentUser?.avatar_url
        });

        if (pData) {
           setProfileData({
             phone: pData.phone || '',
             department: pData.department || '',
             email_notifs: pData.email_notifs !== false,
             match_notifs: pData.match_notifs !== false
           });
        }

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

      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(`avatars/${fileName}`, file);

      if (uploadError) throw new Error('Gagal memuat naik gambar: ' + uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(`avatars/${fileName}`);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', supabaseUser.id);
        
      if (updateError) throw updateError;

      setUser(prev => ({ ...prev, avatar_url: publicUrl }));
      
      if (setGlobalUser) {
        setGlobalUser(prev => ({ ...prev, avatar_url: publicUrl }));
      } else if (currentUser) {
         currentUser.avatar_url = publicUrl;
      }
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

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const { error } = await supabase.from('profiles').update({
        phone: profileData.phone,
        department: profileData.department,
        email_notifs: profileData.email_notifs,
        match_notifs: profileData.match_notifs
      }).eq('id', user.id);
      
      if (error) throw error;
      alert('Profil berjaya disimpan!');
    } catch (e) {
      console.error(e);
      alert('Ralat: Sila pastikan anda telah menjalankan script SQL (add_profile_features.sql) di pangkalan data Supabase.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;
    if (password !== confirm) return alert('Kata laluan tidak sepadan!');
    if (password.length < 6) return alert('Kata laluan mestilah sekurang-kurangnya 6 aksara.');

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      alert('Kata laluan berjaya ditukar!');
      e.target.reset();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm(t ? t('logoutConfirm')?.replace('Log Out', 'Delete') || 'Are you sure you want to delete this report?' : 'Are you sure?');
    if (!confirmDelete) return;

    setDeletingItemId(itemId);
    try {
      const { error } = await supabase.from('items').update({ status: 'deleted' }).eq('id', itemId);
      if (error) throw error;
      setTimeout(() => {
        setUserItems(userItems.filter(item => item.id !== itemId));
        setDeletingItemId(null);
      }, 500);
    } catch (error) {
      console.error('Error deleting item:', error.message);
      alert('Gagal memadam laporan.');
      setDeletingItemId(null);
    }
  };

  // Stats calculation
  const totalReports = userItems.length;
  const resolvedReports = userItems.filter(i => i.status === 'resolved').length;
  const activeReports = userItems.filter(i => i.status !== 'resolved').length;

  const filteredItems = userItems.filter(item => {
    if (activeReportTab === 'active') return item.status !== 'resolved';
    if (activeReportTab === 'resolved') return item.status === 'resolved';
    return true;
  });

  return (
    <div className="page-bg-common bg-profile" style={{ paddingBottom: '3rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Profile Header Card */}
        <div className="glass-panel profile-header" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div 
            style={{ position: 'relative', cursor: 'pointer' }}
            onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
            title="Tukar Gambar Profil"
          >
            <img 
              className="profile-avatar" 
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff&size=120`} 
              alt="User" 
              style={{ borderRadius: '50%', width: '120px', height: '120px', objectFit: 'cover', opacity: uploadingAvatar ? 0.5 : 1, border: '4px solid var(--surface)' }} 
            />
            <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', color: 'white', borderRadius: '50%', padding: '0.4rem', boxShadow: 'var(--shadow-md)' }}>
              <Edit2 size={16} />
            </div>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} style={{ display: 'none' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{user?.name || 'User Name'}</h1>
              {resolvedReports > 3 && (
                <span style={{ background: '#f59e0b', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  🏅 Trusted Finder
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>{user?.email || 'Email'}</p>
            
            <div style={{ display: 'flex', gap: '1rem', position: 'relative', zIndex: 20, flexWrap: 'wrap' }}>
              <button className="btn-primary" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }} onClick={() => setShowSettings(!showSettings)}>
                <Settings size={18} /> {t('languageSettings')}
              </button>
              <button className="btn-primary" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border)' }} onClick={() => {
                const html = document.documentElement;
                const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                html.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
              }}>
                {document.documentElement.getAttribute('data-theme') === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                {' '}{document.documentElement.getAttribute('data-theme') === 'light' ? (t('darkMode') || 'Dark Mode') : (t('lightMode') || 'Light Mode')}
              </button>

              {showSettings && (
                <div className="glass-panel notif-dropdown-enter" style={{ position: 'absolute', top: '110%', left: 0, width: '200px', zIndex: 10, padding: '1rem', boxShadow: 'var(--shadow-lg)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input type="radio" name="lang" checked={lang === 'ms'} onChange={() => setLang('ms')} /> {t('malay')}
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input type="radio" name="lang" checked={lang === 'en'} onChange={() => setLang('en')} /> {t('english')}
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Stats Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Activity size={32} style={{ color: '#3B82F6', margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{totalReports}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Jumlah Laporan</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Clock size={32} style={{ color: '#F59E0B', margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{activeReports}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Sedang Aktif (Pending)</p>
          </div>
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <CheckCircle size={32} style={{ color: '#10B981', margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>{resolvedReports}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Telah Diselesaikan</p>
          </div>
        </div>

        {/* Main Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'transparent', border: 'none', color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'profile' ? 600 : 400, borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
            <UserIcon size={18} /> Profil & Notifikasi
          </button>
          <button className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'transparent', border: 'none', color: activeTab === 'reports' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'reports' ? 600 : 400, borderBottom: activeTab === 'reports' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
            <List size={18} /> Sejarah Laporan
          </button>
          <button className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'transparent', border: 'none', color: activeTab === 'security' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'security' ? 600 : 400, borderBottom: activeTab === 'security' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
            <Shield size={18} /> Keselamatan
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'profile' && (
          <div className="glass-panel" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserIcon size={20} className="text-primary" /> Kemas Kini Maklumat
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Nombor Telefon</label>
                <input type="text" className="input-field" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} placeholder="Contoh: 012-3456789" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Jabatan / Kursus</label>
                <input type="text" className="input-field" value={profileData.department} onChange={e => setProfileData({...profileData, department: e.target.value})} placeholder="Contoh: Kejuruteraan Komputer" />
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <Bell size={20} className="text-primary" /> Tetapan Notifikasi
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '1.2rem', height: '1.2rem' }} checked={profileData.email_notifs} onChange={e => setProfileData({...profileData, email_notifs: e.target.checked})} />
                <span>Terima e-mel apabila ada mesej baru masuk.</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: '1.2rem', height: '1.2rem' }} checked={profileData.match_notifs} onChange={e => setProfileData({...profileData, match_notifs: e.target.checked})} />
                <span>Beritahu saya jika ada pengguna terjumpa barang mirip laporan saya.</span>
              </label>
            </div>

            <button className="btn-primary" onClick={handleSaveProfile} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={18} /> {saving ? 'Menyimpan...' : 'Simpan Profil'}
            </button>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="glass-panel" style={{ padding: '2rem', animation: 'fadeIn 0.3s ease' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={20} className="text-primary" /> Tukar Kata Laluan
            </h3>
            <form onSubmit={handleChangePassword} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Kata Laluan Baru</label>
                <input type="password" name="password" className="input-field" required minLength={6} placeholder="********" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sahkan Kata Laluan Baru</label>
                <input type="password" name="confirm" className="input-field" required minLength={6} placeholder="********" />
              </div>
              <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                Kemas Kini Kata Laluan
              </button>
            </form>
          </div>
        )}

        {activeTab === 'reports' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {/* Sub-tabs for reports */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button onClick={() => setActiveReportTab('all')} className={`btn-primary ${activeReportTab === 'all' ? '' : 'btn-outline'}`} style={{ padding: '0.4rem 1rem', background: activeReportTab === 'all' ? 'var(--primary)' : 'transparent', color: activeReportTab === 'all' ? 'white' : 'var(--text-main)', border: '1px solid var(--primary)' }}>Semua</button>
              <button onClick={() => setActiveReportTab('active')} className={`btn-primary ${activeReportTab === 'active' ? '' : 'btn-outline'}`} style={{ padding: '0.4rem 1rem', background: activeReportTab === 'active' ? '#F59E0B' : 'transparent', color: activeReportTab === 'active' ? 'white' : 'var(--text-main)', border: '1px solid #F59E0B' }}>Aktif (Pending)</button>
              <button onClick={() => setActiveReportTab('resolved')} className={`btn-primary ${activeReportTab === 'resolved' ? '' : 'btn-outline'}`} style={{ padding: '0.4rem 1rem', background: activeReportTab === 'resolved' ? '#10B981' : 'transparent', color: activeReportTab === 'resolved' ? 'white' : 'var(--text-main)', border: '1px solid #10B981' }}>Selesai</button>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>{t('loadingReports')}</p>
            ) : filteredItems.length === 0 ? (
              <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Tiada laporan dijumpai untuk kategori ini.</p>
              </div>
            ) : (
              <div className="grid-cards">
                {filteredItems.map(item => (
                  <ItemCardCompact key={item.id} item={item} onContact={onContact} currentUser={currentUser} onDelete={handleDelete} isDeleting={deletingItemId === item.id} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
