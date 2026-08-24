import React, { useState } from 'react';
import { Search, AlertCircle } from 'lucide-react';

export function MessagesView({ initialChatUser }) {
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherReason, setOtherReason] = useState('');

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(initialChatUser ? initialChatUser.id : null);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (initialChatUser) {
      setChats(prev => {
        if (!prev.find(c => c.id === initialChatUser.id)) {
          return [{
            id: initialChatUser.id,
            name: initialChatUser.name,
            time: 'Just now',
            preview: initialChatUser.preview || 'Start a conversation...',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(initialChatUser.name)}&background=4F46E5&color=fff`
          }, ...prev];
        }
        return prev;
      });
      setActiveChat(initialChatUser.id);
    }
  }, [initialChatUser]);

  const filteredChats = chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const activeChatData = chats.find(c => c.id === activeChat);

  return (
    <div className="page-bg-common bg-messages">
      <div style={{ display: 'flex', height: 'calc(100vh - 150px)', background: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Messages</h2>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '32px', fontSize: '0.875rem', padding: '0.5rem 0.5rem 0.5rem 32px' }} 
            />
          </div>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {filteredChats.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Tiada perbualan.
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
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.preview}</p>
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
            <p>Pilih perbualan untuk mula mesej</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={activeChatData.avatar} alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div>
                  <h3 style={{ fontWeight: 600, color: 'var(--text-main)' }}>{activeChatData.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>Online</span>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <button className="btn-primary" onClick={() => { setShowReportMenu(!showReportMenu); setShowOtherInput(false); setOtherReason(''); }} style={{ background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                  <AlertCircle size={14} /> Report User
                </button>
                {showReportMenu && (
                  <div className="glass-panel" style={{ position: 'absolute', right: 0, top: '120%', width: '200px', zIndex: 10, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', padding: '0.25rem 0.5rem', textTransform: 'uppercase' }}>Report Type</div>
                    {!showOtherInput ? (
                      <>
                        <button style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)', borderRadius: '0.25rem' }} className="nav-link" onClick={() => { alert('Reported as Spam'); setShowReportMenu(false); }}>Spam</button>
                        <button style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)', borderRadius: '0.25rem' }} className="nav-link" onClick={() => { alert('Reported as Scammer'); setShowReportMenu(false); }}>Scammer</button>
                        <button style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)', borderRadius: '0.25rem' }} className="nav-link" onClick={() => { alert('Reported as Inappropriate'); setShowReportMenu(false); }}>Inappropriate Content</button>
                        <button style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)', borderRadius: '0.25rem' }} className="nav-link" onClick={() => { alert('Reported as Harassment'); setShowReportMenu(false); }}>Harassment</button>
                        <button style={{ padding: '0.5rem', textAlign: 'left', fontSize: '0.875rem', color: 'var(--text-main)', borderRadius: '0.25rem' }} className="nav-link" onClick={() => setShowOtherInput(true)}>Others</button>
                      </>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.25rem' }}>
                        <textarea 
                          placeholder="Type reason..." 
                          style={{ width: '100%', padding: '0.5rem', fontSize: '0.75rem', borderRadius: '0.25rem', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)', resize: 'vertical', minHeight: '60px' }}
                          value={otherReason}
                          onChange={(e) => setOtherReason(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-primary" style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)' }} onClick={() => { setShowOtherInput(false); setOtherReason(''); }}>Cancel</button>
                          <button className="btn-primary" style={{ flex: 1, padding: '0.25rem', fontSize: '0.75rem' }} onClick={() => { if(otherReason.trim()){ alert(`Reported: ${otherReason}`); setShowReportMenu(false); setShowOtherInput(false); setOtherReason(''); } }}>Submit</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Messages List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ alignSelf: 'center', background: 'var(--border)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Today
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', maxWidth: '80%' }}>
                <img src={activeChatData.avatar} alt="Avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
                <div>
                  <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem', borderRadius: '0 1rem 1rem 1rem', color: 'var(--text-main)' }}>
                    {activeChatData.preview}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>Just now</span>
                </div>
              </div>
              
            </div>

            {/* Input Area */}
            <div style={{ padding: '1.25rem', background: 'var(--surface)', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
              <input type="text" className="input-field" placeholder="Type a message..." style={{ flex: 1, borderRadius: '2rem' }} />
              <button className="btn-primary" style={{ borderRadius: '2rem', padding: '0.5rem 1.5rem' }}>
                Send
              </button>
            </div>
          </>
        )}
    </div>
    </div>
  );
}
