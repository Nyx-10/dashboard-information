import React, { useState, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { Eye, EyeOff } from 'lucide-react';
import { LanguageContext } from '../context/LanguageContext';

export function ResetPasswordView({ onBackToLogin }) {
  const { t } = useContext(LanguageContext);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionValid, setSessionValid] = useState(true);

  React.useEffect(() => {
    // Check for errors in URL hash from Supabase (e.g. expired link)
    const hash = window.location.hash;
    if (hash && hash.includes('error_description=')) {
      const params = new URLSearchParams(hash.substring(1));
      setError(params.get('error_description')?.replace(/\+/g, ' ') || t('invalidLink') || 'Invalid or expired link.');
      setSessionValid(false);
      return;
    }

    // Check if session actually exists
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && !hash.includes('access_token=')) {
        setError(t('sessionNotFound') || 'Session not found. Please request a new reset link from the login page.');
        setSessionValid(false);
      }
    });
  }, [t]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError(t('passwordShortError') || 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError(t('passwordMismatchError') || 'Passwords do not match.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('resetFailed') || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-auth" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <style>
        {`
          @keyframes slideUpFadeIn {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', position: 'relative', zIndex: 10, animation: 'slideUpFadeIn 0.5s ease-out forwards' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img src="https://esijil.jtm.gov.my/images/toplogo1.png" alt="Logo" style={{ height: '60px', objectFit: 'contain' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{t('resetPasswordTitle') || 'Set New Password'}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('resetPasswordDesc') || 'Please enter your new password below.'}</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              {t('resetPasswordSuccess') || 'Password successfully changed! You can now login using your new password.'}
            </div>
            <button onClick={onBackToLogin} className="btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
              {t('backToLoginBtn') || 'Back to Login'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{t('newPasswordLabel') || 'New Password'}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{t('confirmNewPasswordLabel') || 'Confirm Password'}</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)' }}
                />
              </div>
            </div>

            <button type="submit" disabled={loading || !sessionValid} className="btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '1rem', opacity: (!sessionValid) ? 0.5 : 1 }}>
              {loading ? (t('saving') || 'Saving...') : (t('changePasswordBtn') || 'Change Password')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
