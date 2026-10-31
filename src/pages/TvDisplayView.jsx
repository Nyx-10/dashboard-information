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
const LOGO_URL =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU1ioLqnxA_hYgapTKlsagISjhIZOyPzasjVVkJt5H8vxhKHKhsfmZlpAZ&s=10";

const TYPE_META = {
  lost: { color: "#EF4444", icon: AlertCircle, ms: "Hilang", en: "Lost" },
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
    ms: "Laporan Barang Hilang & Dijumpai",
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
        {now.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
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

function TvCard({ item, isMs, locale }) {
  const meta = TYPE_META[item.type] || TYPE_META.info;
  const Icon = meta.icon;
  const title =
    item.title && item.title.trim()
      ? item.title
      : isMs
        ? "Maklumat Kolej"
        : "College Information";
  const location =
    item.location && item.location.trim()
      ? item.location
      : isMs
        ? "Kampus ADTEC Melaka"
        : "ADTEC Melaka Campus";
  const description = item.description?.trim() || "";

  // Tajuk lalai seperti "Information (2026-08-31)" tidak bermakna di TV,
  // jadi gunakan penerangan sebagai tajuk utama jika ada.
  const isGenericTitle = /^(information|maklumat)\s*\(.*\)$/i.test(
    title.trim(),
  );
  const headline = isGenericTitle && description ? description : title;
  const subText = isGenericTitle ? "" : description;

  return (
    <article className="tv-card" style={{ "--accent": meta.color }}>
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
            <Icon />
          </div>
        )}
        <span className="tv-badge">
          <Icon />
          {isMs ? meta.ms : meta.en}
        </span>
      </div>

      <div className="tv-card-body">
        <h3 className={`tv-card-title ${subText ? "has-desc" : ""}`}>
          {headline}
        </h3>
        {subText && <p className="tv-card-desc">{subText}</p>}
        <div className="tv-card-meta">
          <span>
            <MapPin />
            <span className="tv-ellipsis">{location}</span>
          </span>
          <span>
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

  const totalPages = pages.length;
  const safeIndex = totalPages ? pageIndex % totalPages : 0;
  const currentPage = pages[safeIndex];

  const goToPage = useCallback(
    (step) => {
      if (!totalPages) return;
      setPageIndex((prev) => (prev + step + totalPages) % totalPages);
    },
    [totalPages],
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

  const section = SECTION_META[currentPage?.section || "info"];
  const SectionIcon = section.icon;
  const sectionCount =
    currentPage?.section === "reports" ? reportItems.length : infoItems.length;
  const reportUrl = `${window.location.host}/home`;

  return (
    <div className={`tv-root ${showControls ? "" : "tv-hide-cursor"}`}>
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
        <button
          type="button"
          className="tv-control-btn"
          onClick={() => goToPage(-1)}
          disabled={totalPages <= 1}
          aria-label={isMs ? "Halaman sebelum" : "Previous page"}
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          className="tv-control-btn"
          onClick={() => goToPage(1)}
          disabled={totalPages <= 1}
          aria-label={isMs ? "Halaman seterusnya" : "Next page"}
        >
          <ChevronRight size={16} />
        </button>
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

      {/* 1. HEADER: LOGO, TAJUK & JAM */}
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
              {isMs
                ? "Pengumuman Kolej • Barang Hilang & Dijumpai"
                : "College Announcements • Lost & Found"}
            </div>
          </div>
        </div>
        <TvClock locale={locale} />
      </header>

      {/* 2. BAR SEKSYEN & PENUNJUK HALAMAN */}
      <div className="tv-section-bar" style={{ "--accent": section.color }}>
        <div className="tv-section-row">
          <div className="tv-section-title">
            <span className="tv-section-icon">
              <SectionIcon />
            </span>
            <span>{isMs ? section.ms : section.en}</span>
            {!loading && totalPages > 0 && (
              <span className="tv-section-count">{sectionCount}</span>
            )}
          </div>

          {totalPages > 1 && (
            <div className="tv-pager">
              <div className="tv-dots">
                {pages.map((page, i) => (
                  <span
                    key={`${page.section}-${page.sectionPage}`}
                    className={`tv-dot ${i === safeIndex ? "is-active" : ""}`}
                  />
                ))}
              </div>
              <span>
                {isMs ? "Halaman" : "Page"} {safeIndex + 1} / {totalPages}
              </span>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="tv-progress">
            <div
              key={`${safeIndex}-${totalPages}`}
              className="tv-progress-fill"
              style={{ animationDuration: `${PAGE_DURATION_MS}ms` }}
            />
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
          {currentPage.items.map((item) => (
            <TvCard key={item.id} item={item} isMs={isMs} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="tv-empty">
          <div>
            <div className="tv-empty-icon">📭</div>
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

      {/* 4. FOOTER: PAUTAN LAPORAN & STATUS LANGSUNG */}
      <footer className="tv-footer">
        <div className="tv-ellipsis">
          {isMs
            ? "Jumpa atau hilang barang? Laporkan di "
            : "Lost or found something? Report it at "}
          <strong>{reportUrl}</strong>
        </div>
        <div className="tv-live">
          <span className="tv-live-dot" />
          {isMs ? "LANGSUNG" : "LIVE"}
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
