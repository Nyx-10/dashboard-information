import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, PlusCircle, MessageSquare, User } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { AppContext } from '../context/AppContext';

export function MobileBottomNav() {
  const { t } = useContext(LanguageContext);
  const { totalUnreadMessages, setActiveChatUser } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/home' && (location.pathname === '/' || location.pathname === '/home')) return true;
    return location.pathname.startsWith(path);
  };

  const handleNav = (path, isMessage = false) => {
    if (isMessage && setActiveChatUser) {
      setActiveChatUser(null);
    }
    navigate(path);
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <button 
        type="button"
        className={`mobile-nav-item ${isActive('/home') ? 'active' : ''}`}
        onClick={() => handleNav('/home')}
      >
        <LayoutDashboard size={20} />
        <span>{t('dashboard')}</span>
      </button>

      <button 
        type="button"
        className={`mobile-nav-item ${isActive('/search') ? 'active' : ''}`}
        onClick={() => handleNav('/search')}
      >
        <Search size={20} />
        <span>{t('searchItems')?.split(' ')[0] || 'Cari'}</span>
      </button>

      <button 
        type="button"
        className={`mobile-nav-item mobile-nav-center ${isActive('/add') ? 'active' : ''}`}
        onClick={() => handleNav('/add')}
      >
        <div className="mobile-nav-center-icon">
          <PlusCircle size={22} />
        </div>
        <span>{t('missingItem')?.split(' ')[0] || 'Tambah'}</span>
      </button>

      <button 
        type="button"
        className={`mobile-nav-item ${isActive('/messages') ? 'active' : ''}`}
        onClick={() => handleNav('/messages', true)}
      >
        <div className="mobile-nav-icon-wrapper">
          <MessageSquare size={20} />
          {totalUnreadMessages > 0 && (
            <span className="mobile-nav-badge">
              {totalUnreadMessages > 9 ? '9+' : totalUnreadMessages}
            </span>
          )}
        </div>
        <span>{t('messages')}</span>
      </button>

      <button 
        type="button"
        className={`mobile-nav-item ${isActive('/profile') ? 'active' : ''}`}
        onClick={() => handleNav('/profile')}
      >
        <User size={20} />
        <span>{t('profile')}</span>
      </button>
    </nav>
  );
}
