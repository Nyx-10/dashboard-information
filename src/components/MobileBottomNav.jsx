import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  PlusCircle,
  MessageSquare,
  User,
  LogIn,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { AppContext } from "../context/AppContext";

export function MobileBottomNav() {
  const { lang, t } = useContext(LanguageContext);
  const isMs = lang === "ms";
  const {
    user,
    isAuthenticated,
    requireAuth,
    goToLogin,
    totalUnreadMessages,
    setActiveChatUser,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (
      path === "/home" &&
      (location.pathname === "/" || location.pathname === "/home")
    )
      return true;
    return location.pathname.startsWith(path);
  };

  const handleNav = (path, isMessage = false) => {
    if (path === "/add" && !isAuthenticated && requireAuth) {
      requireAuth("/add", t("loginRequiredToReport"), { reason: "report" });
      return;
    }
    if (path === "/messages" && !isAuthenticated && requireAuth) {
      requireAuth("/messages", t("loginRequiredForMessages"), {
        reason: "messages",
      });
      return;
    }
    if (isMessage && setActiveChatUser) {
      setActiveChatUser(null);
    }
    navigate(path);
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <button
        type="button"
        className={`mobile-nav-item ${isActive("/home") ? "active" : ""}`}
        onClick={() => handleNav("/home")}
      >
        <div className="mobile-nav-icon-wrapper">
          <LayoutDashboard size={20} />
        </div>
        <span>{isMs ? "Utama" : "Home"}</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item ${isActive("/search") ? "active" : ""}`}
        onClick={() => handleNav("/search")}
      >
        <div className="mobile-nav-icon-wrapper">
          <Search size={20} />
        </div>
        <span>{isMs ? "Cari" : "Search"}</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item mobile-nav-center ${isActive("/add") ? "active" : ""}`}
        onClick={() => handleNav("/add")}
      >
        <div className="mobile-nav-center-icon">
          <PlusCircle size={22} />
        </div>
        <span>{isMs ? "Lapor" : "Report"}</span>
      </button>

      <button
        type="button"
        className={`mobile-nav-item ${isActive("/messages") ? "active" : ""}`}
        onClick={() => handleNav("/messages", true)}
      >
        <div className="mobile-nav-icon-wrapper">
          <MessageSquare size={20} />
          {totalUnreadMessages > 0 && (
            <span className="mobile-nav-badge">
              {totalUnreadMessages > 9 ? "9+" : totalUnreadMessages}
            </span>
          )}
        </div>
        <span>{isMs ? "Mesej" : "Chat"}</span>
      </button>

      {isAuthenticated && user ? (
        <button
          type="button"
          className={`mobile-nav-item ${isActive("/profile") ? "active" : ""}`}
          onClick={() => handleNav("/profile")}
        >
          <div className="mobile-nav-icon-wrapper">
            <User size={20} />
          </div>
          <span>{isMs ? "Profil" : "Profile"}</span>
        </button>
      ) : (
        <button
          type="button"
          className={`mobile-nav-item ${isActive("/login") ? "active" : ""}`}
          onClick={() => goToLogin && goToLogin()}
        >
          <div className="mobile-nav-icon-wrapper">
            <LogIn size={20} />
          </div>
          <span>{isMs ? "Masuk" : "Sign In"}</span>
        </button>
      )}
    </nav>
  );
}
