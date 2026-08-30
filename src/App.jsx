import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import './index.css';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
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
  const navigate = useNavigate();
  const [showLanding, setShowLanding] = useState(() => {
    return sessionStorage.getItem('showLanding') !== 'false';
  });

  useEffect(() => {
    sessionStorage.setItem('showLanding', showLanding);
  }, [showLanding]);

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [lang, setLang] = useState('en');
  const t = (key) => dict[lang][key] || key;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [authMode, setAuthMode] = useState(() => {
    return sessionStorage.getItem('authMode') || 'login';
  });

  useEffect(() => {
    sessionStorage.setItem('authMode', authMode);
  }, [authMode]);

  const [user, setUser] = useState(null);

  const [activeChatUser, setActiveChatUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  const [lastSeenNotifTime, setLastSeenNotifTime] = useState(0);

  useEffect(() => {
    if (user?.id) {
      const time = parseInt(localStorage.getItem('lastSeenNotifTime_' + user.id) || '0', 10);
      setLastSeenNotifTime(time);
    }
  }, [user?.id]);

  const hasUnreadNotifications = notifications.some(n => new Date(n.created_at).getTime() > lastSeenNotifTime);

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
        
      // Listen for profile updates (e.g. account suspension)
      const profileChannel = supabase.channel('public:profiles_status')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, (payload) => {
          if (payload.new && payload.new.status === 'Suspended') {
            alert(t('accountSuspended') || 'Your account has been suspended.');
            supabase.auth.signOut();
            setIsAuthenticated(false);
            setUser(null);
            setShowLanding(true);
          }
        })
        .subscribe();

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
        supabase.removeChannel(profileChannel);
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
    navigate('/messages');
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
      authContent = <LoginView onLogin={(userData) => { setIsAuthenticated(true); setUser(userData); navigate('/home'); }} onSwitch={() => setAuthMode('signup')} onForgotPassword={() => setAuthMode('forgot-password')} onBackToHome={() => setShowLanding(true)} />;
    } else if (authMode === 'signup') {
      authContent = <SignupView onSignup={(userData) => { setIsAuthenticated(true); setUser(userData); navigate('/home'); }} onSwitch={() => setAuthMode('login')} />;
    } else if (authMode === 'forgot-password') {
      authContent = <ForgotPasswordView onSwitchBack={() => setAuthMode('login')} />;
    } else if (authMode === 'reset-password') {
      authContent = <ResetPasswordView onBackToLogin={() => {
        navigate('/');
        setAuthMode('login');
      }} />;
    }
    return (
      <LanguageContext.Provider value={{ lang, setLang, t }}>
        {authContent}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div className="app-container">
        {/* Sidebar */}
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setActiveChatUser={setActiveChatUser}
          totalUnreadMessages={totalUnreadMessages}
          user={user}
        />

      {/* Main Content */}
      <main className="main-content">
        <Topbar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          hasUnreadNotifications={hasUnreadNotifications}
          setLastSeenNotifTime={setLastSeenNotifTime}
          notifications={notifications}
          setActiveChatUser={setActiveChatUser}
          setShowLogoutModal={setShowLogoutModal}
          user={user}
        />

        <div className="page-content animate-fade-in" onClick={() => showNotifications && setShowNotifications(false)}>
          <Routes>
            <Route path="/home" element={<DashboardView onContact={handleContact} currentUser={user} />} />
            <Route path="/search" element={<SearchView query={searchQuery} setQuery={setSearchQuery} onContact={handleContact} currentUser={user} />} />
            <Route path="/admin-analytics" element={<AdminAnalyticsView />} />
            <Route path="/admin-users" element={<AdminUsersView currentUser={user} />} />
            <Route path="/admin-reports" element={<AdminReportsView currentUser={user} />} />
            <Route path="/admin-logs" element={<AdminAuditLogsView />} />
            <Route path="/add" element={<AddItemView onSuccess={() => navigate('/home')} />} />
            <Route path="/messages" element={<MessagesView initialChatUser={activeChatUser} onMessagesRead={fetchTotalUnreadMessages} onlineUsers={onlineUsers} />} />
            <Route path="/profile" element={<ProfileView onContact={handleContact} currentUser={user} />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
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
                navigate('/'); 
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
