import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../supabaseClient';

export function SignupView({ onSignup, onSwitch }) {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (email === 'adam.darwish.it@gmail.com') {
      setError('Akaun Super Admin tidak perlu mendaftar. Sila Log Masuk terus.');
      return;
    }
    if (password.length < 8) {
      setError(t ? (t('passwordShortError') || 'Password must be at least 8 characters') : 'Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError(t ? (t('passwordMismatchError') || 'Passwords do not match') : 'Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Gagal menghantar OTP.');
      }
      
      setShowOtpInput(true);
      alert('Sila semak e-mel anda untuk mendapatkan kod OTP (6 digit).');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, password, name })
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Kod OTP tidak sah.');
      }

      // Log masuk pengguna selepas pendaftaran berjaya
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      let role = 'user';
      onSignup({ id: data.user.id, email, name, role });
    } catch (err) {
      setError(err.message || 'Kod OTP tidak sah atau ralat berlaku.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-auth" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          style={{ padding: '0.4rem', borderRadius: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', outline: 'none', cursor: 'pointer', fontWeight: 500 }}
        >
          <option value="ms">Melayu</option>
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>
      <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <img src="https://esijil.jtm.gov.my/images/toplogo1.png" alt="Adtec Melaka Logo" style={{ height: '60px', margin: '0 auto 1rem', display: 'block' }} />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t ? t('signupTitle') : 'Create Account'}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{showOtpInput ? 'Sahkan e-mel anda.' : (t ? t('signupDesc') : 'Join the Adtec Melaka network.')}</p>
        
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'left', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {!showOtpInput ? (
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t ? t('fullNameLabel') : 'Full Name'}</label>
              <input type="text" required className="input-field" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t ? t('emailLabel') : 'Email'}</label>
              <input type="email" required className="input-field" placeholder="student@adtec.edu.my" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t ? t('passwordLabel') : 'Password'}</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} required minLength={8} className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t ? (t('confirmPasswordLabel') || 'Confirm Password') : 'Confirm Password'}</label>
              <div style={{ position: 'relative' }}>
                <input type={showConfirmPassword ? 'text' : 'password'} required minLength={8} className="input-field" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ paddingRight: '2.5rem' }} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem', padding: '0.75rem', width: '100%', opacity: loading ? 0.7 : 1 }}>
              {loading ? (t ? t('loading') || 'Loading...' : 'Loading...') : (t ? t('signUpBtn') : 'Sign Up')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Kod OTP (6-digit)</label>
              <input type="text" required className="input-field" placeholder="Contoh: 123456" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} style={{ letterSpacing: '0.25rem', textAlign: 'center', fontSize: '1.25rem' }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Kod ini telah dihantar ke <strong>{email}</strong></p>
            </div>
            <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem', padding: '0.75rem', width: '100%', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Mengesahkan...' : 'Sahkan OTP'}
            </button>
            <button type="button" onClick={() => setShowOtpInput(false)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '0.875rem' }}>
              Kembali
            </button>
          </form>
        )}
        
        <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          {t ? t('alreadyAccount') : 'Already have an account?'} <button onClick={onSwitch} style={{ color: 'var(--text-main)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>{t ? t('signInBtn') : 'Sign In'}</button>
        </p>
      </div>
    </div>
  );
}
