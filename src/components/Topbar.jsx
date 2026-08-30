import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, LogOut, Menu, MessageSquare, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { AppContext } from '../context/AppContext';

export function Topbar({
  sidebarOpen,
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
  showNotifications,
  setShowNotifications,
  setShowLogoutModal
}) {
  const { t } = useContext(LanguageContext);
  const { user, hasUnreadNotifications, setLastSeenNotifTime, notifications, setActiveChatUser } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isSearchActive = location.pathname.startsWith('/search');

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.25rem' }} title="Toggle Sidebar">
          <Menu size={24} />
        </button>
        {isSearchActive ? (
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder={t('searchAnything')} 
              style={{ paddingLeft: '40px' }}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
          </div>
        ) : null}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ position: 'relative' }}>
          <button style={{ position: 'relative', color: 'var(--text-muted)' }} onClick={() => {
            setShowNotifications(!showNotifications);
            if (!showNotifications && user?.id) {
              const now = Date.now();
              setLastSeenNotifTime(now);
              localStorage.setItem('lastSeenNotifTime_' + user.id, now.toString());
            }
          }}>
            <Bell size={24} />
            {hasUnreadNotifications && <span style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', background: '#EF4444', borderRadius: '50%' }}></span>}
          </button>
          {showNotifications && (
            <div className="glass-panel" style={{ position: 'absolute', right: 0, top: '110%', width: '340px', zIndex: 999, padding: '0', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{t('notifications')}</div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map((item, idx) => (
                    <div key={`${item.notifType}-${item.id}`} style={{ padding: '0.875rem 1.25rem', borderBottom: idx < notifications.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => { 
                      if (item.notifType === 'message') {
                        setActiveChatUser({ id: item.sender_id, name: item.sender_name, preview: item.content });
                        navigate('/messages');
                      } else {
                        navigate('/home'); 
                      }
                      setShowNotifications(false); 
                    }}>
                      {item.notifType === 'message' ? (
                        <MessageSquare size={18} style={{ color: '#4F46E5', marginTop: '2px', flexShrink: 0 }} />
                      ) : item.type === 'lost' ? (
                        <AlertCircle size={18} style={{ color: '#EF4444', marginTop: '2px', flexShrink: 0 }} />
                      ) : item.type === 'found' ? (
                        <CheckCircle size={18} style={{ color: '#10B981', marginTop: '2px', flexShrink: 0 }} />
                      ) : (
                        <Info size={18} style={{ color: '#3B82F6', marginTop: '2px', flexShrink: 0 }} />
                      )}
                      <div>
                        {item.notifType === 'message' ? (
                          <>
                            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>{t('messageFrom')} {item.sender_name}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.content.substring(0, 40)}{item.content.length > 40 ? '...' : ''}</p>
                          </>
                        ) : (
                          <>
                            <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.25rem', textTransform: 'capitalize' }}>{t('newReport')} {item.type === 'lost' ? t('badgeLost') : item.type === 'found' ? t('badgeFound') : t('badgeInfo')}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {item.type === 'info' ? `${t('defaultInfoTitle')} (${item.date})` : item.title} - {item.type === 'info' ? t('defaultLocation') : item.location}
                            </p>
                          </>
                        )}
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('justNow')}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {t('noNewNotifications')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #EF4444', fontSize: '0.8rem', fontWeight: 500 }} onClick={() => setShowLogoutModal(true)}>
          <LogOut size={16} /> {t('logout')}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.role === 'superadmin' ? 'Adam darwish' : (user?.name || 'User'))}&background=4F46E5&color=fff`} alt="User" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
              {user?.role === 'superadmin' ? 'Adam darwish' : (user?.name || 'User')}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : t('normalUser')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
