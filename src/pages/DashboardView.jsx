import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Megaphone,
  PackageSearch,
  PlusCircle,
  Search,
  ArrowRight,
  MapPin,
  Calendar,
  X,
  MessageSquare,
  Share2,
  Lock,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { AppContext } from "../context/AppContext";
import { ItemCardCompact } from "../components/ItemCardCompact";
import { supabase } from "../supabaseClient";

export function DashboardView({ onContact, currentUser }) {
  const { lang, t } = useContext(LanguageContext);
  const { requireAuth } = useContext(AppContext) || {};
  const navigate = useNavigate();
  const isMs = lang === "ms";
  const isGuest = !currentUser;

  const normalizedRole = currentUser?.role
    ? currentUser.role.toLowerCase().replace(/\s+/g, "")
    : "";
  const isAdminOrSuperAdmin =
    normalizedRole === "admin" || normalizedRole === "superadmin";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportFilter, setReportFilter] = useState("all"); // 'all' | 'lost' | 'found'
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems(true);

    const channel = supabase
      .channel("dashboard_items_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => {
          fetchItems(false);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchItems(showLoading = false) {
    try {
      if (showLoading) setLoading(true);

      const [infoRes, reportRes] = await Promise.all([
        supabase
          .from("items")
          .select("*")
          .neq("status", "deleted")
          .neq("status", "resolved")
          .eq("type", "info")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("items")
          .select("*")
          .neq("status", "deleted")
          .neq("status", "resolved")
          .neq("type", "info")
          .order("created_at", { ascending: false })
          .limit(12),
      ]);

      if (infoRes.error) throw infoRes.error;
      if (reportRes.error) throw reportRes.error;

      if (infoRes.data && reportRes.data) {
        setItems([...infoRes.data, ...reportRes.data]);
      }
    } catch (error) {
      console.error("Error fetching items:", error.message);
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  const handleDelete = async (itemId) => {
    if (
      window.confirm(
        t("confirmDelete") || "Are you sure you want to delete this item?",
      )
    ) {
      try {
        const { error } = await supabase
          .from("items")
          .update({ status: "deleted" })
          .eq("id", itemId);
        if (error) throw error;
        alert(t("alertSuccessDelete") || "Successfully deleted!");
        fetchItems();
      } catch (err) {
        alert((t("alertFailedDelete") || "Failed to delete: ") + err.message);
      }
    }
  };

  // ==========================================================================
  // PAPARAN ASAL (KHAS UNTUK ADMIN & SUPER ADMIN)
  // ==========================================================================
  if (isAdminOrSuperAdmin) {
    const infoItemsClassic = items
      .filter((item) => item.type === "info")
      .slice(0, 8);
    const reportItemsClassic = items
      .filter((item) => item.type !== "info")
      .slice(0, 8);

    return (
      <div className="page-bg-common bg-dashboard">
        {loading ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            <div>
              <div
                className="skeleton"
                style={{ width: "150px", height: "20px", marginBottom: "1rem" }}
              />
              <div className="grid-cards" style={{ gap: "0.75rem" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="skeleton"
                    style={{ height: "120px", width: "100%" }}
                  />
                ))}
              </div>
            </div>
            <div>
              <div
                className="skeleton"
                style={{ width: "150px", height: "20px", marginBottom: "1rem" }}
              />
              <div className="grid-cards" style={{ gap: "0.75rem" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="skeleton"
                    style={{ height: "120px", width: "100%" }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "0.75rem" }}>
              <h2
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "var(--text-main)",
                }}
              >
                {t("infoOnly")}
              </h2>
              {infoItemsClassic.length > 0 ? (
                <div className="grid-cards" style={{ gap: "0.75rem" }}>
                  {infoItemsClassic.map((item) => (
                    <ItemCardCompact
                      key={item.id}
                      item={item}
                      onContact={onContact}
                      currentUser={currentUser}
                      variant="classic"
                      onDelete={
                        item.created_by !== currentUser?.id
                          ? handleDelete
                          : undefined
                      }
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    background: "var(--surface)",
                    borderRadius: "1rem",
                    border: "1px dashed var(--border)",
                  }}
                >
                  <div
                    className="floating-icon"
                    style={{
                      fontSize: "3rem",
                      marginBottom: "1rem",
                      opacity: 0.5,
                    }}
                  >
                    📭
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {t("noInfoYet")}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h2
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "var(--text-main)",
                }}
              >
                {t("recentlyReported")}
              </h2>
              {reportItemsClassic.length > 0 ? (
                <div className="grid-cards" style={{ gap: "0.75rem" }}>
                  {reportItemsClassic.map((item) => (
                    <ItemCardCompact
                      key={item.id}
                      item={item}
                      onContact={onContact}
                      currentUser={currentUser}
                      variant="classic"
                      onDelete={
                        item.created_by !== currentUser?.id
                          ? handleDelete
                          : undefined
                      }
                    />
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "3rem",
                    textAlign: "center",
                    background: "var(--surface)",
                    borderRadius: "1rem",
                    border: "1px dashed var(--border)",
                  }}
                >
                  <div
                    className="floating-icon"
                    style={{
                      fontSize: "3rem",
                      marginBottom: "1rem",
                      opacity: 0.5,
                    }}
                  >
                    🔍
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {t("noReportsYet")}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // ==========================================================================
  // PAPARAN BAHARU (KHAS UNTUK PENGGUNA BIASA / USER SAHAJA)
  // ==========================================================================
  const infoItems = items.filter((item) => item.type === "info").slice(0, 6);
  const allReportItems = items.filter((item) => item.type !== "info");
  const filteredReportItems = allReportItems
    .filter((item) =>
      reportFilter === "all" ? true : item.type === reportFilter,
    )
    .slice(0, 9);

  const userName =
    currentUser?.name ||
    currentUser?.username ||
    (isMs ? "Warga ADTEC" : "Campus Member");

  return (
    <div
      className="page-bg-common bg-dashboard"
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      {/* 1. BANNER SAPAAN & TINDAKAN PANTAS */}
      <div
        className="glass-panel"
        style={{
          padding: "1.35rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          borderLeft: "4px solid var(--primary)",
        }}
      >
        <div style={{ flex: "1 1 320px" }}>
          {isGuest && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                padding: "0.2rem 0.65rem",
                borderRadius: "999px",
                background: "rgba(99, 102, 241, 0.14)",
                color: "var(--primary)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                marginBottom: "0.45rem",
              }}
            >
              {t("guestModeBadge")}
            </span>
          )}
          <h1
            style={{
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--text-main)",
              marginBottom: "0.2rem",
            }}
          >
            {isGuest
              ? t("guestWelcomeTitle")
              : isMs
                ? `Selamat Kembali, ${userName} 👋`
                : `Welcome Back, ${userName} 👋`}
          </h1>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
            {isGuest ? t("guestWelcomeDesc") : t("welcomeBack")}
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
          <button
            className="btn-primary"
            onClick={() => {
              if (isGuest && requireAuth) {
                requireAuth("/add", t("loginRequiredToReport"), {
                  reason: "report",
                });
              } else {
                navigate("/add");
              }
            }}
            style={{
              padding: "0.6rem 1.1rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              borderRadius: "0.65rem",
            }}
          >
            <PlusCircle size={17} />
            <span>{isMs ? "Lapor Barang / Info" : "Report Item / Info"}</span>
            {isGuest && <Lock size={14} style={{ opacity: 0.85 }} />}
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/search")}
            style={{
              padding: "0.6rem 1.1rem",
              fontSize: "0.85rem",
              fontWeight: 600,
              borderRadius: "0.65rem",
              background: "var(--surface)",
              color: "var(--text-main)",
              border: "1px solid var(--border)",
            }}
          >
            <Search size={17} />
            <span>{t("searchItems")}</span>
          </button>
        </div>
      </div>

      {/* 2. KANDUNGAN UTAMA */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div>
            <div
              className="skeleton"
              style={{ width: "220px", height: "24px", marginBottom: "1rem" }}
            />
            <div className="grid-cards" style={{ gap: "1rem" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: "142px", width: "100%" }}
                />
              ))}
            </div>
          </div>
          <div>
            <div
              className="skeleton"
              style={{ width: "220px", height: "24px", marginBottom: "1rem" }}
            />
            <div className="grid-cards" style={{ gap: "1rem" }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: "142px", width: "100%" }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* SEKSYEN 1: MAKLUMAT & PENGUMUMAN KOLEJ */}
          <section
            id="section-info"
            className="glass-panel"
            style={{ padding: "1.25rem 1.35rem" }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
                marginBottom: "1rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--glass-border)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "0.6rem",
                    background: "rgba(59, 130, 246, 0.14)",
                    color: "#3B82F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Megaphone size={18} />
                </div>
                <h2
                  style={{
                    fontSize: "1.08rem",
                    fontWeight: 700,
                    color: "var(--text-main)",
                  }}
                >
                  {t("infoOnly")}
                </h2>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.55rem",
                    borderRadius: "999px",
                    background: "rgba(59, 130, 246, 0.14)",
                    color: "#3B82F6",
                  }}
                >
                  {infoItems.length}
                </span>
              </div>

              <button
                onClick={() => navigate("/search")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--primary)",
                  cursor: "pointer",
                }}
              >
                <span>{isMs ? "Lihat Semua" : "View All"}</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {infoItems.length > 0 ? (
              <div className="grid-cards" style={{ gap: "1rem" }}>
                {infoItems.map((item) => (
                  <ItemCardCompact
                    key={item.id}
                    item={item}
                    onContact={onContact}
                    currentUser={currentUser}
                    variant="modern"
                    onSelect={setSelectedItem}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: "2.25rem",
                  textAlign: "center",
                  background: "var(--surface)",
                  borderRadius: "0.85rem",
                  border: "1px dashed var(--border)",
                }}
              >
                <div
                  className="floating-icon"
                  style={{
                    fontSize: "2.25rem",
                    marginBottom: "0.5rem",
                    opacity: 0.6,
                  }}
                >
                  📭
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  {t("noInfoYet")}
                </p>
              </div>
            )}
          </section>

          {/* SEKSYEN 2: LAPORAN BARANG TERKINI */}
          <section
            id="section-reports"
            className="glass-panel"
            style={{ padding: "1.25rem 1.35rem" }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.85rem",
                marginBottom: "1rem",
                paddingBottom: "0.75rem",
                borderBottom: "1px solid var(--glass-border)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "0.6rem",
                    background: "rgba(99, 102, 241, 0.14)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PackageSearch size={18} />
                </div>
                <h2
                  style={{
                    fontSize: "1.08rem",
                    fontWeight: 700,
                    color: "var(--text-main)",
                  }}
                >
                  {t("recentlyReported")}
                </h2>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.55rem",
                    borderRadius: "999px",
                    background: "rgba(99, 102, 241, 0.14)",
                    color: "var(--primary)",
                  }}
                >
                  {filteredReportItems.length}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    background: "var(--surface)",
                    padding: "0.22rem",
                    borderRadius: "0.6rem",
                    border: "1px solid var(--border)",
                    gap: "0.2rem",
                  }}
                >
                  {[
                    { id: "all", label: t("all") },
                    { id: "lost", label: `🔴 ${t("badgeLost")}` },
                    { id: "found", label: `🟢 ${t("badgeFound")}` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setReportFilter(tab.id)}
                      style={{
                        padding: "0.3rem 0.75rem",
                        borderRadius: "0.45rem",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        background:
                          reportFilter === tab.id
                            ? "var(--primary)"
                            : "transparent",
                        color:
                          reportFilter === tab.id
                            ? "#FFFFFF"
                            : "var(--text-muted)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => navigate("/search")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--primary)",
                    cursor: "pointer",
                    marginLeft: "0.35rem",
                  }}
                >
                  <span>{isMs ? "Lihat Semua" : "View All"}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {filteredReportItems.length > 0 ? (
              <div className="grid-cards" style={{ gap: "1rem" }}>
                {filteredReportItems.map((item) => (
                  <ItemCardCompact
                    key={item.id}
                    item={item}
                    onContact={onContact}
                    currentUser={currentUser}
                    variant="modern"
                    onSelect={setSelectedItem}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: "2.25rem",
                  textAlign: "center",
                  background: "var(--surface)",
                  borderRadius: "0.85rem",
                  border: "1px dashed var(--border)",
                }}
              >
                <div
                  className="floating-icon"
                  style={{
                    fontSize: "2.25rem",
                    marginBottom: "0.5rem",
                    opacity: 0.6,
                  }}
                >
                  🔍
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  {t("noReportsYet")}
                </p>
              </div>
            )}
          </section>
        </>
      )}

      {/* 4. MODAL PRATONTON PENUH (QUICK VIEW MODAL) */}
      {selectedItem && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedItem(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 9999,
          }}
        >
          <div
            className="glass-panel modal-bounce"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "520px",
              overflow: "hidden",
              border: "1px solid var(--border)",
            }}
          >
            {selectedItem.image && (
              <div
                style={{
                  width: "100%",
                  maxHeight: "260px",
                  overflow: "hidden",
                  background: "#000",
                }}
              >
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  style={{
                    width: "100%",
                    maxHeight: "260px",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            <div style={{ padding: "1.35rem 1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div>
                  <span
                    className={`badge ${
                      selectedItem.type === "lost"
                        ? "badge-lost"
                        : selectedItem.type === "found"
                          ? "badge-found"
                          : "badge-info"
                    }`}
                    style={{ marginBottom: "0.4rem" }}
                  >
                    {selectedItem.type === "lost"
                      ? t("badgeLost")
                      : selectedItem.type === "found"
                        ? t("badgeFound")
                        : t("badgeInfo")}
                  </span>
                  <h3
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "var(--text-main)",
                    }}
                  >
                    {selectedItem.title && selectedItem.title.trim()
                      ? selectedItem.title
                      : `${t("defaultInfoTitle")} (${selectedItem.date || "-"})`}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  style={{
                    padding: "0.35rem",
                    borderRadius: "0.5rem",
                    background: "var(--surface)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                  marginBottom: "1rem",
                  paddingBottom: "0.75rem",
                  borderBottom: "1px solid var(--glass-border)",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <MapPin size={14} style={{ color: "var(--primary)" }} />
                  {selectedItem.location && selectedItem.location.trim()
                    ? selectedItem.location
                    : t("defaultLocation")}
                </span>
                {selectedItem.date && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                    }}
                  >
                    <Calendar size={14} />
                    {selectedItem.date}
                  </span>
                )}
              </div>

              <p
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                  color: "var(--text-main)",
                  marginBottom: "1.35rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {selectedItem.description || "-"}
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.65rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="btn-primary"
                  onClick={() => {
                    const title =
                      selectedItem.title && selectedItem.title.trim()
                        ? selectedItem.title
                        : `${t("defaultInfoTitle")} (${selectedItem.date || "-"})`;
                    const loc =
                      selectedItem.location && selectedItem.location.trim()
                        ? selectedItem.location
                        : t("defaultLocation");
                    const text = `*${title}*\n📍 ${loc}\n📅 ${selectedItem.date || "-"}\n\n${selectedItem.description || ""}\n\n${window.location.origin}`;
                    window.open(
                      `https://wa.me/?text=${encodeURIComponent(text)}`,
                      "_blank",
                    );
                  }}
                  style={{
                    background: "rgba(37, 211, 102, 0.12)",
                    color: "#25D366",
                    border: "1px solid rgba(37, 211, 102, 0.35)",
                  }}
                >
                  <Share2 size={16} />
                  <span>WhatsApp</span>
                </button>

                {selectedItem.type !== "info" &&
                  selectedItem.created_by &&
                  (!currentUser?.id ||
                    selectedItem.created_by !== currentUser.id) && (
                    <button
                      className="btn-primary"
                      onClick={() => {
                        const targetUser = selectedItem.created_by;
                        const targetTitle = selectedItem.title;
                        setSelectedItem(null);
                        if (onContact) onContact(targetUser, targetTitle);
                      }}
                    >
                      <MessageSquare size={16} />
                      <span>{t("contactReporter")}</span>
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
