import React, { useContext } from "react";
import {
  MapPin,
  Calendar,
  Trash2,
  Share2,
  CheckCircle,
  AlertCircle,
  Megaphone,
  PackageCheck,
  MessageSquare,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";

export function ItemCardCompact({
  item,
  onContact,
  currentUser,
  onDelete,
  isDeleting,
  isResolveAction,
  onSelect,
  variant = "classic",
}) {
  const { t } = useContext(LanguageContext);
  const currentUserId = currentUser ? currentUser.id : null;

  // ==========================================================================
  // PAPARAN BAHARU (KHAS UNTUK PENGGUNA BIASA DI DASHBOARD)
  // ==========================================================================
  if (variant === "modern") {
    const isResolved = item.status === "resolved";
    const isLost = item.type === "lost";
    const isFound = item.type === "found";
    const isInfo = item.type === "info";

    const accentColor = isResolved
      ? "#6366F1"
      : isLost
        ? "#EF4444"
        : isFound
          ? "#10B981"
          : "#3B82F6";

    const accentBg = isResolved
      ? "rgba(99, 102, 241, 0.1)"
      : isLost
        ? "rgba(239, 68, 68, 0.1)"
        : isFound
          ? "rgba(16, 185, 129, 0.1)"
          : "rgba(59, 130, 246, 0.1)";

    const displayTitle =
      item.title && item.title.trim()
        ? item.title
        : `${t("defaultInfoTitle")} (${item.date || "-"})`;

    const displayLocation =
      item.location && item.location.trim()
        ? item.location
        : t("defaultLocation");

    const renderPlaceholderIcon = () => {
      if (isLost) return <AlertCircle size={28} color={accentColor} />;
      if (isFound) return <PackageCheck size={28} color={accentColor} />;
      return <Megaphone size={28} color={accentColor} />;
    };

    return (
      <div
        className={`item-card item-card-wrapper ${isDeleting ? "item-delete-leave" : ""}`}
        onClick={() => onSelect && onSelect(item)}
        style={{
          flexDirection: "row",
          borderRadius: "0.85rem",
          alignItems: "stretch",
          overflow: "hidden",
          borderLeft: `4px solid ${accentColor}`,
          minHeight: "142px",
          cursor: onSelect ? "pointer" : "default",
        }}
      >
        {item.image ? (
          <a
            href={item.image}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "block",
              width: "118px",
              flexShrink: 0,
              overflow: "hidden",
              background: "var(--surface)",
            }}
          >
            <img
              className="item-card-image"
              src={item.image}
              alt={displayTitle}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                cursor: "zoom-in",
              }}
            />
          </a>
        ) : (
          <div
            style={{
              width: "84px",
              flexShrink: 0,
              background: accentBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px solid var(--card-border)",
            }}
          >
            {renderPlaceholderIcon()}
          </div>
        )}

        <div
          style={{
            padding: "0.85rem 1rem",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            gap: "0.35rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "0.5rem",
                marginBottom: "0.3rem",
              }}
            >
              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "var(--text-main)",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
                title={displayTitle}
              >
                {displayTitle}
              </h3>
              <span
                className={`badge ${isLost ? "badge-lost" : isFound ? "badge-found" : "badge-info"}`}
                style={{
                  fontSize: "0.68rem",
                  padding: "0.18rem 0.55rem",
                  flexShrink: 0,
                  letterSpacing: "0.03em",
                }}
              >
                {isLost
                  ? t("badgeLost")
                  : isFound
                    ? t("badgeFound")
                    : t("badgeInfo")}
              </span>
            </div>

            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--text-muted)",
                lineHeight: 1.45,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "2.35rem",
              }}
            >
              {item.description || "-"}
            </p>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "0.65rem",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                paddingTop: "0.25rem",
                borderTop: "1px solid var(--glass-border)",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  maxWidth: "150px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={displayLocation}
              >
                <MapPin
                  size={12}
                  style={{ color: accentColor, flexShrink: 0 }}
                />
                {displayLocation}
              </span>

              {item.date && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <Calendar size={12} style={{ flexShrink: 0 }} />
                  {item.date}
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const text = `*${displayTitle}*\n📍 ${displayLocation}\n📅 ${item.date || "-"}\n\n${item.description || ""}\n\n${window.location.origin}`;
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(text)}`,
                    "_blank",
                  );
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "rgba(37, 211, 102, 0.1)",
                  border: "1px solid rgba(37, 211, 102, 0.25)",
                  borderRadius: "999px",
                  color: "#25D366",
                  cursor: "pointer",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  marginLeft: "auto",
                  padding: "0.12rem 0.5rem",
                }}
                title="Share to WhatsApp"
              >
                <Share2 size={11} /> Share
              </button>
            </div>

            {((!isInfo &&
              item.created_by &&
              (!currentUserId || item.created_by !== currentUserId)) ||
              (onDelete &&
                currentUser &&
                (item.created_by === currentUser.id ||
                  currentUser.role === "admin" ||
                  currentUser.role === "superadmin") &&
                item.status !== "resolved")) && (
              <div
                style={{ display: "flex", gap: "0.4rem" }}
                onClick={(e) => e.stopPropagation()}
              >
                {!isInfo &&
                  item.created_by &&
                  (!currentUserId || item.created_by !== currentUserId) && (
                    <button
                      className="btn-primary"
                      style={{
                        flex: 1,
                        padding: "0.35rem 0.6rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.35rem",
                        background: "rgba(99, 102, 241, 0.12)",
                        color: "var(--primary)",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (onContact) onContact(item.created_by, displayTitle);
                        else alert(t("messagingComingSoon"));
                      }}
                    >
                      <MessageSquare size={13} />
                      {t("contactReporter")}
                    </button>
                  )}

                {onDelete &&
                  currentUser &&
                  (item.created_by === currentUser.id ||
                    currentUser.role === "admin" ||
                    currentUser.role === "superadmin") &&
                  item.status !== "resolved" && (
                    <button
                      className="btn-primary"
                      style={{
                        flex: 1,
                        padding: "0.35rem 0.6rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.3rem",
                        background: isResolveAction
                          ? "rgba(16, 185, 129, 0.15)"
                          : "rgba(239, 68, 68, 0.15)",
                        color: isResolveAction ? "#10B981" : "#EF4444",
                        border: isResolveAction
                          ? "1px solid rgba(16, 185, 129, 0.35)"
                          : "1px solid rgba(239, 68, 68, 0.35)",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                      }}
                      onClick={() => onDelete(item.id)}
                    >
                      {isResolveAction ? (
                        <CheckCircle size={13} />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      {isResolveAction
                        ? t("markResolved") || "Selesai"
                        : t("deleteBtn")}
                    </button>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // PAPARAN ASAL (CLASSIC — UNTUK ADMIN, SUPER ADMIN & HALAMAN LAIN)
  // ==========================================================================
  return (
    <div
      className={`item-card item-card-wrapper ${isDeleting ? "item-delete-leave" : ""}`}
      style={{
        flexDirection: "row",
        borderRadius: "0.5rem",
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
      {item.image && (
        <a
          href={item.image}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "120px",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          <img
            className="item-card-image"
            src={item.image}
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              cursor: "zoom-in",
            }}
          />
        </a>
      )}
      <div
        style={{
          padding: "0.75rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "0.5rem",
            marginBottom: "0.25rem",
          }}
        >
          <h3 style={{ fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.2 }}>
            {item.type === "info"
              ? `${t("defaultInfoTitle")} (${item.date})`
              : item.title}
          </h3>
          <span
            className={`badge ${item.type === "lost" ? "badge-lost" : item.type === "found" ? "badge-found" : "badge-info"}`}
            style={{
              fontSize: "0.7rem",
              padding: "0.15rem 0.4rem",
              flexShrink: 0,
            }}
          >
            {item.type === "lost"
              ? t("badgeLost")
              : item.type === "found"
                ? t("badgeFound")
                : t("badgeInfo")}
          </span>
        </div>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--text-muted)",
            marginBottom: "0.25rem",
            lineHeight: 1.4,
          }}
        >
          {item.description}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            fontSize: "0.65rem",
            color: "var(--text-muted)",
            marginTop: "auto",
            marginBottom: "0.5rem",
          }}
        >
          <span
            style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
          >
            <MapPin size={10} />{" "}
            {item.type === "info" ? t("defaultLocation") : item.location}
          </span>
          <span
            style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
          >
            <Calendar size={10} /> {item.date}
          </span>

          <button
            onClick={() => {
              const title =
                item.type === "info"
                  ? `${t("defaultInfoTitle")} (${item.date})`
                  : item.title;
              const text = `*${title}*\n📍 ${item.type === "info" ? t("defaultLocation") : item.location}\n📅 ${item.date}\n\n${item.description || ""}\n\n${window.location.origin}`;
              window.open(
                `https://wa.me/?text=${encodeURIComponent(text)}`,
                "_blank",
              );
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.2rem",
              background: "none",
              border: "none",
              color: "#25D366",
              cursor: "pointer",
              fontSize: "0.65rem",
              marginLeft: "auto",
              padding: 0,
            }}
            title="Share to WhatsApp"
          >
            <Share2 size={10} /> Share
          </button>
        </div>

        {item.type !== "info" &&
          item.created_by &&
          (!currentUserId || item.created_by !== currentUserId) && (
            <button
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.25rem",
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
                background: "var(--surface)",
                color: "var(--text-main)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
              onClick={() => {
                if (onContact) onContact(item.created_by, item.title);
                else alert(t("messagingComingSoon"));
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              {t("contactReporter")}
            </button>
          )}

        {onDelete &&
          currentUser &&
          (item.created_by === currentUser.id ||
            currentUser.role === "admin" ||
            currentUser.role === "superadmin") &&
          item.status !== "resolved" && (
            <button
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.25rem",
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
                background: isResolveAction ? "#d1fae5" : "#fee2e2",
                color: isResolveAction ? "#059669" : "#ef4444",
                border: isResolveAction
                  ? "1px solid #34d399"
                  : "1px solid #f87171",
                cursor: "pointer",
                marginTop: "0.25rem",
              }}
              onClick={() => onDelete(item.id)}
            >
              {isResolveAction ? (
                <CheckCircle size={12} />
              ) : (
                <Trash2 size={12} />
              )}
              {isResolveAction
                ? t("markResolved") || "Selesai"
                : t("deleteBtn")}
            </button>
          )}
      </div>
    </div>
  );
}
