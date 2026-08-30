import React, { useContext } from 'react';
import { 
  Search, PlusCircle, User, LayoutDashboard, 
  MessageSquare, Settings, Calendar
} from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

export function Sidebar({ 
  sidebarOpen, 
  activeTab, 
  setActiveTab, 
  setActiveChatUser, 
  totalUnreadMessages, 
  user 
}) {
  const { t } = useContext(LanguageContext);

  return (
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
  );
}
