import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  PackageCheck,
  Megaphone,
  PackageSearch,
  MapPin,
  Calendar,
  Maximize,
  Minimize,
  ArrowLeft,
  Languages,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Radio,
  Inbox,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { supabase } from "../supabaseClient";
import "./TvDisplayView.css";

// ==========================================================================
// TETAPAN MOD PAPARAN TV / KIOSK
// ==========================================================================
const ITEMS_PER_PAGE = 6; // Grid 3 x 2 (landskap) atau 2 x 3 (potret)
const PAGE_DURATION_MS = 15000; // Auto-putar halaman setiap 15 saat
const REFETCH_INTERVAL_MS = 2 * 60 * 1000; // Sandaran: muat semula data setiap 2 minit
const HARD_RELOAD_INTERVAL_MS = 6 * 60 * 60 * 1000; // Muat semula penuh setiap 6 jam
const CONTROLS_IDLE_MS = 3000; // Sembunyi kawalan & kursor selepas 3 saat
const MAX_ITEMS_PER_SECTION = 36;
const NEW_ITEM_WINDOW_MS = 3 * 24 * 60 * 60 * 1000; // Lencana "BARU" untuk 3 hari
const TICKER_MAX_ITEMS = 12;
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap";
const LOGO_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU1ioLqnxA_hYgapTKlsagISjhIZOyPzasjVVkJt5H8vxhKHKhsfmZlpAZ&s=10";

const TYPE_META = {
  lost: { color: "#F43F5E", icon: AlertCircle, ms: "Hilang", en: "Lost" },
  found: {
    color: "#10B981",
    icon: PackageCheck,
    ms: "Dijumpai",
    en: "Found",
  },
  info: { color: "#3B82F6", icon: Megaphone, ms: "Maklumat", en: "Info" },
};

const SECTION_META = {
  info: {
    color: "#3B82F6",
    icon: Megaphone,
    ms: "Pengumuman & Maklumat",
    en: "Announcements & Information",
  },
  reports: {
    color: "#F59E0B",
    icon: PackageSearch,
    ms: "Barang Hilang & Dijumpai",
    en: "Lost & Found Reports",
  },
};

function chunk(list, size) {
  const result = [];
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size));
  }
  return result;
}

// Agihan sama rata (cth. 7 item -> 4 + 3) supaya tiada halaman dengan 1 kad sahaja
function balancedChunk(list, maxSize) {
  if (!list.length) return [];
  const pageCount = Math.ceil(list.length / maxSize);
  return chunk(list, Math.ceil(list.length / pageCount));
}

function formatDate(value, locale) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isNewItem(item) {
  const created = new Date(item.created_at).getTime();
  return !Number.isNaN(created) && Date.now() - created < NEW_ITEM_WINDOW_MS;
}

// Tajuk lalai seperti "Information (2026-08-31)" tidak bermakna di TV,
// jadi gunakan penerangan sebagai tajuk utama jika ada.
function getCardText(item, isMs) {
  const title =
    item.title && item.title.trim()
      ? item.title.trim()
      : isMs
        ? "Maklumat Kolej"
        : "College Information";
  const description = item.description?.trim() || "";
  const isGenericTitle = /^(information|maklumat)\s*\(.*\)$/i.test(title);
  return {
    title,
    headline: isGenericTitle && description ? description : title,
    subText: isGenericTitle ? "" : description,
  };
}

const pad = (n) => String(n).padStart(2, "0");

