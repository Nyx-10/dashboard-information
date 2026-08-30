import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, PlusCircle, User, LayoutDashboard, 
  MessageSquare, Settings, Calendar
} from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

export function Sidebar({ 
  sidebarOpen, 
  setActiveChatUser, 
  totalUnreadMessages, 
  user 
}) {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine active tab based on pathname
  const isActive = (path) => {
    if (path === '/home' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <div className="sidebar-header">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU1ioLqnxA_hYgapTKlsagISjhIZOyPzasjVVkJt5H8vxhKHKhsfmZlpAZ&s=10" alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '4px' }} />
        <span>Adtec Melaka</span>
      </div>
      
      <nav style={{ flex: 1 }}>
        <button className={`nav-link w-full text-left ${isActive('/home') ? 'active' : ''}`} onClick={() => navigate('/home')}>
          <LayoutDashboard size={20} /> {t('dashboard')}
        </button>
        <button className={`nav-link w-full text-left ${isActive('/search') ? 'active' : ''}`} onClick={() => navigate('/search')}>
          <Search size={20} /> {t('searchItems')}
        </button>
        <button className={`nav-link w-full text-left ${isActive('/add') ? 'active' : ''}`} onClick={() => navigate('/add')}>
          <PlusCircle size={20} /> {t('missingItem')}
        </button>
        <button 
          className={`nav-link w-full text-left ${isActive('/messages') ? 'active' : ''}`} 
          onClick={() => { setActiveChatUser(null); navigate('/messages'); }}
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
            <button className={`nav-link w-full text-left ${isActive('/admin-analytics') ? 'active' : ''}`} onClick={() => navigate('/admin-analytics')}>
              <LayoutDashboard size={20} /> {t('analytics')}
            </button>
            <button className={`nav-link w-full text-left ${isActive('/admin-users') ? 'active' : ''}`} onClick={() => navigate('/admin-users')}>
              <User size={20} /> {t('manageUsers')}
            </button>
            <button className={`nav-link w-full text-left ${isActive('/admin-reports') ? 'active' : ''}`} onClick={() => navigate('/admin-reports')}>
              <Settings size={20} /> {t('manageReports')}
            </button>
            <button className={`nav-link w-full text-left ${isActive('/admin-logs') ? 'active' : ''}`} onClick={() => navigate('/admin-logs')}>
              <Calendar size={20} /> {t('auditLogs')}
            </button>
          </>
        )}
      </nav>
    </aside>
  );
}
