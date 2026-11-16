import React, { useContext } from "react";
import {
  MapPin,
  Calendar,
  MessageSquare,
  Share2,
  AlertCircle,
  PackageCheck,
  Megaphone,
  Trash2,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";

export function ItemCard({ item, onContact, currentUser, onDelete }) {
  const { lang, t } = useContext(LanguageContext);
  const isMs = lang === "ms";
  const currentUserId = currentUser ? currentUser.id : null;

  const isLost = item.type === "lost";
  const isFound = item.type === "found";
  const isInfo = item.type === "info";

  const accentColor = isLost ? "#EF4444" : isFound ? "#10B981" : "#3B82F6";
  const placeholderGradient = isLost
    ? "linear-gradient(135deg, rgba(239, 68, 68, 0.16) 0%, rgba(244, 63, 94, 0.05) 100%)"
    : isFound
      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(6, 182, 212, 0.05) 100%)"
      : "linear-gradient(135deg, rgba(59, 130, 246, 0.16) 0%, rgba(99, 102, 241, 0.05) 100%)";

  const PlaceholderIcon = isLost
    ? AlertCircle
    : isFound
      ? PackageCheck
      : Megaphone;

  const displayTitle =
    item.type === "info"
      ? item.title && item.title.trim()
        ? item.title
        : `${t("defaultInfoTitle")} (${item.date})`
      : item.title;

  const displayLocation =
    item.type === "info"
      ? item.location && item.location.trim()
        ? item.location
        : t("defaultLocation")
      : item.location;

  return (
    <div
      className="item-card item-card-wrapper"
      style={{
        borderTop: `3px solid ${accentColor}`,
      }}
    >
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          height: item.image ? "200px" : "135px",
          background: placeholderGradient,
          borderBottom: "1px solid var(--card-border)",
        }}
      >
        {item.image ? (
          <a
            href={item.image}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "block", width: "100%", height: "100%" }}
          >
            <img
              src={item.image}
              alt={displayTitle}
              className="item-image item-card-image"
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
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.45rem",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                background: "var(--surface)",
                border: `1px solid ${accentColor}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              <PlaceholderIcon size={24} color={accentColor} />
            </div>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.03em",
              }}
            >
              {isLost
                ? isMs
                  ? "Laporan Barang Hilang"
                  : "Lost Item Report"
                : isFound
                  ? isMs
                    ? "Laporan Barang Dijumpai"
                    : "Found Item Report"
                  : isMs
                    ? "Hebahan Rasmi Kolej"
                    : "College Announcement"}
            </span>
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: "0.85rem",
            right: "0.85rem",
            zIndex: 2,
          }}
        >
          <span
            className={`badge ${isLost ? "badge-lost" : isFound ? "badge-found" : "badge-info"}`}
            style={{
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {isLost
              ? t("badgeLost")
              : isFound
                ? t("badgeFound")
                : t("badgeInfo")}
          </span>
        </div>
      </div>

      <div
        className="item-details"
        style={{ padding: "1.15rem 1.25rem", gap: "0.5rem" }}
      >
        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            lineHeight: 1.35,
            color: "var(--text-main)",
            marginBottom: "0.15rem",
          }}
        >
          {displayTitle}
        </h3>
        <p
          style={{
            fontSize: "0.86rem",
            color: "var(--text-muted)",
            lineHeight: 1.5,
            marginBottom: "0.65rem",
            flex: 1,
          }}
        >
          {item.description || "-"}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            fontSize: "0.82rem",
            color: "var(--text-muted)",
            borderTop: "1px solid var(--border)",
            paddingTop: "0.85rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                minWidth: 0,
              }}
            >
              <MapPin
                size={15}
                style={{ color: accentColor, flexShrink: 0 }}
              />
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayLocation}
              </span>
            </span>

            {item.date && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.78rem",
                }}
              >
                <Calendar size={14} style={{ flexShrink: 0 }} />
                {item.date}
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginTop: "0.35rem",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => {
                const text = `*${displayTitle}*\n📍 ${displayLocation}\n📅 ${item.date || "-"}\n\n${item.description || ""}\n\n${window.location.origin}`;
                window.open(
                  `https://wa.me/?text=${encodeURIComponent(text)}`,
                  "_blank",
                );
              }}
              className="btn-primary"
              style={{
                flex: "1 1 110px",
                padding: "0.5rem 0.75rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.4rem",
                background: "rgba(37, 211, 102, 0.14)",
                color: "#25D366",
                border: "1px solid rgba(37, 211, 102, 0.35)",
                borderRadius: "0.6rem",
                cursor: "pointer",
              }}
            >
              <Share2 size={15} /> WhatsApp
            </button>

            {!isInfo &&
              item.created_by &&
              (!currentUserId || item.created_by !== currentUserId) && (
                <button
                  className="btn-primary"
                  style={{
                    flex: "1 1 130px",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    background: "rgba(99, 102, 241, 0.14)",
                    color: "var(--primary)",
                    border: "1px solid rgba(99, 102, 241, 0.35)",
                    borderRadius: "0.6rem",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (onContact) onContact(item.created_by, displayTitle);
                    else alert(t("messagingComingSoon"));
                  }}
                >
                  <MessageSquare size={15} /> {t("contactReporter")}
                </button>
              )}
          </div>

          {onDelete &&
            currentUser &&
            (item.created_by === currentUser.id ||
              currentUser.role === "admin" ||
              currentUser.role === "superadmin") && (
              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "0.42rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35rem",
                  background: "rgba(239, 68, 68, 0.12)",
                  color: "#ef4444",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  borderRadius: "0.6rem",
                  cursor: "pointer",
                  marginTop: "0.15rem",
                }}
                onClick={() => onDelete(item.id)}
              >
                <Trash2 size={15} />
                {t("deleteBtn") || "Delete"}
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