// Jam diasingkan supaya grid kad tidak dirender semula setiap saat
function TvClock({ locale }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="tv-clock">
      <div className="tv-clock-time">
        <span>{pad(now.getHours())}</span>
        <span className="tv-clock-colon">:</span>
        <span>{pad(now.getMinutes())}</span>
        <span className="tv-clock-sec">{pad(now.getSeconds())}</span>
      </div>
      <div className="tv-clock-date">
        {now.toLocaleDateString(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>
    </div>
  );
}

function TvCard({ item, isMs, locale, index }) {
  const meta = TYPE_META[item.type] || TYPE_META.info;
  const Icon = meta.icon;
  const { title, headline, subText } = getCardText(item, isMs);
  const location =
    item.location && item.location.trim()
      ? item.location
      : isMs
        ? "Kampus ADTEC Melaka"
        : "ADTEC Melaka Campus";

  return (
    <article
      className="tv-card"
      style={{ "--accent": meta.color, "--i": index }}
    >
      <div className="tv-card-media">
        {item.image ? (
          <>
            <img
              className="tv-card-media-bg"
              src={item.image}
              alt=""
              aria-hidden="true"
            />
            <img className="tv-card-media-img" src={item.image} alt={title} />
          </>
        ) : (
          <div className="tv-card-placeholder">
            <span className="tv-card-placeholder-icon">
              <Icon />
            </span>
          </div>
        )}

        <span className="tv-badge">
          <span className="tv-badge-icon">
            <Icon />
          </span>
          {isMs ? meta.ms : meta.en}
        </span>

        {isNewItem(item) && (
          <span className="tv-new">
            <Sparkles />
            {isMs ? "Baru" : "New"}
          </span>
        )}
      </div>

      <div className="tv-card-body">
        <h3 className={`tv-card-title ${subText ? "has-desc" : ""}`}>
          {headline}
        </h3>
        {subText && <p className="tv-card-desc">{subText}</p>}
        <div className="tv-card-meta">
          <span className="tv-chip tv-chip--grow">
            <MapPin />
            <span className="tv-ellipsis">{location}</span>
          </span>
          <span className="tv-chip">
            <Calendar />
            {formatDate(item.date || item.created_at, locale)}
          </span>
        </div>
      </div>
    </article>
  );
}

export function TvDisplayView() {
  const { lang, setLang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const isMs = lang === "ms";
  const locale = isMs ? "ms-MY" : "en-GB";

  const [infoItems, setInfoItems] = useState([]);
  const [reportItems, setReportItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(
    () => !!document.fullscreenElement,
  );

  // Fon khas paparan TV (dimuatkan sekali sahaja)
  useEffect(() => {
    if (document.getElementById("tv-display-font")) return;
    const link = document.createElement("link");
    link.id = "tv-display-font";
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);

  // Sokong pautan seperti /tv?lang=ms untuk tetapan bahasa TV secara terus
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("lang");
    if (param === "ms" || param === "en") setLang(param);
  }, [setLang]);

  const fetchItems = useCallback(async () => {
    try {
      const [infoRes, reportRes] = await Promise.all([
        supabase
          .from("items")
          .select("*")
          .neq("status", "deleted")
          .neq("status", "resolved")
          .eq("type", "info")
          .order("created_at", { ascending: false })
          .limit(MAX_ITEMS_PER_SECTION),
        supabase
          .from("items")
          .select("*")
          .neq("status", "deleted")
          .neq("status", "resolved")
          .neq("type", "info")
          .order("created_at", { ascending: false })
          .limit(MAX_ITEMS_PER_SECTION),
      ]);

      if (infoRes.error) throw infoRes.error;
      if (reportRes.error) throw reportRes.error;

      setInfoItems(infoRes.data || []);
      setReportItems(reportRes.data || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("TV display fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Data masa nyata + muat semula berkala sebagai sandaran
  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel("tv_display_items_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => fetchItems(),
      )
      .subscribe();

    const refetchId = setInterval(fetchItems, REFETCH_INTERVAL_MS);
    const reloadId = setTimeout(
      () => window.location.reload(),
      HARD_RELOAD_INTERVAL_MS,
    );

    return () => {
      supabase.removeChannel(channel);
      clearInterval(refetchId);
      clearTimeout(reloadId);
    };
  }, [fetchItems]);

  const pages = useMemo(() => {
    const result = [];
    const infoPages = balancedChunk(infoItems, ITEMS_PER_PAGE);
    const reportPages = balancedChunk(reportItems, ITEMS_PER_PAGE);
    infoPages.forEach((items, i) =>
      result.push({
        section: "info",
        items,
        sectionPage: i + 1,
        sectionTotal: infoPages.length,
      }),
    );
    reportPages.forEach((items, i) =>
      result.push({
        section: "reports",
        items,
        sectionPage: i + 1,
        sectionTotal: reportPages.length,
      }),
    );
    return result;
  }, [infoItems, reportItems]);

  const stats = useMemo(
    () => ({
      info: infoItems.length,
      lost: reportItems.filter((item) => item.type === "lost").length,
      found: reportItems.filter((item) => item.type === "found").length,
    }),
    [infoItems, reportItems],
  );

  // Berita terkini untuk ticker di footer (gabungan semua item, terbaru dahulu)
  const tickerItems = useMemo(
    () =>
      [...infoItems, ...reportItems]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, TICKER_MAX_ITEMS),
    [infoItems, reportItems],
  );

  const totalPages = pages.length;
  const safeIndex = totalPages ? pageIndex % totalPages : 0;
  const currentPage = pages[safeIndex];
  const activeSection = currentPage?.section || "info";

  const goToPage = useCallback(
    (step) => {
      if (!totalPages) return;
      setPageIndex((prev) => (prev + step + totalPages) % totalPages);
    },
    [totalPages],
  );

  const goToSection = useCallback(
    (key) => {
      const index = pages.findIndex((page) => page.section === key);
      if (index >= 0) setPageIndex(index);
    },
    [pages],
  );

  // Auto-putar halaman (dimulakan semula setiap kali halaman bertukar)
  useEffect(() => {
    if (totalPages <= 1) return undefined;
    const id = setTimeout(() => goToPage(1), PAGE_DURATION_MS);
    return () => clearTimeout(id);
  }, [safeIndex, totalPages, goToPage]);

  // Sembunyi kawalan & kursor apabila tiada aktiviti
  useEffect(() => {
    let timer = setTimeout(() => setShowControls(false), CONTROLS_IDLE_MS);
    const wake = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), CONTROLS_IDLE_MS);
    };
    window.addEventListener("mousemove", wake);
    window.addEventListener("keydown", wake);
    window.addEventListener("touchstart", wake);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch (error) {
      console.error("Fullscreen error:", error.message);
    }
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Kawalan alat kawalan jauh / papan kekunci: ← → tukar halaman, F skrin penuh
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowRight") goToPage(1);
      else if (event.key === "ArrowLeft") goToPage(-1);
      else if (event.key === "f" || event.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToPage, toggleFullscreen]);

  // Elak skrin TV/monitor tidur (jika pelayar menyokong Wake Lock API)
  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator && document.visibilityState === "visible") {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Diabaikan: pelayar tidak menyokong atau permintaan ditolak
      }
    };
    requestWakeLock();
    const onVisibility = () => {
      if (document.visibilityState === "visible") requestWakeLock();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      wakeLock?.release?.().catch(() => {});
    };
  }, []);

  const sectionColor = SECTION_META[activeSection].color;
  const reportUrl = `${window.location.host}/home`;
  const tickerDuration = Math.max(
    30,
    tickerItems.reduce(
      (sum, item) => sum + getCardText(item, isMs).headline.length,
      0,
    ) * 0.16,
  );

  const statTiles = [
    { key: "info", value: stats.info, ...TYPE_META.info },
    { key: "lost", value: stats.lost, ...TYPE_META.lost },
    { key: "found", value: stats.found, ...TYPE_META.found },
  ];

  return (
    <div
      className={`tv-root ${showControls ? "" : "tv-hide-cursor"}`}
      style={{ "--tv-section": sectionColor }}
    >
      {/* LATAR BELAKANG BERANIMASI */}
      <div className="tv-bg" aria-hidden="true">
        <div className="tv-bg-blob tv-bg-blob--a" />
        <div className="tv-bg-blob tv-bg-blob--b" />
        <div className="tv-bg-blob tv-bg-blob--c" />
        <div className="tv-bg-grid" />
      </div>

      {/* KAWALAN TERAPUNG (auto-sembunyi) */}
      <div className={`tv-controls ${showControls ? "" : "is-hidden"}`}>
        <button
          type="button"
          className="tv-control-btn"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft size={16} />
          Dashboard
        </button>
        <span className="tv-control-sep" />
        <button
          type="button"
          className="tv-control-btn tv-control-btn--icon"
          onClick={() => goToPage(-1)}
          disabled={totalPages <= 1}
          aria-label={isMs ? "Halaman sebelum" : "Previous page"}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="tv-control-btn tv-control-btn--icon"
          onClick={() => goToPage(1)}
          disabled={totalPages <= 1}
          aria-label={isMs ? "Halaman seterusnya" : "Next page"}
        >
          <ChevronRight size={18} />
        </button>
        <span className="tv-control-sep" />
        <button
          type="button"
          className="tv-control-btn"
          onClick={() => setLang(isMs ? "en" : "ms")}
        >
          <Languages size={16} />
          {isMs ? "EN" : "MS"}
        </button>
        <button
          type="button"
          className="tv-control-btn tv-control-btn--primary"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          {isFullscreen
            ? isMs
              ? "Keluar Skrin Penuh"
              : "Exit Fullscreen"
            : isMs
              ? "Skrin Penuh"
              : "Fullscreen"}
        </button>
      </div>

      {/* 1. HEADER: LOGO, STATISTIK & JAM */}
      <header className="tv-header">
        <div className="tv-brand">
          <img
            className="tv-brand-logo"
            src={LOGO_URL}
            alt="Logo ADTEC Melaka"
          />
          <div className="tv-brand-text">
            <div className="tv-brand-title">
              {isMs
                ? "Papan Maklumat ADTEC Melaka"
                : "ADTEC Melaka Information Board"}
            </div>
            <div className="tv-brand-subtitle">
              <span>{isMs ? "Pengumuman Kolej" : "College Announcements"}</span>
              <span className="tv-brand-dot" />
              <span>{isMs ? "Barang Hilang & Dijumpai" : "Lost & Found"}</span>
            </div>
          </div>
        </div>

        <div className="tv-stats">
          {statTiles.map(({ key, value, color, icon: StatIcon, ms, en }) => (
            <div key={key} className="tv-stat" style={{ "--accent": color }}>
              <span className="tv-stat-icon">
                <StatIcon />
              </span>
              <div>
                <div className="tv-stat-value">{loading ? "–" : value}</div>
                <div className="tv-stat-label">{isMs ? ms : en}</div>
              </div>
            </div>
          ))}
        </div>

        <TvClock locale={locale} />
      </header>

      {/* 2. TAB SEKSYEN & PENUNJUK HALAMAN */}
      <div className="tv-section-bar">
        <div className="tv-tabs">
          {Object.entries(SECTION_META).map(([key, meta]) => {
            const TabIcon = meta.icon;
            const count = key === "info" ? infoItems.length : reportItems.length;
            return (
              <button
                key={key}
                type="button"
                className={`tv-tab ${activeSection === key ? "is-active" : ""}`}
                style={{ "--accent": meta.color }}
                onClick={() => goToSection(key)}
                disabled={!loading && count === 0}
              >
                <span className="tv-tab-icon">
                  <TabIcon />
                </span>
                {isMs ? meta.ms : meta.en}
              </button>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="tv-pager">
            <div className="tv-segs">
              {pages.map((page, i) => (
                <span
                  key={`${page.section}-${page.sectionPage}`}
                  className={`tv-seg ${
                    i < safeIndex ? "is-done" : i === safeIndex ? "is-active" : ""
                  }`}
                  style={{ "--accent": SECTION_META[page.section].color }}
                >
                  <span
                    key={i === safeIndex ? `active-${safeIndex}` : "idle"}
                    className="tv-seg-fill"
                    style={
                      i === safeIndex
                        ? { animationDuration: `${PAGE_DURATION_MS}ms` }
                        : undefined
                    }
                  />
                </span>
              ))}
            </div>
            <span className="tv-page-num">
              <strong>{pad(safeIndex + 1)}</strong>
              <span>/ {pad(totalPages)}</span>
            </span>
          </div>
        )}
      </div>

      {/* 3. KANDUNGAN UTAMA: GRID KAD BESAR */}
      {loading ? (
        <div className="tv-grid">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <div key={i} className="tv-card tv-card--skeleton" />
          ))}
        </div>
      ) : currentPage ? (
        <div
          key={`page-${safeIndex}`}
          className={`tv-grid tv-grid--n${currentPage.items.length}`}
        >
          {currentPage.items.map((item, i) => (
            <TvCard
              key={item.id}
              item={item}
              isMs={isMs}
              locale={locale}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="tv-empty">
          <div>
            <div className="tv-empty-icon">
              <Inbox />
            </div>
            <div className="tv-empty-title">
              {isMs
                ? "Tiada maklumat atau laporan buat masa ini"
                : "No announcements or reports at the moment"}
            </div>
            <div className="tv-empty-text">
              {isMs
                ? "Paparan ini akan dikemas kini secara automatik."
                : "This display updates automatically."}
            </div>
          </div>
        </div>
      )}

      {/* 4. FOOTER: QR, BERITA TERKINI & STATUS LANGSUNG */}
      <footer className="tv-footer">
        <div className="tv-qr">
          <img src="/qr-code.svg" alt="Kod QR Portal" />
          <div className="tv-qr-text">
            <div className="tv-qr-title">
              {isMs ? "Jumpa atau hilang barang?" : "Lost or found something?"}
            </div>
            <div className="tv-qr-sub">
              {isMs ? "Imbas QR atau layari " : "Scan the QR or visit "}
              <strong>{reportUrl}</strong>
            </div>
          </div>
        </div>

        {tickerItems.length > 0 ? (
          <div className="tv-ticker">
            <span className="tv-ticker-label">
              <Radio />
              {isMs ? "Terkini" : "Latest"}
            </span>
            <div className="tv-ticker-viewport">
              <div
                key={`${lang}-${tickerItems.map((item) => item.id).join("-")}`}
                className="tv-ticker-track"
                style={{ animationDuration: `${tickerDuration}s` }}
              >
                {[0, 1].map((copy) =>
                  tickerItems.map((item) => {
                    const meta = TYPE_META[item.type] || TYPE_META.info;
                    return (
                      <span
                        key={`${copy}-${item.id}`}
                        className="tv-ticker-item"
                        style={{ "--accent": meta.color }}
                        aria-hidden={copy === 1 ? "true" : undefined}
                      >
                        <span className="tv-ticker-tag">
                          {isMs ? meta.ms : meta.en}
                        </span>
                        {getCardText(item, isMs).headline}
                      </span>
                    );
                  }),
                )}
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className="tv-live">
          <span className="tv-live-pill">
            <span className="tv-live-dot" />
            {isMs ? "LANGSUNG" : "LIVE"}
          </span>
          {lastUpdated && (
            <span className="tv-updated">
              {isMs ? "Dikemas kini" : "Updated"}{" "}
              {lastUpdated.toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          )}
        </div>
      </footer>
    </div>
  );
}
