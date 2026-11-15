import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Settings,
  Sun,
  Moon,
  Edit2,
  Shield,
  Bell,
  Activity,
  Save,
  Key,
  User as UserIcon,
  List,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { AppContext } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";
import { ItemCardCompact } from "../components/ItemCardCompact";
import { supabase } from "../supabaseClient";

// Senarai rasmi kursus & jabatan di Institut Teknologi Automotif Termaju PROTON (ADTEC Melaka)
const PROTON_INSTITUTE_COURSE_GROUPS = [
  {
    groupMs: "Jabatan Teknologi Automotif & EV",
    groupEn: "Automotive & EV Technology Department",
    options: [
      {
        code: "DTA",
        value: "Teknologi Automotif (Servis Automotif) - DTA",
        labelMs: "Teknologi Automotif (Servis Automotif) — DTA",
        labelEn: "Automotive Technology (Automotive Service) — DTA",
      },
      {
        code: "EV",
        value: "Teknologi Automotif (Kenderaan Elektrik / EV)",
        labelMs: "Teknologi Automotif (Kenderaan Elektrik / EV)",
        labelEn: "Automotive Technology (Electric Vehicle / EV)",
      },
      {
        code: "SKM-AUTO",
        value: "Teknologi Automotif (Servis Diagnostik - Kenderaan Ringan)",
        labelMs: "Teknologi Automotif (Servis Diagnostik Kenderaan Ringan)",
        labelEn: "Automotive Technology (Light Vehicle Diagnostic Service)",
      },
      {
        code: "AFTERSALES",
        value: "Teknologi Automotif (Operasi Servis Selepas Jualan)",
        labelMs: "Teknologi Automotif (Operasi Servis Selepas Jualan)",
        labelEn: "Automotive Technology (After-Sales Service Operations)",
      },
    ],
  },
  {
    groupMs: "Jabatan Teknologi Mekatronik & Automasi",
    groupEn: "Mechatronics & Industrial Automation Department",
    options: [
      {
        code: "DTM",
        value: "Teknologi Mekatronik (Kejuruteraan Automasi Industri) - DTM",
        labelMs: "Teknologi Mekatronik (Kejuruteraan Automasi Industri) — DTM",
        labelEn: "Mechatronics Technology (Industrial Automation Eng.) — DTM",
      },
    ],
  },
  {
    groupMs: "Jabatan Teknologi Komputer & ICT",
    groupEn: "Computer System & ICT Department",
    options: [
      {
        code: "DTK",
        value: "Teknologi Komputer Sistem (Pentadbiran Sistem Komputer) - DTK",
        labelMs: "Teknologi Komputer Sistem (Pentadbiran Sistem Komputer) — DTK",
        labelEn: "Computer System Technology (System Administration) — DTK",
      },
    ],
  },
  {
    groupMs: "Jabatan Teknologi Telekomunikasi",
    groupEn: "Telecommunication Technology Department",
    options: [
      {
        code: "DTT",
        value: "Teknologi Telekomunikasi (Infrastruktur Penghantaran) - DTT",
        labelMs: "Teknologi Telekomunikasi (Infrastruktur Penghantaran) — DTT",
        labelEn: "Telecommunication Tech. (Transmission Infrastructure) — DTT",
      },
    ],
  },
  {
    groupMs: "Jabatan Teknologi Pembuatan (Perkakasan)",
    groupEn: "Manufacturing Technology (Tooling) Department",
    options: [
      {
        code: "DTP-DIE",
        value: "Teknologi Pembuatan Perkakasan (Penekanan Dai Logam / Die) - DTP",
        labelMs: "Teknologi Pembuatan Perkakasan (Penekanan Dai Logam / Die) — DTP",
        labelEn: "Manufacturing Tech. (Metal Stamping Die) — DTP",
      },
      {
        code: "DTP-MOULD",
        value: "Teknologi Pembuatan Perkakasan (Acuan Suntikan Plastik / Mould)",
        labelMs: "Teknologi Pembuatan Perkakasan (Acuan Suntikan Plastik / Mould)",
        labelEn: "Manufacturing Tech. (Plastic Injection Mould)",
      },
    ],
  },
  {
    groupMs: "Kakitangan & Pentadbiran Kampus",
    groupEn: "Campus Staff & Administration",
    options: [
      {
        code: "PENGAJAR",
        value: "Staf Akademik / Pengajar",
        labelMs: "Staf Akademik / Pengajar",
        labelEn: "Academic Staff / Instructor",
      },
      {
        code: "PENTADBIRAN",
        value: "Staf Pentadbiran & Pengurusan",
        labelMs: "Staf Pentadbiran & Pengurusan",
        labelEn: "Administration & Management Staff",
      },
    ],
  },
];

