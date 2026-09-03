import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Intercept window.alert
    const originalAlert = window.alert;
    window.alert = (message) => {
      const id = Date.now() + Math.random();
      
      // Basic heuristic to guess toast type from message content
      let type = 'info';
      const lowerMsg = String(message).toLowerCase();
      if (lowerMsg.includes('success') || lowerMsg.includes('berjaya')) type = 'success';
      else if (lowerMsg.includes('fail') || lowerMsg.includes('error') || lowerMsg.includes('gagal') || lowerMsg.includes('cannot')) type = 'error';

      setToasts(prev => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 4000);
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className="toast-item"
          style={{
            background: 'var(--surface)',
            borderLeft: `4px solid ${toast.type === 'success' ? '#10B981' : toast.type === 'error' ? '#EF4444' : '#3B82F6'}`,
            padding: '1rem 1.25rem',
            borderRadius: '0.5rem',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            pointerEvents: 'auto',
            minWidth: '250px',
            maxWidth: '400px'
          }}
        >
          {toast.type === 'success' && <CheckCircle size={20} color="#10B981" />}
          {toast.type === 'error' && <AlertCircle size={20} color="#EF4444" />}
          {toast.type === 'info' && <Info size={20} color="#3B82F6" />}
          
          <span style={{ color: 'var(--text-main)', fontSize: '0.875rem', fontWeight: 500, flex: 1, wordBreak: 'break-word' }}>
            {toast.message}
          </span>
          
          <button 
            onClick={() => removeToast(toast.id)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
