import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, PlusCircle, User, LayoutDashboard, 
  MessageSquare, Settings, Calendar, Bot, Sparkles
} from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { AppContext } from '../context/AppContext';

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { t } = useContext(LanguageContext);
  const { user, setActiveChatUser, totalUnreadMessages, isChatbotOpen, setIsChatbotOpen } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine active tab based on pathname
  const isActive = (path) => {
    if (path === '/home' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  const handleNav = (path, isMessage = false) => {
    if (isMessage) {
      setActiveChatUser(null);
    }
    navigate(path);
    if (window.innerWidth <= 768 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {sidebarOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
        />
      )}
      <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
        <div className="sidebar-header">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU1ioLqnxA_hYgapTKlsagISjhIZOyPzasjVVkJt5H8vxhKHKhsfmZlpAZ&s=10" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '4px' }} />
          <span>Adtec Melaka</span>
        </div>
        
        <nav style={{ flex: 1 }}>
          <button className={`nav-link w-full text-left ${isActive('/home') ? 'active' : ''}`} onClick={() => handleNav('/home')}>
            <LayoutDashboard size={20} /> {t('dashboard')}
          </button>
          <button className={`nav-link w-full text-left ${isActive('/search') ? 'active' : ''}`} onClick={() => handleNav('/search')}>
            <Search size={20} /> {t('searchItems')}
          </button>
          <button className={`nav-link w-full text-left ${isActive('/add') ? 'active' : ''}`} onClick={() => handleNav('/add')}>
            <PlusCircle size={20} /> {t('missingItem')}
          </button>
          <button 
            className={`nav-link w-full text-left ${isActive('/messages') ? 'active' : ''}`} 
            onClick={() => handleNav('/messages', true)}
          >
            <MessageSquare size={20} /> 
            <span style={{ flex: 1 }}>{t('messages')}</span>
            {totalUnreadMessages > 0 && (
              <span className="unread-badge-pulse" style={{ background: '#EF4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, minWidth: '18px', height: '18px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                {totalUnreadMessages}
              </span>
            )}
          </button>
          
          <button 
            className={`nav-link w-full text-left ai-nav-btn ${isChatbotOpen ? 'active' : ''}`} 
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <Bot size={20} className="ai-bot-icon" /> 
            <span style={{ flex: 1, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              AdtecBot AI <Sparkles size={14} className="ai-sparkles-icon" color={isChatbotOpen ? "#fcd34d" : "#ec4899"} />
            </span>
          </button>

          {(user?.role === 'superadmin' || user?.role === 'admin') && (
            <>
              <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', padding: '0 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('adminPanel')}</div>
              <button className={`nav-link w-full text-left ${isActive('/admin-analytics') ? 'active' : ''}`} onClick={() => handleNav('/admin-analytics')}>
                <LayoutDashboard size={20} /> {t('analytics')}
              </button>
              <button className={`nav-link w-full text-left ${isActive('/admin-users') ? 'active' : ''}`} onClick={() => handleNav('/admin-users')}>
                <User size={20} /> {t('manageUsers')}
              </button>
              <button className={`nav-link w-full text-left ${isActive('/admin-reports') ? 'active' : ''}`} onClick={() => handleNav('/admin-reports')}>
                <Settings size={20} /> {t('manageReports')}
              </button>
              <button className={`nav-link w-full text-left ${isActive('/admin-logs') ? 'active' : ''}`} onClick={() => handleNav('/admin-logs')}>
                <Calendar size={20} /> {t('auditLogs')}
              </button>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
