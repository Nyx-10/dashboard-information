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
  LayoutGrid,
  Columns3,
  Clock,
  CheckCircle2,
  ShieldCheck,
  QrCode,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { supabase } from "../supabaseClient";
import "./TvDisplayView.css";

// ==========================================================================
// TETAPAN MOD PAPARAN TV / KIOSK EKSEKUTIF (ADTEC MELAKA)
// ==========================================================================
const ITEMS_PER_GRID_PAGE = 6; // Untuk mod grid alternatif
const QUEUE_VISIBLE_COUNT = 5; // Bilangan item senarai kelihatan serentak di panel kanan
const SPOTLIGHT_DURATION_MS = 12000; // Auto-bertukar item sorotan setiap 12 saat
const GRID_DURATION_MS = 15000; // Auto-putar halaman grid setiap 15 saat
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
  lost: {
    color: "#F43F5E",
    icon: AlertCircle,
    ms: "Hilang",
    en: "Lost",
    badgeMs: "Laporan Barang Hilang",
    badgeEn: "Lost Item Report",
  },
  found: {
    color: "#10B981",
    icon: PackageCheck,
    ms: "Dijumpai",
    en: "Found",
    badgeMs: "Barang Dijumpai",
    badgeEn: "Found Item Report",
  },
  info: {
    color: "#3B82F6",
    icon: Megaphone,
    ms: "Maklumat",
    en: "Info",
    badgeMs: "Hebahan Rasmi Kolej",
    badgeEn: "Official Announcement",
  },
};

