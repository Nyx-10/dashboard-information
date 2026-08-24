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
export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [lang, setLang] = useState('en');
  const t = (key) => dict[lang][key] || key;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Apabila pengguna klik link dari email, URL akan mempunyai /reset-password
    if (window.location.pathname === '/reset-password') {
      setShowLanding(false);
      setIsAuthenticated(false);
      setAuthMode('reset-password');
    }
  }, []);

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
        return <DashboardView onContact={() => setActiveTab('messages')} />;
      case 'search':
        return <SearchView query={searchQuery} setQuery={setSearchQuery} onContact={() => setActiveTab('messages')} />;
      case 'admin-analytics':
        return <AdminAnalyticsView />;
      case 'admin-users':
        return <AdminUsersView />;
      case 'admin-reports':
        return <AdminReportsView />;
      case 'admin-logs':
        return <AdminAuditLogsView />;
      case 'add':
        return <AddItemView onSuccess={() => setActiveTab('home')} />;
      case 'messages':
        return <MessagesView />;
      case 'profile':
        return <ProfileView onContact={() => setActiveTab('messages')} />;
      default:
        return <DashboardView onContact={() => setActiveTab('messages')} />;
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
            <button className={`nav-link w-full text-left ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
              <MessageSquare size={20} /> {t('messages')}
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
                  placeholder="Search anything..." 
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
                <span style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', background: '#EF4444', borderRadius: '50%' }}></span>
              </button>
              {showNotifications && (
                <div className="glass-panel" style={{ position: 'absolute', right: 0, top: '110%', width: '340px', zIndex: 999, padding: '0', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Notifications</div>
                  <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                    <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                      <AlertCircle size={18} style={{ color: '#EF4444', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Barang Hilang</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>MacBook Pro 14" dilaporkan hilang di Library 2nd Floor.</p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>2 min lalu</span>
                      </div>
                    </div>
                    <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                      <Info size={18} style={{ color: '#3B82F6', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Information Only</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Peringatan keselamatan baru telah dikeluarkan oleh pihak pentadbiran.</p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>1 jam lalu</span>
                      </div>
                    </div>
                    <div style={{ padding: '0.875rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                      <MessageSquare size={18} style={{ color: '#10B981', marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Mesej Baru</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Alex Smith menghantar mesej: "Is this your MacBook?"</p>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>3 jam lalu</span>
                      </div>
                    </div>
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
                  {user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Normal User'}
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
              <button className="btn-primary" style={{ background: '#EF4444', padding: '0.75rem 2rem' }} onClick={() => { setShowLogoutModal(false); setIsAuthenticated(false); setUser(null); }}>{t('logout')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </LanguageContext.Provider>
  );
}
