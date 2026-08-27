import React, { useState, useContext, useEffect } from 'react';
import { 
  Search, PlusCircle, Bell, User, LayoutDashboard, 
  MessageSquare, Settings, LogOut, MapPin, Calendar, CheckCircle,
  AlertCircle, Info, X, Menu
} from 'lucide-react';
import './index.css';
import { AdminUsersView, AdminReportsView } from './pages/AdminManagement';
import LandingPage from './pages/LandingPage';
import { AdminAnalyticsView, AdminAuditLogsView } from './pages/AdminAnalyticsLogs';

import { LanguageContext, dict } from './context/LanguageContext';
import { DashboardView } from './pages/DashboardView';
import { SearchView } from './pages/SearchView';
import { AddItemView } from './pages/AddItemView';
import { MessagesView } from './pages/MessagesView';
import { ProfileView } from './pages/ProfileView';
import { LoginView } from './pages/LoginView';
import { SignupView } from './pages/SignupView';
import { ForgotPasswordView } from './pages/ForgotPasswordView';
import { ResetPasswordView } from './pages/ResetPasswordView';
import { supabase } from './supabaseClient';
export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [lang, setLang] = useState('en');
  const t = (key) => dict[lang][key] || key;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('lastActiveTab') || 'home';
  });

  useEffect(() => {
    localStorage.setItem('lastActiveTab', activeTab);
  }, [activeTab]);

  const [activeChatUser, setActiveChatUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications();
      fetchTotalUnreadMessages();

      const itemsChannel = supabase.channel('public:items')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, () => {
          fetchNotifications();
        })
        .subscribe();

      const messagesChannel = supabase.channel('public:messages_notif')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
          if (payload.new && (payload.new.receiver_id === user.id || payload.new.sender_id === user.id)) {
            fetchNotifications();
            fetchTotalUnreadMessages();
          }
        })
        .subscribe();
        
      // Periodically check if the user has been suspended while logged in
      const checkStatusInterval = setInterval(async () => {
        try {
          const { data, error } = await supabase.from('profiles').select('status').eq('id', user.id).single();
          if (data && data.status === 'Suspended') {
            alert('Akaun anda telah digantung oleh Admin.');
            supabase.auth.signOut();
            setIsAuthenticated(false);
            setUser(null);
            setShowLanding(true);
          }
        } catch(e) {
          // ignore
        }
      }, 10000); // Semak setiap 10 saat

      const presenceChannel = supabase.channel('online-users', {
        config: {
          presence: {
            key: user.id,
          },
        },
      });

      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          const state = presenceChannel.presenceState();
          setOnlineUsers(new Set(Object.keys(state)));
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await presenceChannel.track({ online_at: new Date().toISOString() });
          }
        });

      return () => {
        supabase.removeChannel(itemsChannel);
        supabase.removeChannel(messagesChannel);
        supabase.removeChannel(presenceChannel);
        clearInterval(checkStatusInterval);
      };
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    if (!user || !user.id) return;
    try {
      const { data: itemsData } = await supabase
        .from('items')
        .select('*')
        .neq('status', 'deleted')
        .order('created_at', { ascending: false })
        .limit(3);
      
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          id, content, created_at, sender_id,
          sender:profiles!messages_sender_id_fkey(username)
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      let allNotifs = [];
      if (itemsData) {
        allNotifs = [...allNotifs, ...itemsData.map(item => ({ ...item, notifType: 'item' }))];
      }
      if (messagesData) {
        allNotifs = [...allNotifs, ...messagesData.map(msg => ({ 
          id: msg.id, 
          title: msg.sender?.username || 'User',
          content: msg.content,
          created_at: msg.created_at,
          notifType: 'message',
          sender_id: msg.sender_id,
          sender_name: msg.sender?.username || 'User'
        }))];
      }

      allNotifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setNotifications(allNotifs.slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTotalUnreadMessages = async () => {
    if (!user || !user.id) return;
    try {
      const { count, error } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false);
      if (!error) {
        setTotalUnreadMessages(count || 0);
      }
    } catch(e) {}
  };

  const handleContact = async (userId, title) => {
    if (user && user.id === userId) {
      alert(t('cannotContactSelf') || "You cannot contact yourself.");
      return;
    }
    let name = `User ${userId.substring(0, 5)}`;
    try {
      const { data, error } = await supabase.from('profiles').select('username').eq('id', userId).single();
      if (!error && data?.username) {
        name = data.username;
      }
    } catch (e) {
      console.error(e);
    }
    setActiveChatUser({
      id: userId,
      name: name,
      preview: `Item: ${title}`
    });
    setActiveTab('messages');
  };

  useEffect(() => {
    // Apabila pengguna klik link dari email, URL akan mempunyai /reset-password
    if (window.location.pathname === '/reset-password') {
      setShowLanding(false);
      setIsAuthenticated(false);
      setAuthMode('reset-password');
      setIsCheckingAuth(false);
    } else {
      checkUser();
    }
  }, []);

  const checkUser = async () => {
    try {
      const rememberMe = localStorage.getItem('rememberMe');
      const tempSession = sessionStorage.getItem('tempSession');

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        if (rememberMe === 'false' && tempSession !== 'true') {
          // User closed browser/tab, so we don't remember them
          await supabase.auth.signOut();
          localStorage.removeItem('rememberMe');
          return;
        }

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (profile && profile.status === 'Suspended') {
          await supabase.auth.signOut();
          return;
        }
        let role = profile?.role || session.user.user_metadata?.role || 'user';
        let name = profile?.username || session.user.user_metadata?.full_name || session.user.email.split('@')[0];
        
        setUser({ id: session.user.id, email: session.user.email, role, name });
        setIsAuthenticated(true);
        setShowLanding(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--background)' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', borderColor: 'rgba(79, 70, 229, 0.3)', borderLeftColor: 'var(--primary)' }}></div>
      </div>
    );
  }

  if (showLanding) {
    return (
      <LanguageContext.Provider value={{ lang, setLang, t }}>
        <LandingPage onGetStarted={() => setShowLanding(false)} />
      </LanguageContext.Provider>
    );
  }

  if (!isAuthenticated) {
    let authContent;
    if (authMode === 'login') {
      authContent = <LoginView onLogin={(userData) => { setIsAuthenticated(true); setUser(userData); }} onSwitch={() => setAuthMode('signup')} onForgotPassword={() => setAuthMode('forgot-password')} onBackToHome={() => setShowLanding(true)} />;
    } else if (authMode === 'signup') {
      authContent = <SignupView onSignup={(userData) => { setIsAuthenticated(true); setUser(userData); }} onSwitch={() => setAuthMode('login')} />;
    } else if (authMode === 'forgot-password') {
      authContent = <ForgotPasswordView onSwitchBack={() => setAuthMode('login')} />;
    } else if (authMode === 'reset-password') {
      authContent = <ResetPasswordView onBackToLogin={() => {
        window.history.pushState({}, '', '/');
        setAuthMode('login');
      }} />;
    }
    return (
      <LanguageContext.Provider value={{ lang, setLang, t }}>
        {authContent}
      </LanguageContext.Provider>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardView onContact={handleContact} currentUser={user} />;
      case 'search':
        return <SearchView query={searchQuery} setQuery={setSearchQuery} onContact={handleContact} currentUser={user} />;
      case 'admin-analytics':
        return <AdminAnalyticsView />;
      case 'admin-users':
        return <AdminUsersView currentUser={user} />;
      case 'admin-reports':
        return <AdminReportsView currentUser={user} />;
      case 'admin-logs':
        return <AdminAuditLogsView />;
      case 'add':
        return <AddItemView onSuccess={() => setActiveTab('home')} />;
      case 'messages':
        return <MessagesView initialChatUser={activeChatUser} onMessagesRead={fetchTotalUnreadMessages} onlineUsers={onlineUsers} />;
      case 'profile':
        return <ProfileView onContact={handleContact} currentUser={user} />;
      default:
        return <DashboardView onContact={handleContact} currentUser={user} />;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="app-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
          <div className="sidebar-header">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU1ioLqnxA_hYgapTKlsagISjhIZOyPzasjVVkJt5H8vxhKHKhsfmZlpAZ&s=10" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '4px' }} />
            <span>Adtec Melaka</span>
          </div>
          
          <nav style={{ flex: 1 }}>
            <button className={`nav-link w-full text-left ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
              <LayoutDashboard size={20} /> {t('dashboard')}
            </button>
            <button className={`nav-link w-full text-left ${activeTab === 'search' ? 'active' : ''}`} onClick={() => setActiveTab('search')}>
              <Search size={20} /> {t('searchItems')}
            </button>
            <button className={`nav-link w-full text-left ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
              <PlusCircle size={20} /> {t('missingItem')}
            </button>
            <button 
              className={`nav-link w-full text-left ${activeTab === 'messages' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('messages'); setActiveChatUser(null); }}
            >
              <MessageSquare size={20} /> 
              <span style={{ flex: 1 }}>{t('messages')}</span>
              {totalUnreadMessages > 0 && (
                <span style={{ background: '#EF4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, minWidth: '18px', height: '18px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                  {totalUnreadMessages}
                </span>
              )}
            </button>
            
            {(user?.role === 'superadmin' || user?.role === 'admin') && (
              <>
                <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', padding: '0 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('adminPanel')}</div>
                <button className={`nav-link w-full text-left ${activeTab === 'admin-analytics' ? 'active' : ''}`} onClick={() => setActiveTab('admin-analytics')}>
                  <LayoutDashboard size={20} /> {t('analytics')}
                </button>
                <button className={`nav-link w-full text-left ${activeTab === 'admin-users' ? 'active' : ''}`} onClick={() => setActiveTab('admin-users')}>
                  <User size={20} /> {t('manageUsers')}
                </button>
                <button className={`nav-link w-full text-left ${activeTab === 'admin-reports' ? 'active' : ''}`} onClick={() => setActiveTab('admin-reports')}>
                  <Settings size={20} /> {t('manageReports')}
                </button>
                <button className={`nav-link w-full text-left ${activeTab === 'admin-logs' ? 'active' : ''}`} onClick={() => setActiveTab('admin-logs')}>
                  <Calendar size={20} /> {t('auditLogs')}
                </button>
              </>
            )}
          </nav>
        </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.25rem' }} title="Toggle Sidebar">
              <Menu size={24} />
            </button>
            {activeTab === 'search' ? (
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
              <button style={{ position: 'relative', color: 'var(--text-muted)' }} onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={24} />
                {notifications.length > 0 && <span style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', background: '#EF4444', borderRadius: '50%' }}></span>}
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
                            setActiveTab('messages');
                          } else {
                            setActiveTab('home'); 
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
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

        <div className="page-content animate-fade-in" onClick={() => showNotifications && setShowNotifications(false)}>
          {renderContent()}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <LogOut size={48} style={{ color: '#EF4444', margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{t('logoutConfirm')}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('logoutMsg')}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" style={{ background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.75rem 2rem' }} onClick={() => setShowLogoutModal(false)}>{t('cancel')}</button>
              <button className="btn-primary" style={{ background: '#EF4444', padding: '0.75rem 2rem' }} onClick={async () => { 
                await supabase.auth.signOut();
                setShowLogoutModal(false); 
                setIsAuthenticated(false); 
                setUser(null); 
                setActiveTab('home'); 
                localStorage.removeItem('lastActiveTab'); 
                sessionStorage.removeItem('tempSession');
                localStorage.removeItem('rememberMe');
                setShowLanding(true);
              }}>{t('logout')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </LanguageContext.Provider>
  );
}