const SECTION_META = {
  info: {
    color: "#2563EB",
    gold: "#F59E0B",
    icon: Megaphone,
    ms: "Pengumuman & Maklumat",
    en: "Announcements & Information",
  },
  reports: {
    color: "#D97706",
    gold: "#F59E0B",
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

function formatFullDate(value, locale) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatLocation(rawLocation, isMs) {
  const clean = rawLocation?.trim();
  if (!clean || /^general$/i.test(clean)) {
    return isMs ? "Kampus ADTEC Melaka" : "ADTEC Melaka Campus";
  }
  return clean;
}

function isNewItem(item) {
  const created = new Date(item.created_at).getTime();
  return !Number.isNaN(created) && Date.now() - created < NEW_ITEM_WINDOW_MS;
}

// Pisahkan tajuk utama & kandungan penerangan dengan pintar supaya
// pengumuman bertajuk generik "Information (YYYY-MM-DD)" tampil kemas.
function getCardText(item, isMs) {
  const rawTitle =
    item.title && item.title.trim()
      ? item.title.trim()
      : isMs
        ? "Maklumat Kolej"
        : "College Information";
  const description = item.description?.trim() || "";
  const isGenericTitle = /^(information|maklumat)\s*\(.*\)$/i.test(rawTitle);

  if (!isGenericTitle || !description) {
    return {
      title: rawTitle,
      headline: rawTitle,
      subText: description,
    };
  }

  // 1. Jika ada perenggan / baris baharu, baris pertama ialah tajuk utama
  const lines = description
    .split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length > 1) {
    return {
      title: lines[0],
      headline: lines[0],
      subText: lines.slice(1).join("\n\n"),
    };
  }

  const single = lines[0] || description;

  // 2. Jika satu perenggan panjang mempunyai ayat berasingan (". ")
  const dotIdx = single.indexOf(". ");
  if (dotIdx >= 24 && dotIdx <= 140) {
    return {
      title: single.slice(0, dotIdx).trim(),
      headline: single.slice(0, dotIdx).trim(),
      subText: single.slice(dotIdx + 2).trim(),
    };
  }

  // 3. Jika satu ayat sangat panjang (> 110 aksara), potong pada sempadan kata
  if (single.length > 110) {
    const cut = single.lastIndexOf(" ", 95);
    const splitAt = cut > 45 ? cut : 95;
    return {
      title: single.slice(0, splitAt).trim(),
      headline: single.slice(0, splitAt).trim(),
      subText: single.slice(splitAt).trim(),
    };
  }

  return {
    title: single,
    headline: single,
    subText: "",
  };
}

function getGreeting(hour, isMs) {
  if (hour < 12) return isMs ? "Selamat Pagi" : "Good Morning";
  if (hour < 15) return isMs ? "Selamat Tengah Hari" : "Good Afternoon";
  if (hour < 19) return isMs ? "Selamat Petang" : "Good Evening";
  return isMs ? "Selamat Malam" : "Good Evening";
}

const pad = (n) => String(n).padStart(2, "0");

// Jam diasingkan supaya kandungan utama tidak dirender semula setiap saat
function TvClock({ locale, isMs }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const greeting = getGreeting(now.getHours(), isMs);

  return (
    <div className="tv-clock">
      <div className="tv-clock-top">
        <span className="tv-clock-greeting">{greeting}</span>
        <div className="tv-clock-time">
          <span>{pad(now.getHours())}</span>
          <span className="tv-clock-colon">:</span>
          <span>{pad(now.getMinutes())}</span>
          <span className="tv-clock-sec">{pad(now.getSeconds())}</span>
        </div>
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

// ==========================================================================
// KOMPONEN SOROTAN UTAMA (PANEL KIRI)
// ==========================================================================
function TvSpotlight({
  item,
  isMs,
  locale,
  indexInSection,
  sectionTotal,
  durationMs,
  animKey,
}) {
  const meta = TYPE_META[item.type] || TYPE_META.info;
  const Icon = meta.icon;
  const { title, headline, subText } = getCardText(item, isMs);
  const location = formatLocation(item.location, isMs);

  return (
    <article
      key={animKey}
      className="tv-spotlight"
      style={{ "--accent": meta.color }}
    >
      {/* Bahagian Poster / Gambar Besar */}
      <div className="tv-spotlight-media">
        {item.image ? (
          <>
            <img
              className="tv-spotlight-media-bg"
              src={item.image}
              alt=""
              aria-hidden="true"
            />
            <img
              className="tv-spotlight-media-img"
              src={item.image}
              alt={title}
            />
          </>
        ) : (
          <div className="tv-spotlight-placeholder">
            <span className="tv-spotlight-placeholder-ring">
              <Icon />
            </span>
          </div>
        )}

        <div className="tv-spotlight-overlays">
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

        <div className="tv-spotlight-counter">
          <span className="tv-spotlight-counter-dot" />
          {isMs ? "Sorotan" : "Spotlight"} {pad(indexInSection)} /{" "}
          {pad(sectionTotal)}
        </div>
      </div>

      {/* Bahagian Butiran Lengkap di Sebelah Kanan Poster */}
      <div className="tv-spotlight-details">
        <div className="tv-spotlight-eyebrow">
          <span className="tv-spotlight-kicker">
            <ShieldCheck />
            {isMs ? meta.badgeMs : meta.badgeEn}
          </span>
        </div>

        <h2 className="tv-spotlight-title">{headline}</h2>

        {subText ? (
          <p className="tv-spotlight-desc">{subText}</p>
        ) : (
          <p className="tv-spotlight-desc tv-spotlight-desc--subtle">
            {isMs
              ? "Hebahan dan maklumat rasmi untuk perhatian warga kampus ADTEC Melaka. Sila rujuk poster atau imbas kod QR di bawah untuk maklumat lanjut."
              : "Official announcement and information for the attention of the ADTEC Melaka campus community. Please refer to the poster or scan the QR code below for details."}
          </p>
        )}

        <div className="tv-spotlight-meta-grid">
          <div className="tv-meta-box">
            <span className="tv-meta-box-icon">
              <MapPin />
            </span>
            <div className="tv-meta-box-text">
              <span className="tv-meta-box-label">
                {isMs ? "Lokasi / Tempat" : "Location"}
              </span>
              <span className="tv-meta-box-value tv-ellipsis">{location}</span>
            </div>
          </div>

          <div className="tv-meta-box">
            <span className="tv-meta-box-icon">
              <Calendar />
            </span>
            <div className="tv-meta-box-text">
              <span className="tv-meta-box-label">
                {isMs ? "Tarikh Rekod" : "Recorded Date"}
              </span>
              <span className="tv-meta-box-value">
                {formatFullDate(item.date || item.created_at, locale)}
              </span>
            </div>
          </div>

          <div className="tv-meta-box">
            <span className="tv-meta-box-icon">
              <CheckCircle2 />
            </span>
            <div className="tv-meta-box-text">
              <span className="tv-meta-box-label">
                {isMs ? "Status Semasa" : "Current Status"}
              </span>
              <span className="tv-meta-box-value tv-meta-box-value--active">
                {isMs ? "Aktif Dipaparkan" : "Actively Displayed"}
              </span>
            </div>
          </div>
        </div>

        <div className="tv-spotlight-progress-wrap">
          <div className="tv-spotlight-progress-head">
            <span>
              <Clock />
              {isMs
                ? "Bertukar automatik ke giliran seterusnya"
                : "Auto-advancing to next item in queue"}
            </span>
            <strong>
              {pad(indexInSection)} / {pad(sectionTotal)}
            </strong>
          </div>
          <div className="tv-spotlight-progress">
            <div
              key={animKey}
              className="tv-spotlight-progress-fill"
              style={{ animationDuration: `${durationMs}ms` }}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

// ==========================================================================
// KOMPONEN ITEM SENARAI GILIRAN (PANEL KANAN)
// ==========================================================================
function TvQueueCard({ item, number, isActive, isMs, locale, onSelect }) {
  const meta = TYPE_META[item.type] || TYPE_META.info;
  const Icon = meta.icon;
  const { title, headline } = getCardText(item, isMs);
  const location = formatLocation(item.location, isMs);

  return (
    <button
      type="button"
      className={`tv-queue-card ${isActive ? "is-active" : ""}`}
      style={{ "--accent": meta.color }}
      onClick={onSelect}
    >
      <div className="tv-queue-num">{pad(number)}</div>

      <div className="tv-queue-thumb">
        {item.image ? (
          <img src={item.image} alt={title} />
        ) : (
          <span className="tv-queue-thumb-icon">
            <Icon />
          </span>
        )}
      </div>

      <div className="tv-queue-body">
        <div className="tv-queue-top">
          <span className="tv-queue-tag">{isMs ? meta.ms : meta.en}</span>
          {isActive && (
            <span className="tv-queue-now">
              <span className="tv-queue-now-dot" />
              {isMs ? "Dipaparkan" : "Showing"}
            </span>
          )}
          {!isActive && isNewItem(item) && (
            <span className="tv-queue-new">{isMs ? "Baru" : "New"}</span>
          )}
        </div>

        <div className="tv-queue-title">{headline}</div>

        <div className="tv-queue-meta">
          <span className="tv-ellipsis">
            <MapPin />
            {location}
          </span>
          <span>
            <Calendar />
            {formatDate(item.date || item.created_at, locale)}
          </span>
        </div>
      </div>
    </button>
  );
}

// ==========================================================================
// KOMPONEN KAD GRID (UNTUK MOD GRID ALTERNATIF)
// ==========================================================================
function TvCard({ item, isMs, locale, index }) {
  const meta = TYPE_META[item.type] || TYPE_META.info;
  const Icon = meta.icon;
  const { title, headline, subText } = getCardText(item, isMs);
  const location = formatLocation(item.location, isMs);

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

// ==========================================================================
// KOMPONEN UTAMA PAPARAN TV
// ==========================================================================
export function TvDisplayView() {
  const { lang, setLang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const isMs = lang === "ms";
  const locale = isMs ? "ms-MY" : "en-GB";

  const [infoItems, setInfoItems] = useState([]);
  const [reportItems, setReportItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [viewMode, setViewMode] = useState("spotlight"); // "spotlight" | "grid"
  const [initialSection] = useState(() => {
    const sec = new URLSearchParams(window.location.search).get("section");
    return sec === "reports" || sec === "info" ? sec : null;
  });
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [gridPageIndex, setGridPageIndex] = useState(0);
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

  // Sokong pautan seperti /tv?lang=ms&mode=grid
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get("lang");
    const modeParam = params.get("mode");
    if (langParam === "ms" || langParam === "en") setLang(langParam);
    if (modeParam === "grid" || modeParam === "spotlight") {
      setViewMode(modeParam);
    }
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

      const infoData = infoRes.data || [];
      const reportData = reportRes.data || [];
      setInfoItems(infoData);
      setReportItems(reportData);
      if (initialSection === "reports" && infoData.length > 0) {
        setSpotlightIndex((prev) => (prev === 0 ? infoData.length : prev));
      }
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

  // Senarai urutan penuh untuk Mod Sorotan (Pengumuman diikuti Laporan)
  const playlist = useMemo(() => {
    const list = [];
    infoItems.forEach((item, idx) =>
      list.push({
        section: "info",
        item,
        indexInSection: idx + 1,
        sectionTotal: infoItems.length,
        sectionItems: infoItems,
      }),
    );
    reportItems.forEach((item, idx) =>
      list.push({
        section: "reports",
        item,
        indexInSection: idx + 1,
        sectionTotal: reportItems.length,
        sectionItems: reportItems,
      }),
    );
    return list;
  }, [infoItems, reportItems]);

  // Halaman untuk Mod Grid
  const gridPages = useMemo(() => {
    const result = [];
    const infoPages = balancedChunk(infoItems, ITEMS_PER_GRID_PAGE);
    const reportPages = balancedChunk(reportItems, ITEMS_PER_GRID_PAGE);
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

  const totalSteps =
    viewMode === "spotlight" ? playlist.length : gridPages.length;
  const safeSpotlightIdx = playlist.length
    ? spotlightIndex % playlist.length
    : 0;
  const safeGridIdx = gridPages.length ? gridPageIndex % gridPages.length : 0;

  const currentSpotlight = playlist[safeSpotlightIdx];
  const currentGridPage = gridPages[safeGridIdx];

  const activeSection =
    viewMode === "spotlight"
      ? currentSpotlight?.section || "info"
      : currentGridPage?.section || "info";

  const stepForward = useCallback(
    (delta) => {
      if (viewMode === "spotlight") {
        if (!playlist.length) return;
        setSpotlightIndex(
          (prev) => (prev + delta + playlist.length) % playlist.length,
        );
      } else {
        if (!gridPages.length) return;
        setGridPageIndex(
          (prev) => (prev + delta + gridPages.length) % gridPages.length,
        );
      }
    },
    [viewMode, playlist.length, gridPages.length],
  );

  const goToSection = useCallback(
    (key) => {
      if (viewMode === "spotlight") {
        const idx = playlist.findIndex((entry) => entry.section === key);
        if (idx >= 0) setSpotlightIndex(idx);
      } else {
        const idx = gridPages.findIndex((page) => page.section === key);
        if (idx >= 0) setGridPageIndex(idx);
      }
    },
    [viewMode, playlist, gridPages],
  );

  const selectSectionItem = useCallback(
    (sectionKey, itemId) => {
      const idx = playlist.findIndex(
        (entry) => entry.section === sectionKey && entry.item.id === itemId,
      );
      if (idx >= 0) setSpotlightIndex(idx);
    },
    [playlist],
  );

  // Auto-putar mengikut mod paparan
  useEffect(() => {
    if (totalSteps <= 1) return undefined;
    const duration =
      viewMode === "spotlight" ? SPOTLIGHT_DURATION_MS : GRID_DURATION_MS;
    const id = setTimeout(() => stepForward(1), duration);
    return () => clearTimeout(id);
  }, [viewMode, safeSpotlightIdx, safeGridIdx, totalSteps, stepForward]);

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

  // Kawalan alat kawalan jauh / papan kekunci
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "ArrowRight") stepForward(1);
      else if (event.key === "ArrowLeft") stepForward(-1);
      else if (event.key === "f" || event.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepForward, toggleFullscreen]);

  // Elak skrin TV/monitor tidur (Wake Lock API)
  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator && document.visibilityState === "visible") {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Diabaikan jika pelayar tidak menyokong
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

  // Tetingkap senarai giliran di panel kanan (maksimum 5 item kelihatan, fokus sekitar item aktif)
  const queueWindow = useMemo(() => {
    if (!currentSpotlight) {
      return { items: [], startNumber: 1, page: 1, pages: 1 };
    }
    const list = currentSpotlight.sectionItems;
    const total = list.length;
    const pageCount = Math.max(1, Math.ceil(total / QUEUE_VISIBLE_COUNT));
    const currentPageIdx = Math.floor(
      (currentSpotlight.indexInSection - 1) / QUEUE_VISIBLE_COUNT,
    );
    const start = currentPageIdx * QUEUE_VISIBLE_COUNT;
    return {
      items: list.slice(start, start + QUEUE_VISIBLE_COUNT),
      startNumber: start + 1,
      page: currentPageIdx + 1,
      pages: pageCount,
    };
  }, [currentSpotlight]);

  // Pratonton seksyen sebelah jika seksyen semasa mempunyai sedikit item (< 3)
  const otherSectionPreview = useMemo(() => {
    if (!currentSpotlight) return null;
    const isInfo = currentSpotlight.section === "info";
    const otherKey = isInfo ? "reports" : "info";
    const otherList = isInfo ? reportItems : infoItems;
    if (currentSpotlight.sectionTotal >= 3 || otherList.length === 0) {
      return null;
    }
    return {
      key: otherKey,
      meta: SECTION_META[otherKey],
      items: otherList.slice(0, 2),
      total: otherList.length,
    };
  }, [currentSpotlight, infoItems, reportItems]);

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
    {
      key: "info",
      targetSection: "info",
      value: stats.info,
      ...TYPE_META.info,
    },
    {
      key: "lost",
      targetSection: "reports",
      value: stats.lost,
      ...TYPE_META.lost,
    },
    {
      key: "found",
      targetSection: "reports",
      value: stats.found,
      ...TYPE_META.found,
    },
  ];

  const activeSectionCount =
    activeSection === "info" ? infoItems.length : reportItems.length;
  const activeSectionPos =
    viewMode === "spotlight"
      ? currentSpotlight?.indexInSection || 1
      : currentGridPage?.sectionPage || 1;
  const activeSectionTotalSegs =
    viewMode === "spotlight"
      ? activeSectionCount
      : currentGridPage?.sectionTotal || 1;
  const activeDuration =
    viewMode === "spotlight" ? SPOTLIGHT_DURATION_MS : GRID_DURATION_MS;

  return (
    <div
      className={`tv-root ${showControls ? "" : "tv-hide-cursor"}`}
      style={{ "--tv-section": sectionColor }}
    >
      {/* LATAR BELAKANG KORPORAT ADTEC (BIRU DIRAJA & EMAS) */}
      <div className="tv-bg" aria-hidden="true">
        <div className="tv-bg-blob tv-bg-blob--a" />
        <div className="tv-bg-blob tv-bg-blob--b" />
        <div className="tv-bg-blob tv-bg-blob--c" />
        <div className="tv-bg-grid" />
        <div className="tv-bg-topline" />
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
          onClick={() => stepForward(-1)}
          disabled={totalSteps <= 1}
          aria-label={isMs ? "Sebelum" : "Previous"}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="tv-control-btn tv-control-btn--icon"
          onClick={() => stepForward(1)}
          disabled={totalSteps <= 1}
          aria-label={isMs ? "Seterusnya" : "Next"}
        >
          <ChevronRight size={18} />
        </button>
        <span className="tv-control-sep" />
        <button
          type="button"
          className="tv-control-btn"
          onClick={() =>
            setViewMode((prev) =>
              prev === "spotlight" ? "grid" : "spotlight",
            )
          }
        >
          {viewMode === "spotlight" ? (
            <>
              <LayoutGrid size={16} />
              {isMs ? "Mod Grid" : "Grid View"}
            </>
          ) : (
            <>
              <Columns3 size={16} />
              {isMs ? "Mod Sorotan" : "Spotlight View"}
            </>
          )}
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

      {/* 1. HEADER EKSEKUTIF: IDENTITI KORPORAT, RINGKASAN KPI & JAM */}
      <header className="tv-header">
        <div className="tv-brand">
          <div className="tv-brand-logo-wrap">
            <img
              className="tv-brand-logo"
              src={LOGO_URL}
              alt="Logo ADTEC Melaka"
            />
          </div>
          <div className="tv-brand-text">
            <div className="tv-brand-kicker">
              <span className="tv-brand-kicker-dot" />
              {isMs
                ? "JABATAN TENAGA MANUSIA • KEMENTERIAN SUMBER MANUSIA"
                : "MANPOWER DEPARTMENT • MINISTRY OF HUMAN RESOURCES"}
            </div>
            <div className="tv-brand-title">
              {isMs
                ? "Papan Maklumat Digital ADTEC Melaka"
                : "ADTEC Melaka Digital Information Board"}
            </div>
            <div className="tv-brand-subtitle">
              <span>
                {isMs ? "Hebahan Rasmi Kolej" : "Official College Announcements"}
              </span>
              <span className="tv-brand-dot" />
              <span>
                {isMs
                  ? "Laporan Barang Hilang & Dijumpai"
                  : "Lost & Found Reports"}
              </span>
            </div>
          </div>
        </div>

        <div className="tv-stats">
          {statTiles.map(
            ({ key, targetSection, value, color, icon: StatIcon, ms, en }) => (
              <button
                key={key}
                type="button"
                className="tv-stat"
                style={{ "--accent": color }}
                onClick={() => goToSection(targetSection)}
              >
                <span className="tv-stat-icon">
                  <StatIcon />
                </span>
                <div>
                  <div className="tv-stat-value">{loading ? "–" : value}</div>
                  <div className="tv-stat-label">{isMs ? ms : en}</div>
                </div>
              </button>
            ),
          )}
        </div>

        <TvClock locale={locale} isMs={isMs} />
      </header>

      {/* 2. BAR SEKSYEN & PENUNJUK PROGRES */}
      <div className="tv-section-bar">
        <div className="tv-tabs">
          {Object.entries(SECTION_META).map(([key, meta]) => {
            const TabIcon = meta.icon;
            const count =
              key === "info" ? infoItems.length : reportItems.length;
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
                <span>{isMs ? meta.ms : meta.en}</span>
                {!loading && <span className="tv-tab-count">{count}</span>}
              </button>
            );
          })}
        </div>

        {activeSectionTotalSegs > 0 && (
          <div className="tv-pager">
            <span className="tv-pager-label">
              {viewMode === "spotlight"
                ? isMs
                  ? "Giliran Sorotan"
                  : "Spotlight Queue"
                : isMs
                  ? "Halaman Grid"
                  : "Grid Page"}
            </span>
            <div className="tv-segs">
              {Array.from({ length: activeSectionTotalSegs }).map((_, i) => {
                const pos = activeSectionPos - 1;
                return (
                  <span
                    key={`${activeSection}-${i}`}
                    className={`tv-seg ${
                      i < pos ? "is-done" : i === pos ? "is-active" : ""
                    }`}
                    style={{ "--accent": "#F59E0B" }}
                  >
                    <span
                      key={
                        i === pos
                          ? `seg-${viewMode}-${safeSpotlightIdx}-${safeGridIdx}`
                          : "idle"
                      }
                      className="tv-seg-fill"
                      style={
                        i === pos
                          ? { animationDuration: `${activeDuration}ms` }
                          : undefined
                      }
                    />
                  </span>
                );
              })}
            </div>
            <span className="tv-page-num">
              <strong>{pad(activeSectionPos)}</strong>
              <span>/ {pad(activeSectionTotalSegs)}</span>
            </span>
          </div>
        )}
      </div>

      {/* 3. KANDUNGAN UTAMA: SOROTAN + SENARAI (ATAU MOD GRID) */}
      {loading ? (
        <div className="tv-stage">
          <div className="tv-card tv-card--skeleton" />
          <div className="tv-queue-panel">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="tv-card tv-card--skeleton" />
            ))}
          </div>
        </div>
      ) : viewMode === "spotlight" && currentSpotlight ? (
        <div className="tv-stage">
          {/* KIRI: SOROTAN BESAR */}
          <TvSpotlight
            item={currentSpotlight.item}
            isMs={isMs}
            locale={locale}
            indexInSection={currentSpotlight.indexInSection}
            sectionTotal={currentSpotlight.sectionTotal}
            durationMs={SPOTLIGHT_DURATION_MS}
            animKey={`spot-${currentSpotlight.section}-${currentSpotlight.item.id}`}
          />

          {/* KANAN: SENARAI GILIRAN TERATUR */}
          <aside className="tv-queue-panel">
            <div className="tv-queue-header">
              <div className="tv-queue-header-title">
                <span className="tv-queue-header-dot" />
                {isMs
                  ? "Senarai & Giliran Paparan"
                  : "Display Queue & Directory"}
              </div>
              {queueWindow.pages > 1 ? (
                <span className="tv-queue-header-badge">
                  {isMs ? "Senarai" : "List"} {queueWindow.page} /{" "}
                  {queueWindow.pages}
                </span>
              ) : (
                <span className="tv-queue-header-badge">
                  {currentSpotlight.sectionTotal}{" "}
                  {isMs ? "Rekod Aktif" : "Active Items"}
                </span>
              )}
            </div>

            <div className="tv-queue-list">
              {queueWindow.items.map((qItem, idx) => {
                const itemNumber = queueWindow.startNumber + idx;
                const isActive = qItem.id === currentSpotlight.item.id;
                return (
                  <TvQueueCard
                    key={qItem.id}
                    item={qItem}
                    number={itemNumber}
                    isActive={isActive}
                    isMs={isMs}
                    locale={locale}
                    onSelect={() =>
                      selectSectionItem(currentSpotlight.section, qItem.id)
                    }
                  />
                );
              })}

              {/* Jika seksyen semasa cuma ada 1-2 item, paparkan pratonton seksyen sebelah supaya panel kanan kekal penuh & kemas */}
              {otherSectionPreview && (
                <div className="tv-queue-next-section">
                  <div className="tv-queue-next-title">
                    <span>
                      {isMs
                        ? `Seterusnya: ${otherSectionPreview.meta.ms}`
                        : `Up Next: ${otherSectionPreview.meta.en}`}
                    </span>
                    <span className="tv-queue-next-count">
                      {otherSectionPreview.total} {isMs ? "item" : "items"}
                    </span>
                  </div>
                  {otherSectionPreview.items.map((pItem, idx) => (
                    <TvQueueCard
                      key={`next-${pItem.id}`}
                      item={pItem}
                      number={idx + 1}
                      isActive={false}
                      isMs={isMs}
                      locale={locale}
                      onSelect={() =>
                        selectSectionItem(otherSectionPreview.key, pItem.id)
                      }
                    />
                  ))}
                </div>
              )}

              {/* Kad info pantas di bawah senarai jika masih ada ruang */}
              {currentSpotlight.sectionTotal <= 2 && (
                <div className="tv-queue-cta">
                  <span className="tv-queue-cta-icon">
                    <QrCode />
                  </span>
                  <div className="tv-queue-cta-text">
                    <strong>
                      {isMs
                        ? "Saluran Hebahan & Laporan Digital"
                        : "Digital Announcement & Report Channel"}
                    </strong>
                    <span>
                      {isMs
                        ? "Semua laporan yang disahkan akan dipaparkan secara automatik di skrin ini."
                        : "All verified reports are automatically displayed on this screen in real time."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      ) : currentGridPage ? (
        <div
          key={`page-${safeGridIdx}`}
          className={`tv-grid tv-grid--n${currentGridPage.items.length}`}
        >
          {currentGridPage.items.map((item, i) => (
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
