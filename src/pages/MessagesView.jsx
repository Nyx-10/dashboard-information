import React, { useState, useContext, useEffect, useRef } from 'react';
import { Search, AlertCircle, Image as ImageIcon, Upload, X, Check } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';

function TypingIndicator({ avatar }) {
  return (
    <div className="typing-indicator">
      <img src={avatar} alt="Typing" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
      <div className="typing-dots">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </div>
  );
}

export function MessagesView({ initialChatUser, onMessagesRead, onlineUsers = new Set() }) {
  const { t } = useContext(LanguageContext);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('Spam');
  const [reportReason, setReportReason] = useState('');
  const [reportFile, setReportFile] = useState(null);
  const [reportFilePreview, setReportFilePreview] = useState(null);
  const [submittingReport, setSubmittingReport] = useState(false);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(initialChatUser ? initialChatUser.id : null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const typingChannelRef = useRef(null);

  const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setCurrentUserId(user.id);
        const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single();
        if (profile?.avatar_url) {
          setCurrentUserAvatar(profile.avatar_url);
        }
        fetchChats(user.id);
      }
    });
  }, []);

  const fetchChats = async (userId) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        sender_id, receiver_id, content, created_at, is_read,
        sender:profiles!messages_sender_id_fkey(username, avatar_url),
        receiver:profiles!messages_receiver_id_fkey(username, avatar_url)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const chatMap = new Map();

      data.forEach(msg => {
        const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        if (otherId === userId) return; // Prevent self-contact
        
        if (!chatMap.has(otherId)) {
          const otherProfile = msg.sender_id === userId ? msg.receiver : msg.sender;
          const otherName = otherProfile?.username || 'User';
          const otherAvatar = otherProfile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherName)}&background=4F46E5&color=fff`;

          chatMap.set(otherId, {
            id: otherId,
            name: otherName,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            preview: msg.content,
            avatar: otherAvatar,
            unreadCount: 0
          });
        }
        
        // Kira mesej unread
        if (msg.receiver_id === userId && msg.is_read === false) {
          const chat = chatMap.get(otherId);
          chat.unreadCount += 1;
        }
      });

      let chatList = Array.from(chatMap.values());
      
      if (initialChatUser && initialChatUser.id !== userId && !chatMap.has(initialChatUser.id)) {
        chatList = [{
          id: initialChatUser.id,
          name: initialChatUser.name,
          time: t('justNow'),
          preview: initialChatUser.preview || '...',
          avatar: initialChatUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(initialChatUser.name)}&background=4F46E5&color=fff`,
          unreadCount: 0
        }, ...chatList];
      }

      setChats(chatList);
    } else if (initialChatUser && initialChatUser.id !== userId) {
      setChats([{
        id: initialChatUser.id,
        name: initialChatUser.name,
        time: t('justNow'),
        preview: initialChatUser.preview || '...',
        avatar: initialChatUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(initialChatUser.name)}&background=4F46E5&color=fff`,
        unreadCount: 0
      }]);
    }
  };

  useEffect(() => {
    if (initialChatUser && currentUserId) {
      if (initialChatUser.id === currentUserId) {
        if (activeChat === currentUserId) setActiveChat(null);
        return;
      }
      setActiveChat(initialChatUser.id);
      if (initialChatUser.preview && initialChatUser.preview !== '...') {
        setNewMessage(`[ ${initialChatUser.preview} ] - `);
      }
    }
  }, [initialChatUser, currentUserId]);

  useEffect(() => {
    if (activeChat && currentUserId) {
      fetchMessages(currentUserId, activeChat);
      setIsOtherTyping(false);
      
      const channel = supabase.channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          const newMsg = payload.new;
          if (
            (newMsg.sender_id === currentUserId && newMsg.receiver_id === activeChat) ||
            (newMsg.sender_id === activeChat && newMsg.receiver_id === currentUserId)
          ) {
            // Jika mesej masuk dari orang lain sewaktu chat sedang aktif, tanda sebagai 'read' terus
            if (newMsg.sender_id === activeChat) {
              supabase.from('messages').update({ is_read: true }).eq('id', newMsg.id).then();
              setIsOtherTyping(false); // Stop typing indicator when message arrives
            }
            setMessages(prev => [...prev, newMsg]);
            scrollToBottom();
          } else if (newMsg.receiver_id === currentUserId) {
            // Mesej dari orang lain yang tiada di chat aktif, update unread count
            setChats(prev => prev.map(c => c.id === newMsg.sender_id ? { ...c, unreadCount: (c.unreadCount || 0) + 1 } : c));
          }
        })
        .subscribe();

      // Typing indicator channel
      const sortedIds = [currentUserId, activeChat].sort();
      const typingChannel = supabase.channel(`typing:${sortedIds[0]}:${sortedIds[1]}`)
        .on('broadcast', { event: 'typing' }, ({ payload }) => {
          if (payload.userId !== currentUserId) {
            setIsOtherTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 2500);
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
      setChats(prev => {
        if (prev.some(c => c.id === activeChat && c.unreadCount > 0)) {
          return prev.map(c => c.id === activeChat ? { ...c, unreadCount: 0 } : c);
        }
        return prev;
      });
    }
  }, [activeChat, chats]);

  const fetchMessages = async (userId, otherUserId) => {
    // 1. Mark semue mesej dari otherUserId sebagai 'read'
    await supabase.from('messages')
      .update({ is_read: true })
      .eq('sender_id', otherUserId)
      .eq('receiver_id', userId)
      .eq('is_read', false);

    // 2. Clear unreadCount di sidebar untuk chat ini
    setChats(prev => prev.map(c => c.id === otherUserId ? { ...c, unreadCount: 0 } : c));
    if (onMessagesRead) onMessagesRead();

    // 3. Fetch mesej
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
      scrollToBottom();
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReportScreenshotSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert(t('alertInvalidFile') || 'Please upload image files only.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(t('alertFileSize') || 'File size exceeds 5MB limit.');
      return;
    }
    setReportFile(file);
    setReportFilePreview(URL.createObjectURL(file));
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId || !activeChatData) return;
    if (!reportFile) {
      alert(t('screenshotRequired') || 'Please upload a screenshot proof before submitting.');
      return;
    }

    setSubmittingReport(true);
    try {
      let imageUrl = '';
      const fileExt = reportFile.name.split('.').pop();
      const fileName = `report-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(fileName, reportFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(fileName);
        
      imageUrl = publicUrl;

      const { error } = await supabase.from('user_reports').insert([{
        reporter_id: currentUserId,
        reported_id: activeChatData.id,
        report_type: reportType,
        reason_text: reportReason,
        image_url: imageUrl,
        status: 'Pending'
      }]);

      if (error) throw error;

      alert(t('alertSuccessReport') || 'Report submitted successfully.');
      setShowReportModal(false);
      setReportType('Spam');
      setReportReason('');
      setReportFile(null);
      setReportFilePreview(null);
    } catch (err) {
      console.error(err);
      alert((t('alertFailedReport') || 'Failed to submit report: ') + err.message);
    } finally {
      setSubmittingReport(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat || !currentUserId) return;
    if (activeChat === currentUserId) {
      alert(t('cannotContactSelf') || 'You cannot contact yourself.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert(t('alertInvalidFile') || 'Please upload image files only.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert(t('alertFileSize') || 'File size exceeds 5MB limit.');
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `chat-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(fileName, file);

      if (uploadError) throw new Error(uploadError.message);

      const { data: { publicUrl } } = supabase.storage
        .from('item-images')
        .getPublicUrl(fileName);
        
      const messageContent = `[IMAGE]${publicUrl}`;
      
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: currentUserId,
          receiver_id: activeChat,
          content: messageContent
        }]);

      if (error) throw error;
    } catch (error) {
      alert(t('alertFailedUpload') + error.message);
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
        type: 'broadcast',
        event: 'typing',
        payload: { userId: currentUserId }
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUserId) return;
    if (activeChat === currentUserId) {
      alert(t('cannotContactSelf') || 'You cannot contact yourself.');
      return;
    }

    const messageContent = newMessage;
    setNewMessage('');

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          sender_id: currentUserId,
          receiver_id: activeChat,
          content: messageContent
        }]);

      if (error) throw error;
      
      // Update the chat preview on the sidebar immediately
      setChats(prev => {
        return prev.map(c => {
          if (c.id === activeChat) {
            return { ...c, preview: messageContent, time: t('justNow') };
          }
          return c;
        });
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t('alertFailedSendMsg') + error.message);
    }
  };

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const activeChatData = chats.find(c => c.id === activeChat);

  return (
    <div className="page-bg-common bg-messages">
      <div className="messages-layout" style={{ display: 'flex', height: 'calc(100vh - 150px)', background: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div className={`messages-sidebar ${activeChat ? 'hidden-on-mobile' : ''}`} style={{ width: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>{t('messages')}</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder={t('searchName')} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.875rem', padding: '0.5rem 0.5rem 0.5rem 32px' }} 
            />
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filteredChats.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {t('noConversations')}
            </div>
          ) : (
            filteredChats.map(chat => (
              <div 
                key={chat.id} 
                onClick={() => setActiveChat(chat.id)}
                style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid var(--border)', 
                  background: activeChat === chat.id ? 'rgba(99, 102, 241, 0.05)' : 'transparent', 
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '1rem'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img 
                    src={chat.avatar} 
                    alt={chat.name} 
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                    onClick={(e) => { e.stopPropagation(); setViewingProfile({ name: chat.name, avatar: chat.avatar }); }}
                  />
                  {onlineUsers.has(chat.id) && (
                    <span style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#10B981', border: '2px solid var(--surface)', borderRadius: '50%' }}></span>
                  )}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{chat.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{chat.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '0.875rem', color: chat.unreadCount > 0 && chat.id !== activeChat ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: chat.unreadCount > 0 && chat.id !== activeChat ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                      {chat.preview?.startsWith('[IMAGE]') ? '📷 Image' : chat.preview}
                    </p>
                    {chat.unreadCount > 0 && chat.id !== activeChat && (
                      <span className="unread-badge-pulse" style={{ background: '#EF4444', color: 'white', fontSize: '0.7rem', fontWeight: 700, minWidth: '18px', height: '18px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px', marginLeft: '8px' }}>
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`messages-chat-area ${!activeChat ? 'hidden-on-mobile' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
        {!activeChatData ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <p>{t('selectConversation')}</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button className="mobile-only-btn" onClick={() => setActiveChat(null)} style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer', marginRight: '-0.5rem' }}>
                  &larr;
                </button>
                <img 
                  src={activeChatData.avatar} 
                  alt="Avatar" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }} 
                  onClick={() => setViewingProfile({ name: activeChatData.name, avatar: activeChatData.avatar })}
                />
                <div>
                  <h3 style={{ fontWeight: 600, color: 'var(--text-main)' }}>{activeChatData.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ 
                      width: '8px', height: '8px', borderRadius: '50%', 
                      background: onlineUsers.has(activeChatData.id) ? '#10B981' : '#9CA3AF' 
                    }}></span>
                    <span style={{ fontSize: '0.75rem', color: onlineUsers.has(activeChatData.id) ? '#10B981' : 'var(--text-muted)' }}>
                      {onlineUsers.has(activeChatData.id) ? (t('online') === 'online' ? 'Online' : t('online')) : (t('offline') === 'offline' ? 'Offline' : t('offline'))}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <button 
                  className="btn-primary" 
                  onClick={() => setShowReportModal(true)} 
                  style={{ background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', padding: '0.4rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
                >
                  <AlertCircle size={14} /> {t('reportUser')}
                </button>
              </div>
            </div>
            
            {/* Messages List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {messages.length === 0 ? (
                <div style={{ display: 'flex', gap: '1rem', maxWidth: '80%' }}>
                  <img 
                    src={activeChatData.avatar} 
                    alt="Avatar" 
                    style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover', cursor: 'pointer' }} 
                    onClick={() => setViewingProfile({ name: activeChatData.name, avatar: activeChatData.avatar })}
                  />
                  <div>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '0 1rem 1rem 1rem', color: 'var(--text-main)' }}>
                      {activeChatData.preview}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>{t('justNow')}</span>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isMe = msg.sender_id === currentUserId;
                  return (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', maxWidth: '80%', alignSelf: isMe ? 'flex-end' : 'flex-start', flexDirection: isMe ? 'row-reverse' : 'row' }}>
                      <img 
                        src={isMe ? (currentUserAvatar || `https://ui-avatars.com/api/?name=Me&background=6366f1&color=fff`) : activeChatData.avatar} 
                        alt="Avatar" 
                        style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, objectFit: 'cover', cursor: isMe ? 'default' : 'pointer' }} 
                        onClick={() => { if (!isMe) setViewingProfile({ name: activeChatData.name, avatar: activeChatData.avatar }); }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{ 
                          background: (isMe && !msg.content.startsWith('[IMAGE]')) ? 'var(--primary)' : 'var(--surface)', 
                          color: isMe ? '#fff' : 'var(--text-main)', 
                          border: isMe && !msg.content.startsWith('[IMAGE]') ? 'none' : '1px solid var(--border)', 
                          padding: msg.content.startsWith('[IMAGE]') ? '0.25rem' : '0.75rem 1rem', 
                          borderRadius: isMe ? '1rem 0 1rem 1rem' : '0 1rem 1rem 1rem',
                          wordBreak: 'break-word',
                          overflow: 'hidden'
                        }}>
                          {msg.content.startsWith('[IMAGE]') ? (
                            <a href={msg.content.substring(7)} target="_blank" rel="noopener noreferrer">
                              <img src={msg.content.substring(7)} alt="Sent image" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '0.75rem', display: 'block', cursor: 'zoom-in', objectFit: 'cover' }} />
                            </a>
                          ) : (
                            msg.content
                          )}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            <form onSubmit={handleSendMessage} style={{ padding: '1.25rem', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  id="chat-image-upload" 
                  style={{ display: 'none' }} 
                  onChange={handleImageUpload} 
                />
                <button 
                  type="button" 
                  onClick={() => document.getElementById('chat-image-upload').click()} 
                  style={{ background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
                  disabled={uploadingImage}
                >
                  {uploadingImage ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : <ImageIcon size={20} />}
                </button>
              </div>
              <input 
                type="text" 
                className="input-field" 
                placeholder={uploadingImage ? "Uploading image..." : "Type a message..."}
                style={{ flex: 1, borderRadius: '2rem' }} 
                value={newMessage}
                onChange={e => { setNewMessage(e.target.value); broadcastTyping(); }}
                disabled={uploadingImage}
              />
              <button type="submit" className="btn-primary" style={{ borderRadius: '2rem', padding: '0.5rem 1.5rem' }} disabled={!newMessage.trim() || uploadingImage}>
                {t('send')}
              </button>
            </form>
          </>
        )}
      </div>
    </div>

      {/* Report User Modal with Screenshot Proof */}
      {showReportModal && activeChatData && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-panel modal-bounce" style={{
            width: '100%',
            maxWidth: '500px',
            background: 'var(--surface)',
            borderRadius: '1rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={20} color="#EF4444" />
                {t('reportUser')}: {activeChatData.name}
              </h3>
              <button 
                onClick={() => setShowReportModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleReportSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Report Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  {t('reportType')} <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="input-field"
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem' }}
                >
                  <option value="Spam">{t('spam') || 'Spam'}</option>
                  <option value="Scammer">{t('scammer') || 'Scammer'}</option>
                  <option value="Inappropriate">{t('inappropriate') || 'Inappropriate Content'}</option>
                  <option value="Harassment">{t('harassment') || 'Harassment'}</option>
                  <option value="Others">{t('typeOthers') || 'Others'}</option>
                </select>
              </div>

              {/* Reason / Details */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  {t('description')} / {t('typeReason')}
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder={t('typeReason') || 'Provide additional context or details...'}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', resize: 'vertical' }}
                />
              </div>

              {/* Screenshot Upload Notice & Input */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                  {t('uploadScreenshot')} <span style={{ color: '#EF4444' }}>*</span>
                </label>

                <div style={{
                  padding: '0.75rem 1rem',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px dashed rgba(239, 68, 68, 0.3)',
                  borderRadius: '0.5rem',
                  marginBottom: '0.75rem',
                  fontSize: '0.8rem',
                  color: '#DC2626',
                  lineHeight: '1.4'
                }}>
                  🛡️ {t('screenshotNotice') || 'Sila muat naik tangkapan skrin bukti supaya pentadbir dapat mengesahkan laporan dan mengelakkan penipuan.'}
                </div>

                {!reportFilePreview ? (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.25rem',
                    border: '2px dashed var(--border)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    background: 'var(--bg-main)',
                    transition: 'all 0.2s'
                  }}>
                    <Upload size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 500 }}>{t('uploadScreenshot')}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>PNG, JPG, WEBP (Max 5MB)</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleReportScreenshotSelect} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                ) : (
                  <div style={{ position: 'relative', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border)', maxHeight: '180px', display: 'flex', justifyContent: 'center', background: '#000' }}>
                    <img src={reportFilePreview} alt="Screenshot proof preview" style={{ maxWidth: '100%', maxHeight: '180px', objectFit: 'contain' }} />
                    <button
                      type="button"
                      onClick={() => { setReportFile(null); setReportFilePreview(null); }}
                      style={{
                        position: 'absolute', top: '8px', right: '8px',
                        background: 'rgba(0,0,0,0.7)', color: 'white',
                        border: 'none', borderRadius: '50%', padding: '4px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  disabled={submittingReport}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    color: 'var(--text-main)',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submittingReport || !reportFile}
                  className="btn-primary"
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '0.5rem',
                    background: '#EF4444',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: (submittingReport || !reportFile) ? 'not-allowed' : 'pointer',
                    opacity: (submittingReport || !reportFile) ? 0.6 : 1,
                    border: 'none'
                  }}
                >
                  {submittingReport ? (t('loading') || 'Submitting...') : (t('submitReport') || 'Hantar Laporan')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Avatar Profile Modal */}
      {viewingProfile && (
        <div className="modal-backdrop" onClick={() => setViewingProfile(null)}>
          <div className="modal-content modal-bounce" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', padding: '2.5rem 2rem', maxWidth: '350px', position: 'relative' }}>
            <button className="modal-close" onClick={() => setViewingProfile(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <a href={viewingProfile.avatar} target="_blank" rel="noopener noreferrer">
               <img src={viewingProfile.avatar} alt={viewingProfile.name} style={{ width: '180px', height: '180px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.5rem', display: 'block', cursor: 'zoom-in', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }} />
            </a>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{viewingProfile.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('clickImageToViewLarge') || 'Klik gambar untuk papar penuh'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