const ALL_PROTON_COURSES = PROTON_INSTITUTE_COURSE_GROUPS.flatMap(
  (g) => g.options,
);

const LEGACY_DEPARTMENT_MAP = {
  DTK: "Teknologi Komputer Sistem (Pentadbiran Sistem Komputer) - DTK",
  DTA: "Teknologi Automotif (Servis Automotif) - DTA",
  DTM: "Teknologi Mekatronik (Kejuruteraan Automasi Industri) - DTM",
  DTT: "Teknologi Telekomunikasi (Infrastruktur Penghantaran) - DTT",
  DTP: "Teknologi Pembuatan Perkakasan (Penekanan Dai Logam / Die) - DTP",
};

function normalizeDepartment(raw) {
  if (!raw) return "";
  const trimmed = raw.trim();
  const upper = trimmed.toUpperCase();
  if (LEGACY_DEPARTMENT_MAP[upper]) return LEGACY_DEPARTMENT_MAP[upper];
  return trimmed;
}

export function ProfileView({ onContact, currentUser }) {
  const { lang, setLang, t } = useContext(LanguageContext);
  const { setUser: setGlobalUser } = useContext(AppContext);
  const { theme, toggleTheme, colorTheme, setColorTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showColorSettings, setShowColorSettings] = useState(false);
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    department: "",
    email_notifs: false,
    match_notifs: true,
  });
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [notifSaved, setNotifSaved] = useState(false);

  // Tabs state
  const [activeTab, setActiveTab] = useState("profile"); // profile, reports, security
  const [activeReportTab, setActiveReportTab] = useState("all"); // all, active, resolved
  const [showPassword, setShowPassword] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  async function fetchProfileData() {
    try {
      setLoading(true);
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      if (supabaseUser) {
        // Fetch profiles table
        const { data: pData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", supabaseUser.id)
          .single();

        setUser({
          id: supabaseUser.id,
          name:
            currentUser?.name ||
            supabaseUser.user_metadata?.full_name ||
            supabaseUser.user_metadata?.username ||
            "User",
          email: supabaseUser.email,
          avatar_url: pData?.avatar_url || currentUser?.avatar_url,
        });

        if (pData) {
          setProfileData({
            department: normalizeDepartment(pData.department),
            email_notifs: pData.email_notifs === true,
            match_notifs: pData.match_notifs !== false,
          });
        }

        // Fetch items reported by this user
        const { data, error } = await supabase
          .from("items")
          .select("*")
          .eq("created_by", supabaseUser.id)
          .neq("status", "deleted")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) setUserItems(data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(t("alertFileSize") || "Saiz fail terlalu besar (maksimum 5MB).");
      return;
    }

    try {
      setUploadingAvatar(true);
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      if (!supabaseUser)
        throw new Error(t("pleaseLoginAgain") || "Sila log masuk semula.");

      const fileExt = file.name.split(".").pop();
      const fileName = `avatar_${supabaseUser.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("item-images")
        .upload(`avatars/${fileName}`, file);

      if (uploadError)
        throw new Error("Gagal memuat naik gambar: " + uploadError.message);

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("item-images")
        .getPublicUrl(`avatars/${fileName}`);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", supabaseUser.id);

      if (updateError) throw updateError;

      setUser((prev) => ({ ...prev, avatar_url: publicUrl }));

      if (setGlobalUser) {
        setGlobalUser((prev) => ({ ...prev, avatar_url: publicUrl }));
      } else if (currentUser) {
        currentUser.avatar_url = publicUrl;
      }
      window.dispatchEvent(
        new CustomEvent("avatarUpdated", { detail: publicUrl }),
      );
      alert(t("profilePicSuccess") || "Gambar profil berjaya ditukar!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .update({
          department: profileData.department,
          email_notifs: profileData.email_notifs,
          match_notifs: profileData.match_notifs,
        })
        .eq("id", user.id);

      if (error) throw error;
      alert(t("profileSaveSuccess") || "Profil berjaya disimpan!");
    } catch (e) {
      console.error(e);
      alert(
        t("profileSaveError") ||
          "Ralat: Sila pastikan anda telah menjalankan script SQL (add_profile_features.sql) di pangkalan data Supabase.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleColorThemeChange = async (newColor) => {
    setColorTheme(newColor);
    try {
      await supabase.auth.updateUser({ data: { colorTheme: newColor } });
    } catch (e) {
      console.error("Failed to save color theme", e);
    }
  };

  const handleThemeModeChange = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    toggleTheme();
    try {
      await supabase.auth.updateUser({ data: { theme: newTheme } });
    } catch (e) {
      console.error("Failed to save theme mode", e);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;
    if (password !== confirm)
      return alert(t("passwordMismatchError") || "Kata laluan tidak sepadan!");
    if (password.length < 6)
      return alert(
        t("passwordShortError") ||
          "Kata laluan mestilah sekurang-kurangnya 6 aksara.",
      );

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      alert(t("passwordChangeSuccess") || "Kata laluan berjaya ditukar!");
      e.target.reset();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (itemId) => {
    const confirmDelete = window.confirm(
      t("confirmResolveReport") ||
        "Are you sure you want to mark this report as Resolved?",
    );
    if (!confirmDelete) return;

    setDeletingItemId(itemId);
    try {
      const { error } = await supabase
        .from("items")
        .update({ status: "resolved" })
        .eq("id", itemId);
      if (error) throw error;
      setTimeout(() => {
        setUserItems(
          userItems.map((item) =>
            item.id === itemId ? { ...item, status: "resolved" } : item,
          ),
        );
        setDeletingItemId(null);
      }, 500);
    } catch (error) {
      console.error("Error resolving item:", error.message);
      alert(t("failedUpdateReport") || "Gagal mengemas kini laporan.");
      setDeletingItemId(null);
    }
  };

  // Stats calculation
  const totalReports = userItems.length;
  const resolvedReports = userItems.filter(
    (i) => i.status === "resolved",
  ).length;
  const activeReports = userItems.filter((i) => i.status !== "resolved").length;

  const filteredItems = userItems.filter((item) => {
    if (activeReportTab === "active") return item.status !== "resolved";
    if (activeReportTab === "resolved") return item.status === "resolved";
    return true;
  });

  return (
    <div
      className="page-bg-common bg-profile"
      style={{ paddingBottom: "3rem" }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Profile Header Card */}
        <div
          className="glass-panel profile-header"
          style={{
            padding: "2rem",
            marginBottom: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ position: "relative", cursor: "pointer" }}
            onClick={() => !uploadingAvatar && fileInputRef.current?.click()}
            title={t("changeProfilePic") || "Tukar Gambar Profil"}
          >
            <img
              className="profile-avatar"
              src={
                user?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=4F46E5&color=fff&size=120`
              }
              alt="User"
              style={{
                borderRadius: "50%",
                width: "120px",
                height: "120px",
                objectFit: "cover",
                opacity: uploadingAvatar ? 0.5 : 1,
                border: "4px solid var(--surface)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "var(--primary)",
                color: "white",
                borderRadius: "50%",
                padding: "0.4rem",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <Edit2 size={16} />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              style={{ display: "none" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>
                {user?.name || "User Name"}
              </h1>
              {resolvedReports > 3 && (
                <span
                  style={{
                    background: "#f59e0b",
                    color: "white",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "1rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.2rem",
                  }}
                >
                  🏅 {t("trustedFinder") || "Trusted Finder"}
                </span>
              )}
            </div>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: profileData.department ? "0.65rem" : "1.5rem",
                fontSize: "1.1rem",
              }}
            >
              {user?.email || "Email"}
            </p>
            {profileData.department && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "999px",
                  background: "rgba(99, 102, 241, 0.14)",
                  border: "1px solid rgba(99, 102, 241, 0.35)",
                  color: "var(--primary)",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "1.25rem",
                }}
              >
                <GraduationCap size={16} />
                <span>{profileData.department}</span>
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "1rem",
                position: "relative",
                zIndex: 20,
                flexWrap: "wrap",
              }}
            >
              <div style={{ position: "relative" }}>
                <button
                  className="btn-primary"
                  style={{
                    background: "transparent",
                    color: "var(--text-main)",
                    border: "1px solid var(--border)",
                  }}
                  onClick={() => {
                    setShowSettings(!showSettings);
                    setShowColorSettings(false);
                  }}
                >
                  <Settings size={18} /> {t("languageSettings")}
                </button>
                {showSettings && (
                  <div
                    className="glass-panel notif-dropdown-enter"
                    style={{
                      position: "absolute",
                      top: "110%",
                      left: 0,
                      width: "200px",
                      zIndex: 10,
                      padding: "1rem",
                      boxShadow: "var(--shadow-lg)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        <input
                          type="radio"
                          name="lang"
                          checked={lang === "ms"}
                          onChange={() => setLang("ms")}
                        />{" "}
                        {t("malay")}
                      </label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        <input
                          type="radio"
                          name="lang"
                          checked={lang === "en"}
                          onChange={() => setLang("en")}
                        />{" "}
                        {t("english")}
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ position: "relative" }}>
                <button
                  className="btn-primary"
                  style={{
                    background: "transparent",
                    color: "var(--text-main)",
                    border: "1px solid var(--border)",
                  }}
                  onClick={() => {
                    setShowColorSettings(!showColorSettings);
                    setShowSettings(false);
                  }}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: "var(--primary)",
                    }}
                  ></div>{" "}
                  {t("themeColor") || "Warna Tema"}
                </button>
                {showColorSettings && (
                  <div
                    className="glass-panel notif-dropdown-enter"
                    style={{
                      position: "absolute",
                      top: "110%",
                      left: 0,
                      width: "200px",
                      zIndex: 10,
                      padding: "1rem",
                      boxShadow: "var(--shadow-lg)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "0.75rem",
                        flexWrap: "wrap",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => handleColorThemeChange("default")}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "#6366F1",
                          border:
                            colorTheme === "default"
                              ? "2px solid var(--text-main)"
                              : "2px solid transparent",
                          cursor: "pointer",
                        }}
                        title="Default"
                      ></button>
                      <button
                        onClick={() => handleColorThemeChange("blue")}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "#3B82F6",
                          border:
                            colorTheme === "blue"
                              ? "2px solid var(--text-main)"
                              : "2px solid transparent",
                          cursor: "pointer",
                        }}
                        title="Blue"
                      ></button>
                      <button
                        onClick={() => handleColorThemeChange("green")}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "#10B981",
                          border:
                            colorTheme === "green"
                              ? "2px solid var(--text-main)"
                              : "2px solid transparent",
                          cursor: "pointer",
                        }}
                        title="Green"
                      ></button>
                      <button
                        onClick={() => handleColorThemeChange("purple")}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "#8B5CF6",
                          border:
                            colorTheme === "purple"
                              ? "2px solid var(--text-main)"
                              : "2px solid transparent",
                          cursor: "pointer",
                        }}
                        title="Purple"
                      ></button>
                      <button
                        onClick={() => handleColorThemeChange("red")}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "#EF4444",
                          border:
                            colorTheme === "red"
                              ? "2px solid var(--text-main)"
                              : "2px solid transparent",
                          cursor: "pointer",
                        }}
                        title="Red"
                      ></button>
                    </div>
                  </div>
                )}
              </div>

              <button
                className="btn-primary"
                style={{
                  background: "var(--surface)",
                  color: "var(--text-main)",
                  border: "1px solid var(--border)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={handleThemeModeChange}
                title={
                  theme === "dark"
                    ? t("switchToLightMode") || "Tukar ke Light Mode"
                    : t("switchToDarkMode") || "Tukar ke Dark Mode"
                }
              >
                {theme === "dark" ? (
                  <Moon size={18} style={{ color: "#6366F1" }} />
                ) : (
                  <Sun size={18} style={{ color: "#F59E0B" }} />
                )}{" "}
                {theme === "dark"
                  ? t("darkMode") || "Dark Mode"
                  : t("lightMode") || "Light Mode"}
              </button>
            </div>
          </div>
        </div>

        {/* Activity Stats Dashboard */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div
            className="glass-panel"
            style={{ padding: "1.5rem", textAlign: "center" }}
          >
            <Activity
              size={32}
              style={{ color: "#3B82F6", margin: "0 auto 0.5rem" }}
            />
            <h3 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
              {totalReports}
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              {t("totalReports") || "Jumlah Laporan"}
            </p>
          </div>
          <div
            className="glass-panel"
            style={{ padding: "1.5rem", textAlign: "center" }}
          >
            <Clock
              size={32}
              style={{ color: "#F59E0B", margin: "0 auto 0.5rem" }}
            />
            <h3 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
              {activeReports}
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              {t("activePending") || "Sedang Aktif (Pending)"}
            </p>
          </div>
          <div
            className="glass-panel"
            style={{ padding: "1.5rem", textAlign: "center" }}
          >
            <CheckCircle
              size={32}
              style={{ color: "#10B981", margin: "0 auto 0.5rem" }}
            />
            <h3 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
              {resolvedReports}
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              {t("resolved") || "Telah Diselesaikan"}
            </p>
          </div>
        </div>

        {/* Main Tabs */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginBottom: "1.5rem",
            borderBottom: "1px solid var(--border)",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "0.5rem",
          }}
        >
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "none",
              color:
                activeTab === "profile"
                  ? "var(--primary)"
                  : "var(--text-muted)",
              fontWeight: activeTab === "profile" ? 600 : 400,
              borderBottom:
                activeTab === "profile"
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              touchAction: "manipulation",
            }}
          >
            <UserIcon size={18} /> {t("profileNotifs") || "Profil & Notifikasi"}
          </button>
          <button
            className={`tab-btn ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => setActiveTab("reports")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "none",
              color:
                activeTab === "reports"
                  ? "var(--primary)"
                  : "var(--text-muted)",
              fontWeight: activeTab === "reports" ? 600 : 400,
              borderBottom:
                activeTab === "reports"
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              touchAction: "manipulation",
            }}
          >
            <List size={18} /> {t("reportHistory") || "Sejarah Laporan"}
          </button>
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "none",
              color:
                activeTab === "security"
                  ? "var(--primary)"
                  : "var(--text-muted)",
              fontWeight: activeTab === "security" ? 600 : 400,
              borderBottom:
                activeTab === "security"
                  ? "2px solid var(--primary)"
                  : "2px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
              touchAction: "manipulation",
            }}
          >
            <Shield size={18} /> {t("security") || "Keselamatan"}
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === "profile" && (
          <div
            className="glass-panel"
            style={{ padding: "2rem", animation: "fadeIn 0.3s ease" }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <UserIcon size={20} className="text-primary" />{" "}
              {t("updateInfo") || "Kemas Kini Maklumat"}
            </h3>
            <div style={{ maxWidth: "680px", marginBottom: "2rem" }}>
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    marginBottom: "0.55rem",
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  <GraduationCap size={16} className="text-primary" />
                  {t("departmentCourse") ||
                    "Jabatan / Kursus (PROTON Institute Melaka)"}
                </label>

                <select
                  className="input-field"
                  value={profileData.department}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      department: e.target.value,
                    })
                  }
                  style={{
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  <option value="">
                    {t("deptPlaceholder") || "-- Pilih Kursus / Jabatan --"}
                  </option>
                  {/* Kekalkan nilai lama jika pengguna pernah menaip nilai tersendiri sebelum ini */}
                  {profileData.department &&
                    !ALL_PROTON_COURSES.some(
                      (c) => c.value === profileData.department,
                    ) && (
                      <option value={profileData.department}>
                        {profileData.department}
                      </option>
                    )}
                  {PROTON_INSTITUTE_COURSE_GROUPS.map((group) => (
                    <optgroup
                      key={group.groupMs}
                      label={lang === "ms" ? group.groupMs : group.groupEn}
                    >
                      {group.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {lang === "ms" ? opt.labelMs : opt.labelEn}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                {/* Pilihan Pantas (Klik Terus Tanpa Perlu Taip) */}
                <div style={{ marginTop: "1rem" }}>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.6rem",
                      fontWeight: 500,
                    }}
                  >
                    {t("deptQuickSelectHint") ||
                      "Atau klik pilihan kursus di bawah:"}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: "0.55rem",
                    }}
                  >
                    {ALL_PROTON_COURSES.map((opt) => {
                      const isSelected = profileData.department === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() =>
                            setProfileData({
                              ...profileData,
                              department: opt.value,
                            })
                          }
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.6rem",
                            padding: "0.6rem 0.8rem",
                            borderRadius: "0.65rem",
                            border: isSelected
                              ? "1.5px solid var(--primary)"
                              : "1px solid var(--border)",
                            background: isSelected
                              ? "rgba(99, 102, 241, 0.14)"
                              : "var(--surface)",
                            color: "var(--text-main)",
                            textAlign: "left",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <span
                            style={{
                              flexShrink: 0,
                              padding: "0.2rem 0.5rem",
                              borderRadius: "0.4rem",
                              background: isSelected
                                ? "var(--primary)"
                                : "rgba(99, 102, 241, 0.12)",
                              color: isSelected ? "#ffffff" : "var(--primary)",
                              fontSize: "0.72rem",
                              fontWeight: 700,
                              letterSpacing: "0.04em",
                            }}
                          >
                            {opt.code}
                          </span>
                          <span
                            style={{
                              fontSize: "0.82rem",
                              fontWeight: isSelected ? 600 : 500,
                              lineHeight: 1.3,
                              flex: 1,
                            }}
                          >
                            {lang === "ms" ? opt.labelMs : opt.labelEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--border)",
              }}
            >
              <Bell size={20} className="text-primary" />{" "}
              {t("notifSettings") || "Tetapan Notifikasi"}
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    width: "1.2rem",
                    height: "1.2rem",
                    cursor: "pointer",
                  }}
                  checked={profileData.email_notifs}
                  onChange={(e) => {
                    setProfileData((prev) => ({
                      ...prev,
                      email_notifs: e.target.checked,
                    }));
                  }}
                />
                <span style={{ fontWeight: 500 }}>
                  {t("emailNotifDesc") ||
                    "Terima e-mel apabila ada mesej baru masuk."}
                </span>
              </label>
            </div>

            <button
              className="btn-primary"
              onClick={handleSaveProfile}
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Save size={18} />{" "}
              {saving
                ? t("saving") || "Menyimpan..."
                : t("saveProfile") || "Simpan Profil"}
            </button>
          </div>
        )}

        {activeTab === "security" && (
          <div
            className="glass-panel"
            style={{ padding: "2rem", animation: "fadeIn 0.3s ease" }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <Key size={20} className="text-primary" />{" "}
              {t("changePasswordBtn") || "Tukar Kata Laluan"}
            </h3>
            <form
              onSubmit={handleChangePassword}
              style={{
                maxWidth: "400px",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  {t("newPasswordLabel") || "Kata Laluan Baru"}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="input-field"
                    required
                    minLength={6}
                    placeholder="********"
                    style={{
                      paddingRight: "2.5rem",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                    }}
                    title={
                      showPassword
                        ? t("hidePassword") || "Sembunyikan Kata Laluan"
                        : t("showPassword") || "Papar Kata Laluan"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  {t("confirmNewPasswordLabel") || "Sahkan Kata Laluan Baru"}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirm"
                    className="input-field"
                    required
                    minLength={6}
                    placeholder="********"
                    style={{
                      paddingRight: "2.5rem",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                    }}
                    title={
                      showPassword
                        ? t("hidePassword") || "Sembunyikan Kata Laluan"
                        : t("showPassword") || "Papar Kata Laluan"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}
              >
                {t("updatePassword") || "Kemas Kini Kata Laluan"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "reports" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {/* Sub-tabs for reports */}
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}
            >
              <button
                onClick={() => setActiveReportTab("all")}
                className={`btn-primary ${activeReportTab === "all" ? "" : "btn-outline"}`}
                style={{
                  padding: "0.4rem 1rem",
                  background:
                    activeReportTab === "all"
                      ? "var(--primary)"
                      : "transparent",
                  color:
                    activeReportTab === "all" ? "white" : "var(--text-main)",
                  border: "1px solid var(--primary)",
                }}
              >
                {t("all") || "Semua"}
              </button>
              <button
                onClick={() => setActiveReportTab("active")}
                className={`btn-primary ${activeReportTab === "active" ? "" : "btn-outline"}`}
                style={{
                  padding: "0.4rem 1rem",
                  background:
                    activeReportTab === "active" ? "#F59E0B" : "transparent",
                  color:
                    activeReportTab === "active" ? "white" : "var(--text-main)",
                  border: "1px solid #F59E0B",
                }}
              >
                {t("activePending") || "Aktif (Pending)"}
              </button>
              <button
                onClick={() => setActiveReportTab("resolved")}
                className={`btn-primary ${activeReportTab === "resolved" ? "" : "btn-outline"}`}
                style={{
                  padding: "0.4rem 1rem",
                  background:
                    activeReportTab === "resolved" ? "#10B981" : "transparent",
                  color:
                    activeReportTab === "resolved"
                      ? "white"
                      : "var(--text-main)",
                  border: "1px solid #10B981",
                }}
              >
                {t("resolved") || "Selesai"}
              </button>
            </div>

            {loading ? (
              <p style={{ color: "var(--text-muted)" }}>
                {t("loadingReports")}
              </p>
            ) : filteredItems.length === 0 ? (
              <div
                className="glass-panel"
                style={{ padding: "3rem", textAlign: "center" }}
              >
                <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                  {t("noReportsForCategory") ||
                    "Tiada laporan dijumpai untuk kategori ini."}
                </p>
              </div>
            ) : (
              <div className="grid-cards">
                {filteredItems.map((item) => (
                  <ItemCardCompact
                    key={item.id}
                    item={item}
                    onContact={onContact}
                    currentUser={currentUser}
                    onDelete={handleDelete}
                    isDeleting={deletingItemId === item.id}
                    isResolveAction={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
