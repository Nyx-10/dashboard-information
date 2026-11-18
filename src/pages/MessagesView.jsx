import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Search,
  AlertCircle,
  Image as ImageIcon,
  Upload,
  X,
  Check,
  MessageSquare,
  ArrowLeft,
  Send,
  ShieldCheck,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext";
import { supabase, uploadImageToStorage } from "../supabaseClient";
import { ItemCardCompact } from "../components/ItemCardCompact";

function UserProfileModal({ profile, onClose, t }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(profile);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!profile.id) {
          setLoading(false);
          return;
        }

        // Fetch full profile info
        const { data: pData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profile.id)
          .single();
        if (pData) {
          setProfileData((prev) => ({
            ...prev,
            role: pData.role,
            email: pData.email,
            department: pData.department,
          }));
        }

        // Fetch their reports
        const { data: iData } = await supabase
          .from("items")
          .select("*")
          .eq("created_by", profile.id)
          .neq("status", "deleted")
          .order("created_at", { ascending: false });

        if (iData) {
          setItems(iData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [profile.id]);

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        className="glass-panel modal-bounce"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          borderRadius: "1rem",
          padding: "2rem",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          className="modal-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
        >
          <X size={24} />
        </button>

        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <a
            href={profileData.avatar}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={profileData.avatar}
              alt={profileData.name}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                margin: "0 auto 1rem",
                display: "block",
                cursor: "zoom-in",
                boxShadow: "var(--shadow-md)",
              }}
            />
          </a>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--text-main)",
              marginBottom: "0.25rem",
            }}
          >
            {profileData.name}
          </h2>
          {profileData.department && (
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-muted)",
                marginBottom: "0.5rem",
                fontWeight: 500,
              }}
            >
              🎓 {profileData.department}
            </p>
          )}
          {profileData.role && (
            <span
              style={{
                fontSize: "0.8rem",
                background: "var(--primary)",
                color: "white",
                padding: "0.2rem 0.6rem",
                borderRadius: "1rem",
                display: "inline-block",
              }}
            >
              {profileData.role === "superadmin"
                ? "Super Admin"
                : profileData.role === "admin"
                  ? "Admin"
                  : "User"}
            </span>
          )}
        </div>

        <div style={{ textAlign: "left" }}>
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              borderBottom: "1px solid var(--border)",
              paddingBottom: "0.5rem",
              marginBottom: "1rem",
              color: "var(--text-main)",
            }}
          >
            {t("reportsByUser") || "Laporan oleh pengguna ini"}
          </h3>

          {loading ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
              {t("loading") || "Loading..."}
            </p>
          ) : items.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
              {t("noReportsMade") || "Tiada laporan"}
            </p>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {items.map((item) => (
                <ItemCardCompact key={item.id} item={item} currentUser={null} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator({ avatar }) {
  return (
    <div className="typing-indicator">
      <img
        src={avatar}
        alt="Typing"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          flexShrink: 0,
        }}
      />
      <div className="typing-dots">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

export function MessagesView({
  initialChatUser,
  onMessagesRead,
  onlineUsers = new Set(),
}) {
  const { lang, t } = useContext(LanguageContext);
  const isMs = lang === "ms";
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState("Spam");
  const [reportReason, setReportReason] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [reportFilePreview, setReportFilePreview] = useState(null);
  const [submittingReport, setSubmittingReport] = useState(false);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(
    initialChatUser ? initialChatUser.id : null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingChannelRef = useRef(null);

  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setCurrentUserId(user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("avatar_url, username")
          .eq("id", user.id)
          .single();
        if (profile?.avatar_url) {
          setCurrentUserAvatar(profile.avatar_url);
        }
        setCurrentUserName(
          profile?.username ||
            user.user_metadata?.full_name ||
            user.user_metadata?.username ||
            user.email?.split("@")[0] ||
            "Pengguna",
        );
        fetchChats(user.id);
      }
    });
  }, []);

  const fetchChats = async (userId) => {
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
        sender_id, receiver_id, content, created_at, is_read,
        sender:profiles!messages_sender_id_fkey(username, avatar_url),
        receiver:profiles!messages_receiver_id_fkey(username, avatar_url)
      `,
      )
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const chatMap = new Map();

      data.forEach((msg) => {
        const otherId =
          msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        if (otherId === userId) return; // Prevent self-contact

        if (!chatMap.has(otherId)) {
          const otherProfile =
            msg.sender_id === userId ? msg.receiver : msg.sender;
          const otherName = otherProfile?.username || "User";
          const otherAvatar =
            otherProfile?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(otherName)}&background=4F46E5&color=fff`;

          chatMap.set(otherId, {
            id: otherId,
            name: otherName,
            time: new Date(msg.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            preview: msg.content,
            avatar: otherAvatar,
            unreadCount: 0,
          });
        }

        // Kira mesej unread
        if (msg.receiver_id === userId && msg.is_read === false) {
          const chat = chatMap.get(otherId);
          chat.unreadCount += 1;
        }
      });

      let chatList = Array.from(chatMap.values());

      if (
        initialChatUser &&
        initialChatUser.id !== userId &&
        !chatMap.has(initialChatUser.id)
      ) {
        chatList = [
          {
            id: initialChatUser.id,
            name: initialChatUser.name,
            time: t("justNow"),
            preview: initialChatUser.preview || "...",
            avatar:
              initialChatUser.avatar_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(initialChatUser.name)}&background=4F46E5&color=fff`,
            unreadCount: 0,
          },
          ...chatList,
        ];
      }

      setChats(chatList);
    } else if (initialChatUser && initialChatUser.id !== userId) {
      setChats([
        {
          id: initialChatUser.id,
          name: initialChatUser.name,
          time: t("justNow"),
          preview: initialChatUser.preview || "...",
          avatar:
            initialChatUser.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(initialChatUser.name)}&background=4F46E5&color=fff`,
          unreadCount: 0,
        },
      ]);
    }
  };

  useEffect(() => {
    if (initialChatUser && currentUserId) {
      if (initialChatUser.id === currentUserId) {
        if (activeChat === currentUserId) setActiveChat(null);
        return;
      }
      setActiveChat(initialChatUser.id);
      if (initialChatUser.preview && initialChatUser.preview !== "...") {
        setNewMessage(`[ ${initialChatUser.preview} ] - `);
      }
    }
  }, [initialChatUser, currentUserId]);

  // Buka chat secara automatik jika pautan dari e-mel mempunyai parameter ?chat=USER_ID
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const targetChatId = searchParams.get("chat");
    if (targetChatId && currentUserId && targetChatId !== currentUserId) {
      setActiveChat(targetChatId);
      supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", targetChatId)
        .single()
        .then(({ data }) => {
          if (data) {
            setChats((prev) => {
              if (prev.some((c) => c.id === targetChatId)) return prev;
              return [
                {
                  id: data.id,
                  name: data.username || "Pengguna",
                  time: t("justNow"),
                  preview: "Mesej baharu...",
                  avatar:
                    data.avatar_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(data.username || "Pengguna")}&background=4F46E5&color=fff`,
                  unreadCount: 0,
                },
                ...prev,
              ];
            });
          }
        });
    }
  }, [currentUserId]);

  useEffect(() => {
    if (activeChat && currentUserId) {
      fetchMessages(currentUserId, activeChat);
      setIsOtherTyping(false);

      const channel = supabase
        .channel("public:messages")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "messages" },
          (payload) => {
            const newMsg = payload.new;
            if (
              (newMsg.sender_id === currentUserId &&
                newMsg.receiver_id === activeChat) ||
              (newMsg.sender_id === activeChat &&
                newMsg.receiver_id === currentUserId)
            ) {
              // Jika mesej masuk dari orang lain sewaktu chat sedang aktif, tanda sebagai 'read' terus
              if (newMsg.sender_id === activeChat) {
                supabase
                  .from("messages")
                  .update({ is_read: true })
                  .eq("id", newMsg.id)
                  .then();
                setIsOtherTyping(false); // Stop typing indicator when message arrives
              }
              setMessages((prev) => [...prev, newMsg]);
              scrollToBottom();
            } else if (newMsg.receiver_id === currentUserId) {
              // Mesej dari orang lain yang tiada di chat aktif, update unread count
              setChats((prev) =>
                prev.map((c) =>
                  c.id === newMsg.sender_id
                    ? { ...c, unreadCount: (c.unreadCount || 0) + 1 }
                    : c,
                ),
              );
            }
          },
        )
        .subscribe();

      // Typing indicator channel
      const sortedIds = [currentUserId, activeChat].sort();
      const typingChannel = supabase
        .channel(`typing:${sortedIds[0]}:${sortedIds[1]}`)
        .on("broadcast", { event: "typing" }, ({ payload }) => {
          if (payload.userId !== currentUserId) {
            setIsOtherTyping(true);
            if (typingTimeoutRef.current)
              clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(
              () => setIsOtherTyping(false),
              2500,
            );
          }
        })
        .subscribe();

      typingChannelRef.current = typingChannel;

      return () => {
        supabase.removeChannel(channel);
        supabase.removeChannel(typingChannel);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      };
    }
  }, [activeChat, currentUserId]);

  useEffect(() => {
    if (activeChat) {
      setChats((prev) => {
        if (prev.some((c) => c.id === activeChat && c.unreadCount > 0)) {
          return prev.map((c) =>
            c.id === activeChat ? { ...c, unreadCount: 0 } : c,
          );
        }
        return prev;
      });
    }
  }, [activeChat, chats]);

  const fetchMessages = async (userId, otherUserId) => {
    // 1. Mark semue mesej dari otherUserId sebagai 'read'
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", otherUserId)
      .eq("receiver_id", userId)
      .eq("is_read", false);

    // 2. Clear unreadCount di sidebar untuk chat ini
    setChats((prev) =>
      prev.map((c) => (c.id === otherUserId ? { ...c, unreadCount: 0 } : c)),
    );
    if (onMessagesRead) onMessagesRead();

    // 3. Fetch mesej
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`,
      )
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data);
      scrollToBottom();
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReportScreenshotSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert(t("alertInvalidFile") || "Please upload image files only.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(t("alertFileSize") || "File size exceeds 5MB limit.");
      return;
    }
    setReportFile(file);
    setReportFilePreview(URL.createObjectURL(file));
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId || !activeChatData) return;
    if (!reportFile) {
      alert(
        t("screenshotRequired") ||
          "Please upload a screenshot proof before submitting.",
      );
      return;
    }

    setSubmittingReport(true);
    try {
      let imageUrl = "";
      const fileExt = reportFile.name.split(".").pop();
      const fileName = `report-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { publicUrl, error: uploadError } = await uploadImageToStorage(
        fileName,
        reportFile,
        "item-images",
      );

      if (uploadError) throw uploadError;

      imageUrl = publicUrl;

      const { error } = await supabase.from("user_reports").insert([
        {
          reporter_id: currentUserId,
          reported_id: activeChatData.id,
          report_type: reportType,
          reason_text: reportReason,
          image_url: imageUrl,
          status: "Pending",
        },
      ]);

      if (error) throw error;

      alert(t("alertSuccessReport") || "Report submitted successfully.");
      setShowReportModal(false);
      setReportType("Spam");
      setReportReason("");
      setReportFile(null);
      setReportFilePreview(null);
    } catch (err) {
      console.error(err);
      alert(
        (t("alertFailedReport") || "Failed to submit report: ") + err.message,
      );
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat || !currentUserId) return;
    if (activeChat === currentUserId) {
      alert(t("cannotContactSelf") || "You cannot contact yourself.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert(t("alertInvalidFile") || "Please upload image files only.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(t("alertFileSize") || "File size exceeds 5MB limit.");
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `chat-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { publicUrl, error: uploadError } = await uploadImageToStorage(
        fileName,
        file,
        "item-images",
      );

      if (uploadError) throw new Error(uploadError.message);

      const messageContent = `[IMAGE]${publicUrl}`;

      const { error } = await supabase.from("messages").insert([
        {
          sender_id: currentUserId,
          receiver_id: activeChat,
          content: messageContent,
        },
      ]);

      if (error) throw error;

      // Hantar notifikasi e-mel kepada penerima HANYA jika penerima OFFLINE dan aktifkan tetapan
      const isRecipientOnline = onlineUsers && onlineUsers.has(activeChat);
      if (!isRecipientOnline) {
        fetch("/api/send-message-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientId: activeChat,
            senderId: currentUserId,
            senderName: currentUserName,
            content: messageContent,
            origin: window.location.origin,
            isRecipientOnline: false,
          }),
        }).catch((err) =>
          console.error("Ralat menghantar notifikasi e-mel mesej:", err),
        );
      } else {
        console.log(
          `[CHAT] Penerima (${activeChat}) sedang ONLINE di dalam sistem. E-mel tidak dihantar.`,
        );
      }
    } catch (error) {
      alert(t("alertFailedUpload") + error.message);
    } finally {
      setUploadingImage(false);
      e.target.value = null; // Reset input
    }
  };

  const lastTypingBroadcast = useRef(0);
  const broadcastTyping = () => {
    const now = Date.now();
    if (now - lastTypingBroadcast.current < 1500) return; // Throttle: max once per 1.5s
    lastTypingBroadcast.current = now;
    if (typingChannelRef.current && currentUserId) {
      typingChannelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { userId: currentUserId },
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUserId) return;
    if (activeChat === currentUserId) {
      alert(t("cannotContactSelf") || "You cannot contact yourself.");
      return;
    }

    const messageContent = newMessage;
    setNewMessage("");

    try {
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: currentUserId,
          receiver_id: activeChat,
          content: messageContent,
        },
      ]);

      if (error) throw error;

      // Hantar notifikasi e-mel kepada penerima HANYA jika penerima OFFLINE dan aktifkan tetapan
      const isRecipientOnline = onlineUsers && onlineUsers.has(activeChat);
      if (!isRecipientOnline) {
        fetch("/api/send-message-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientId: activeChat,
            senderId: currentUserId,
            senderName: currentUserName,
            content: messageContent,
            origin: window.location.origin,
            isRecipientOnline: false,
          }),
        }).catch((err) =>
          console.error("Ralat menghantar notifikasi e-mel mesej:", err),
        );
      } else {
        console.log(
          `[CHAT] Penerima (${activeChat}) sedang ONLINE di dalam sistem. E-mel tidak dihantar.`,
        );
      }

      // Update the chat preview on the sidebar immediately
      setChats((prev) => {
        return prev.map((c) => {
          if (c.id === activeChat) {
            return { ...c, preview: messageContent, time: t("justNow") };
          }
          return c;
        });
      });
    } catch (error) {
      console.error("Error sending message:", error);
      alert(t("alertFailedSendMsg") + error.message);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const activeChatData = chats.find((c) => c.id === activeChat);

  return (
    <div className="page-bg-common bg-messages">
      <div
        className="messages-layout"
        style={{
          display: "flex",
          height: "calc(100vh - 150px)",
          background: "var(--surface)",
          borderRadius: "1rem",
          border: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <div
          className={`messages-sidebar ${activeChat ? "hidden-on-mobile" : ""}`}
          style={{
            width: "330px",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            background: "var(--surface)",
          }}
        >
          <div
            style={{
              padding: "1.1rem 1.15rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.85rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <MessageSquare
                  size={20}
                  style={{ color: "var(--primary)", flexShrink: 0 }}
                />
                <span>{t("messages")}</span>
              </h2>
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "999px",
                  background: "rgba(99, 102, 241, 0.14)",
                  color: "var(--primary)",
                }}
              >
                {filteredChats.length}
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <Search
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                className="input-field"
                placeholder={t("searchName")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  fontSize: "0.85rem",
                  padding: "0.55rem 0.85rem 0.55rem 36px",
                  borderRadius: "999px",
                  background: "var(--background)",
                }}
              />
            </div>
          </div>

          <div style={{ overflowY: "auto", flex: 1 }}>
            {filteredChats.length === 0 ? (
              <div
                style={{
                  padding: "3rem 1.5rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.65rem",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    background: "rgba(99, 102, 241, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                  }}
                >
                  <MessageSquare size={24} />
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--text-main)",
                  }}
                >
                  {t("noConversations")}
                </p>
                <span style={{ fontSize: "0.78rem", lineHeight: 1.45 }}>
                  {isMs
                    ? "Tekan 'Hubungi Pelapor' pada mana-mana kad barang untuk memulakan sembang."
                    : "Tap 'Contact Reporter' on any item card to start a conversation."}
                </span>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const isSelected = activeChat === chat.id;
                const hasUnread = chat.unreadCount > 0 && !isSelected;
                return (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    style={{
                      padding: "0.85rem 1rem",
                      borderBottom: "1px solid var(--glass-border)",
                      borderLeft: isSelected
                        ? "3px solid var(--primary)"
                        : "3px solid transparent",
                      background: isSelected
                        ? "rgba(99, 102, 241, 0.1)"
                        : hasUnread
                          ? "rgba(99, 102, 241, 0.04)"
                          : "transparent",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.85rem",
                      transition: "background 0.2s ease",
                    }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid var(--border)",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewingProfile({
                            id: chat.id,
                            name: chat.name,
                            avatar: chat.avatar,
                          });
                        }}
                      />
                      {onlineUsers.has(chat.id) && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: 1,
                            right: 1,
                            width: "12px",
                            height: "12px",
                            background: "#10B981",
                            border: "2px solid var(--surface)",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.2rem",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: hasUnread || isSelected ? 700 : 600,
                            fontSize: "0.92rem",
                            color: "var(--text-main)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {chat.name}
                        </span>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            color: hasUnread
                              ? "var(--primary)"
                              : "var(--text-muted)",
                            fontWeight: hasUnread ? 600 : 400,
                            flexShrink: 0,
                          }}
                        >
                          {chat.time}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "0.82rem",
                            color: hasUnread
                              ? "var(--text-main)"
                              : "var(--text-muted)",
                            fontWeight: hasUnread ? 600 : 400,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            flex: 1,
                          }}
                        >
                          {chat.preview?.startsWith("[IMAGE]")
                            ? isMs
                              ? "📷 Gambar"
                              : "📷 Image"
                            : chat.preview}
                        </p>
                        {hasUnread && (
                          <span
                            className="unread-badge-pulse"
                            style={{
                              background: "#EF4444",
                              color: "white",
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              minWidth: "18px",
                              height: "18px",
                              borderRadius: "9px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "0 5px",
                              flexShrink: 0,
                            }}
                          >
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`messages-chat-area ${!activeChat ? "hidden-on-mobile" : ""}`}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "var(--background)",
            minWidth: 0,
          }}
        >
          {!activeChatData ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem",
                textAlign: "center",
                color: "var(--text-muted)",
                gap: "0.75rem",
              }}
            >
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  background: "rgba(99, 102, 241, 0.12)",
                  border: "1px solid rgba(99, 102, 241, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  marginBottom: "0.25rem",
                }}
              >
                <MessageSquare size={30} />
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-main)",
                  margin: 0,
                }}
              >
                {t("selectConversation")}
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  maxWidth: "340px",
                  lineHeight: 1.5,
                }}
              >
                {isMs
                  ? "Perbualan 1-ke-1 anda dilindungi secara peribadi di dalam sistem tanpa perlu berkongsi nombor telefon."
                  : "Your 1-to-1 conversations are privately protected inside the platform without sharing phone numbers."}
              </p>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#10B981",
                  background: "rgba(16, 185, 129, 0.1)",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                }}
              >
                <ShieldCheck size={14} />
                {isMs ? "Sembang Selamat Kampus" : "Secure Campus Chat"}
              </span>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div
                className="chat-header-bar"
                style={{
                  padding: "0.85rem 1.15rem",
                  borderBottom: "1px solid var(--border)",
                  background: "var(--surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <button
                    className="mobile-only-btn"
                    onClick={() => setActiveChat(null)}
                    aria-label="Kembali"
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      color: "var(--text-main)",
                      cursor: "pointer",
                      width: "36px",
                      height: "36px",
                      minWidth: "36px",
                      minHeight: "36px",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      touchAction: "manipulation",
                      flexShrink: 0,
                    }}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={activeChatData.avatar}
                      alt="Avatar"
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                        border: "2px solid var(--border)",
                        display: "block",
                      }}
                      onClick={() =>
                        setViewingProfile({
                          id: activeChatData.id,
                          name: activeChatData.name,
                          avatar: activeChatData.avatar,
                        })
                      }
                    />
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "11px",
                        height: "11px",
                        borderRadius: "50%",
                        background: onlineUsers.has(activeChatData.id)
                          ? "#10B981"
                          : "#9CA3AF",
                        border: "2px solid var(--surface)",
                      }}
                    />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3
                      style={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "var(--text-main)",
                        margin: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {activeChatData.name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 500,
                          color: onlineUsers.has(activeChatData.id)
                            ? "#10B981"
                            : "var(--text-muted)",
                        }}
                      >
                        {onlineUsers.has(activeChatData.id)
                          ? t("online")
                          : t("offline")}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ flexShrink: 0 }}>
                  <button
                    className="btn-primary"
                    onClick={() => setShowReportModal(true)}
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.35)",
                      color: "#EF4444",
                      padding: "0.4rem 0.7rem",
                      borderRadius: "0.55rem",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <AlertCircle size={14} />
                    <span>{t("reportUser")}</span>
                  </button>
                </div>
              </div>

              {/* Messages List */}
              <div
                className="chat-messages-scroll"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1.1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                {messages.length === 0 ? (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      maxWidth: "84%",
                    }}
                  >
                    <img
                      src={activeChatData.avatar}
                      alt="Avatar"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setViewingProfile({
                          id: activeChatData.id,
                          name: activeChatData.name,
                          avatar: activeChatData.avatar,
                        })
                      }
                    />
                    <div>
                      <div
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          padding: "0.75rem 1rem",
                          borderRadius: "0.2rem 1rem 1rem 1rem",
                          color: "var(--text-main)",
                          fontSize: "0.88rem",
                          lineHeight: 1.45,
                        }}
                      >
                        {activeChatData.preview}
                      </div>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          color: "var(--text-muted)",
                          marginTop: "0.2rem",
                          display: "block",
                        }}
                      >
                        {t("justNow")}
                      </span>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.sender_id === currentUserId;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          gap: "0.65rem",
                          maxWidth: "82%",
                          alignSelf: isMe ? "flex-end" : "flex-start",
                          flexDirection: isMe ? "row-reverse" : "row",
                        }}
                      >
                        <img
                          src={
                            isMe
                              ? currentUserAvatar ||
                                `https://ui-avatars.com/api/?name=Me&background=6366f1&color=fff`
                              : activeChatData.avatar
                          }
                          alt="Avatar"
                          style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "50%",
                            flexShrink: 0,
                            objectFit: "cover",
                            cursor: isMe ? "default" : "pointer",
                            marginTop: "0.15rem",
                          }}
                          onClick={() => {
                            if (!isMe)
                              setViewingProfile({
                                id: activeChatData.id,
                                name: activeChatData.name,
                                avatar: activeChatData.avatar,
                              });
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: isMe ? "flex-end" : "flex-start",
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              background:
                                isMe && !msg.content.startsWith("[IMAGE]")
                                  ? "linear-gradient(135deg, var(--primary), #4f46e5)"
                                  : "var(--surface)",
                              color: isMe ? "#fff" : "var(--text-main)",
                              border:
                                isMe && !msg.content.startsWith("[IMAGE]")
                                  ? "none"
                                  : "1px solid var(--border)",
                              padding: msg.content.startsWith("[IMAGE]")
                                ? "0.25rem"
                                : "0.65rem 0.95rem",
                              borderRadius: isMe
                                ? "1rem 0.25rem 1rem 1rem"
                                : "0.25rem 1rem 1rem 1rem",
                              fontSize: "0.88rem",
                              lineHeight: 1.45,
                              wordBreak: "break-word",
                              overflow: "hidden",
                              boxShadow: isMe
                                ? "0 4px 12px rgba(99, 102, 241, 0.22)"
                                : "0 2px 6px rgba(0, 0, 0, 0.08)",
                            }}
                          >
                            {msg.content.startsWith("[IMAGE]") ? (
                              <a
                                href={msg.content.substring(7)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <img
                                  src={msg.content.substring(7)}
                                  alt="Sent image"
                                  style={{
                                    maxWidth: "210px",
                                    maxHeight: "210px",
                                    borderRadius: "0.75rem",
                                    display: "block",
                                    cursor: "zoom-in",
                                    objectFit: "cover",
                                  }}
                                />
                              </a>
                            ) : (
                              msg.content
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: "0.66rem",
                              color: "var(--text-muted)",
                              marginTop: "0.2rem",
                              padding: "0 0.2rem",
                            }}
                          >
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                {isOtherTyping && activeChatData && (
                  <TypingIndicator avatar={activeChatData.avatar} />
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: "0.75rem 0.95rem",
                  background: "var(--surface)",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                }}
              >
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <input
                    type="file"
                    accept="image/*"
                    id="chat-image-upload"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("chat-image-upload").click()
                    }
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "50%",
                      width: "40px",
                      height: "40px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      touchAction: "manipulation",
                    }}
                    disabled={uploadingImage}
                    title={isMs ? "Hantar Gambar" : "Send Image"}
                  >
                    {uploadingImage ? (
                      <span
                        className="spinner"
                        style={{ width: "16px", height: "16px" }}
                      />
                    ) : (
                      <ImageIcon size={19} />
                    )}
                  </button>
                </div>
                <input
                  type="text"
                  className="input-field"
                  placeholder={
                    uploadingImage
                      ? t("uploadingImagePlaceholder")
                      : t("typeMessagePlaceholder")
                  }
                  style={{
                    flex: 1,
                    borderRadius: "999px",
                    padding: "0.65rem 1rem",
                    background: "var(--background)",
                  }}
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    broadcastTyping();
                  }}
                  disabled={uploadingImage}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    borderRadius: "999px",
                    padding: "0.65rem 1.1rem",
                    whiteSpace: "nowrap",
                    touchAction: "manipulation",
                    flexShrink: 0,
                  }}
                  disabled={!newMessage.trim() || uploadingImage}
                >
                  <Send size={16} />
                  <span className="hide-on-mobile">{t("send")}</span>
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Report User Modal with Screenshot Proof */}
      {showReportModal && activeChatData && (
        <div
          className="modal-backdrop"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            className="glass-panel modal-bounce"
            style={{
              width: "100%",
              maxWidth: "500px",
              background: "var(--surface)",
              borderRadius: "1rem",
              boxShadow: "var(--shadow-lg)",
              border: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  color: "var(--text-main)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <AlertCircle size={20} color="#EF4444" />
                {t("reportUser")}: {activeChatData.name}
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleReportSubmit}
              style={{
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {/* Report Type */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "var(--text-main)",
                  }}
                >
                  {t("reportType")} <span style={{ color: "#EF4444" }}>*</span>
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="input-field"
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value="Spam">{t("spam") || "Spam"}</option>
                  <option value="Scammer">{t("scammer") || "Scammer"}</option>
                  <option value="Inappropriate">
                    {t("inappropriate") || "Inappropriate Content"}
                  </option>
                  <option value="Harassment">
                    {t("harassment") || "Harassment"}
                  </option>
                  <option value="Others">{t("typeOthers") || "Others"}</option>
                </select>
              </div>

              {/* Reason / Details */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "var(--text-main)",
                  }}
                >
                  {t("description")} / {t("typeReason")}
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder={
                    t("typeReason") ||
                    "Provide additional context or details..."
                  }
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.6rem 0.75rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* Screenshot Upload Notice & Input */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "var(--text-main)",
                  }}
                >
                  {t("uploadScreenshot")}{" "}
                  <span style={{ color: "#EF4444" }}>*</span>
                </label>

                <div
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px dashed rgba(239, 68, 68, 0.3)",
                    borderRadius: "0.5rem",
                    marginBottom: "0.75rem",
                    fontSize: "0.8rem",
                    color: "#DC2626",
                    lineHeight: "1.4",
                  }}
                >
                  🛡️{" "}
                  {t("screenshotNotice") ||
                    "Sila muat naik tangkapan skrin bukti supaya pentadbir dapat mengesahkan laporan dan mengelakkan penipuan."}
                </div>

                {!reportFilePreview ? (
                  <label
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "1.25rem",
                      border: "2px dashed var(--border)",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      background: "var(--bg-main)",
                      transition: "all 0.2s",
                    }}
                  >
                    <Upload
                      size={24}
                      style={{
                        color: "var(--primary)",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-main)",
                        fontWeight: 500,
                      }}
                    >
                      {t("uploadScreenshot")}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginTop: "0.25rem",
                      }}
                    >
                      PNG, JPG, WEBP (Max 5MB)
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleReportScreenshotSelect}
                      style={{ display: "none" }}
                    />
                  </label>
                ) : (
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      border: "1px solid var(--border)",
                      maxHeight: "180px",
                      display: "flex",
                      justifyContent: "center",
                      background: "#000",
                    }}
                  >
                    <img
                      src={reportFilePreview}
                      alt="Screenshot proof preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "180px",
                        objectFit: "contain",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setReportFile(null);
                        setReportFilePreview(null);
                      }}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(0,0,0,0.7)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        padding: "4px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  justifyContent: "flex-end",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  disabled={submittingReport}
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "0.5rem",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-main)",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                  }}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={submittingReport || !reportFile}
                  className="btn-primary"
                  style={{
                    padding: "0.6rem 1.25rem",
                    borderRadius: "0.5rem",
                    background: "#EF4444",
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor:
                      submittingReport || !reportFile
                        ? "not-allowed"
                        : "pointer",
                    opacity: submittingReport || !reportFile ? 0.6 : 1,
                    border: "none",
                  }}
                >
                  {submittingReport
                    ? t("loading") || "Submitting..."
                    : t("submitReport") || "Hantar Laporan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Profile Modal */}
      {viewingProfile && (
        <UserProfileModal
          profile={viewingProfile}
          onClose={() => setViewingProfile(null)}
          t={t}
        />
      )}
    </div>
  );
}
