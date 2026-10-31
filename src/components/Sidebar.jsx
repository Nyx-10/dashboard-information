import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  PlusCircle,
  User,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Calendar,
  Bot,
  Sparkles,
  X,
  Lock,
  LogIn,
  Home,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { AppContext } from "../context/AppContext";

export function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { t } = useContext(LanguageContext);
  const {
    user,
    isAuthenticated,
    requireAuth,
    goToLogin,
    goToLanding,
    setActiveChatUser,
    totalUnreadMessages,
    isChatbotOpen,
    setIsChatbotOpen,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to determine active tab based on pathname
  const isActive = (path) => {
    if (path === "/home" && location.pathname === "/") return true;
    return location.pathname.startsWith(path);
  };

  const closeMobileSidebar = () => {
    if (window.innerWidth <= 768 && setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  const handleNav = (path, isMessage = false) => {
    closeMobileSidebar();
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
    if (isMessage) {
      setActiveChatUser(null);
    }
    navigate(path);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
        />
      )}
      <aside className={`sidebar ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
        <div
          className="sidebar-header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU1ioLqnxA_hYgapTKlsagISjhIZOyPzasjVVkJt5H8vxhKHKhsfmZlpAZ&s=10"
              alt="Logo"
              style={{ width: "28px", height: "28px", borderRadius: "4px" }}
            />
            <span>Adtec Melaka</span>
          </div>
          {setSidebarOpen && (
            <button
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav style={{ flex: 1 }}>
          <button
            className={`nav-link w-full text-left ${isActive("/home") ? "active" : ""}`}
            onClick={() => handleNav("/home")}
          >
            <LayoutDashboard size={20} /> {t("dashboard")}
          </button>
          <button
            className={`nav-link w-full text-left ${isActive("/search") ? "active" : ""}`}
            onClick={() => handleNav("/search")}
          >
            <Search size={20} /> {t("searchItems")}
          </button>
          <button
            className={`nav-link w-full text-left ${isActive("/add") ? "active" : ""}`}
            onClick={() => handleNav("/add")}
          >
            <PlusCircle size={20} />
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
              {t("missingItem")}
            </span>
            {!isAuthenticated && (
              <Lock size={14} style={{ opacity: 0.65, flexShrink: 0 }} />
            )}
          </button>
          <button
            className={`nav-link w-full text-left ${isActive("/messages") ? "active" : ""}`}
            onClick={() => handleNav("/messages", true)}
          >
            <MessageSquare size={20} />
            <span style={{ flex: 1 }}>{t("messages")}</span>
            {!isAuthenticated ? (
              <Lock size={14} style={{ opacity: 0.65, flexShrink: 0 }} />
            ) : (
              totalUnreadMessages > 0 && (
                <span
                  className="unread-badge-pulse"
                  style={{
                    background: "#EF4444",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    minWidth: "18px",
                    height: "18px",
                    borderRadius: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                  }}
                >
                  {totalUnreadMessages}
                </span>
              )
            )}
          </button>

          <button
            className={`nav-link w-full text-left ai-nav-btn ${isChatbotOpen ? "active" : ""}`}
            onClick={() => setIsChatbotOpen(!isChatbotOpen)}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <Bot size={20} className="ai-bot-icon" />
            <span
              style={{
                flex: 1,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              AdtecBot AI{" "}
              <Sparkles
                size={14}
                className="ai-sparkles-icon"
                color={isChatbotOpen ? "#fcd34d" : "#ec4899"}
              />
            </span>
          </button>

          {(user?.role === "superadmin" || user?.role === "admin") && (
            <>
              <div
                style={{
                  marginTop: "1.5rem",
                  marginBottom: "0.5rem",
                  padding: "0 1rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                }}
              >
                {t("adminPanel")}
              </div>
              <button
                className={`nav-link w-full text-left ${isActive("/admin-analytics") ? "active" : ""}`}
                onClick={() => handleNav("/admin-analytics")}
              >
                <LayoutDashboard size={20} /> {t("analytics")}
              </button>
              <button
                className={`nav-link w-full text-left ${isActive("/admin-users") ? "active" : ""}`}
                onClick={() => handleNav("/admin-users")}
              >
                <User size={20} /> {t("manageUsers")}
              </button>
              <button
                className={`nav-link w-full text-left ${isActive("/admin-reports") ? "active" : ""}`}
                onClick={() => handleNav("/admin-reports")}
              >
                <Settings size={20} /> {t("manageReports")}
              </button>
              <button
                className={`nav-link w-full text-left ${isActive("/admin-logs") ? "active" : ""}`}
                onClick={() => handleNav("/admin-logs")}
              >
                <Calendar size={20} /> {t("auditLogs")}
              </button>
            </>
          )}
        </nav>

        {!isAuthenticated && (
          <div
            style={{
              marginTop: "1rem",
              padding: "1rem",
              borderRadius: "0.85rem",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "0.65rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--primary)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              <Lock size={13} />
              <span>{t("guestModeBadge")}</span>
            </div>
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                lineHeight: 1.45,
                whiteSpace: "normal",
              }}
            >
              {t("guestSidebarDesc")}
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                closeMobileSidebar();
                if (goToLogin) goToLogin();
              }}
              style={{
                width: "100%",
                padding: "0.55rem 0.75rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                borderRadius: "0.55rem",
              }}
            >
              <LogIn size={15} />
              <span>
                {t("loginBtn")} / {t("signUpBtn")}
              </span>
            </button>
            <button
              onClick={() => {
                closeMobileSidebar();
                if (goToLanding) goToLanding();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.35rem",
                fontSize: "0.75rem",
                fontWeight: 500,
                color: "var(--text-muted)",
                padding: "0.2rem",
                cursor: "pointer",
              }}
            >
              <Home size={13} />
              <span>{t("backToIntro")}</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
