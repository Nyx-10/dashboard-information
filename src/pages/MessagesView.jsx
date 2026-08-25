import React, { useState, useContext, useEffect, useRef } from 'react';
import { Search, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';
import { supabase } from '../supabaseClient';

export function MessagesView({ initialChatUser }) {
  const { t } = useContext(LanguageContext);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherReason, setOtherReason] = useState('');

  const [currentUserId, setCurrentUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(initialChatUser ? initialChatUser.id : null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setCurrentUserId(user.id);
        fetchChats(user.id);
      }
    });
  }, []);

  const fetchChats = async (userId) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        sender_id, receiver_id, content, created_at,
        sender:profiles!messages_sender_id_fkey(username),
        receiver:profiles!messages_receiver_id_fkey(username)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const chatMap = new Map();

      data.forEach(msg => {
        const otherId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        if (!chatMap.has(otherId)) {
          const otherName = msg.sender_id === userId ? (msg.receiver?.username || 'User') : (msg.sender?.username || 'User');
          chatMap.set(otherId, {
            id: otherId,
            name: otherName,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            preview: msg.content,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(otherName)}&background=4F46E5&color=fff`
          });
        }
      });

      let chatList = Array.from(chatMap.values());
      
      if (initialChatUser && !chatMap.has(initialChatUser.id)) {
        chatList = [{
          id: initialChatUser.id,
          name: initialChatUser.name,
          time: t('justNow'),
          preview: initialChatUser.preview || '...',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(initialChatUser.name)}&background=4F46E5&color=fff`
        }, ...chatList];
      }

      setChats(chatList);
    } else if (initialChatUser) {
      setChats([{
        id: initialChatUser.id,
        name: initialChatUser.name,
        time: t('justNow'),
        preview: initialChatUser.preview || '...',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(initialChatUser.name)}&background=4F46E5&color=fff`
      }]);
    }
  };

  useEffect(() => {
    if (initialChatUser && currentUserId) {
      setActiveChat(initialChatUser.id);
      if (initialChatUser.preview && initialChatUser.preview !== '...') {
        setNewMessage(`[ ${initialChatUser.preview} ] - `);
      }
    }
  }, [initialChatUser, currentUserId]);

  useEffect(() => {
    if (activeChat && currentUserId) {
      fetchMessages(currentUserId, activeChat);
      
      const channel = supabase.channel('public:messages')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload => {
          const newMsg = payload.new;
          if (
            (newMsg.sender_id === currentUserId && newMsg.receiver_id === activeChat) ||
            (newMsg.sender_id === activeChat && newMsg.receiver_id === currentUserId)
          ) {
            setMessages(prev => [...prev, newMsg]);
            scrollToBottom();
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeChat, currentUserId]);

  const fetchMessages = async (userId, otherUserId) => {
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeChat || !currentUserId) return;

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
      alert('Failed to upload image: ' + error.message);
    } finally {
      setUploadingImage(false);
      e.target.value = null; // Reset input
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUserId) return;

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
      alert('Failed to send message: ' + error.message);
    }
  };

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const activeChatData = chats.find(c => c.id === activeChat);

  return (
    <div className="page-bg-common bg-messages">
      <div style={{ display: 'flex', height: 'calc(100vh - 150px)', background: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
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
                <img src={chat.avatar} alt={chat.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{chat.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{chat.time}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.preview?.startsWith('[IMAGE]') ? '📷 Image' : chat.preview}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
        {!activeChatData ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <p>{t('selectConversation')}</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={activeChatData.avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div>
                  <h3 style={{ fontWeight: 600, color: 'var(--text-main)' }}>{activeChatData.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{t('online')}</span>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <button className="btn-primary" onClick={() => { setShowReportMenu(!showReportMenu); setShowOtherInput(false); setOtherReason(''); }} style={{ background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                  <AlertCircle size={14} /> {t('reportUser')}
                </button>
                {showReportMenu && (
                  <div className="glass-panel" style={{ position: 'absolute', right: 0, top: '120%', width: '200px', zIndex: 10, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.25rem 0.5rem', textTransform: 'uppercase' }}>{t('reportType')}</div>
                    {!showOtherInput ? (
                      <>
                        <button style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)', borderRadius: '0.25rem' }} className="nav-link" onClick={() => { alert(`Reported as ${t('spam')}`); setShowReportMenu(false); }}>{t('spam')}</button>
                        <button style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)', borderRadius: '0.25rem' }} className="nav-link" onClick={() => { alert(`Reported as ${t('scammer')}`); setShowReportMenu(false); }}>{t('scammer')}</button>
                        <button style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)', borderRadius: '0.25rem' }} className="nav-link" onClick={() => { alert(`Reported as ${t('inappropriate')}`); setShowReportMenu(false); }}>{t('inappropriate')}</button>
                        <button style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)', borderRadius: '0.25rem' }} className="nav-link" onClick={() => { alert(`Reported as ${t('harassment')}`); setShowReportMenu(false); }}>{t('harassment')}</button>
                        <button style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)', borderRadius: '0.25rem' }} className="nav-link" onClick={() => setShowOtherInput(true)}>{t('typeOthers')}</button>
                      </>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.25rem' }}>
                        <textarea 
                          placeholder={t('typeReason')} 
                          style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', resize: 'vertical', minHeight: '60px' }}
                          value={otherReason}
                          onChange={(e) => setOtherReason(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-primary" style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)' }} onClick={() => { setShowOtherInput(false); setOtherReason(''); }}>{t('cancel')}</button>
                          <button className="btn-primary" style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem' }} onClick={() => { if(otherReason.trim()){ alert(`Reported: ${otherReason}`); setShowReportMenu(false); setShowOtherInput(false); setOtherReason(''); } }}>{t('submit')}</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Messages List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {messages.length === 0 ? (
                <div style={{ display: 'flex', gap: '1rem', maxWidth: '80%' }}>
                  <img src={activeChatData.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
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
                      <img src={isMe ? `https://ui-avatars.com/api/?name=Me&background=6366f1&color=fff` : activeChatData.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
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
                onChange={e => setNewMessage(e.target.value)}
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
    </div>
  );
}
