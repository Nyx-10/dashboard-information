import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './double-slider.css';

export function DoubleSliderAuthView({ 
  initialMode = 'login',
  onLogin, 
  onSignup, 
  onForgotPassword, 
  onBackToHome, 
  onMaintenanceMode 
}) {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [isRightPanelActive, setIsRightPanelActive] = useState(initialMode === 'signup');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      if (!rememberMe) {
        localStorage.setItem('rememberMe', 'false');
        sessionStorage.setItem('tempSession', 'true');
      } else {
        localStorage.removeItem('rememberMe');
        sessionStorage.removeItem('tempSession');
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
      if (error) throw error;
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Profile fetch error:", profileError);
      }

      if (profile && profile.status === 'Suspended') {
        await supabase.auth.signOut();
        throw new Error(t('accountSuspended'));
      }
      
      let role = profile?.role || data.user.user_metadata?.role || 'user';
      let name = profile?.username || data.user.user_metadata?.full_name || data.user.user_metadata?.username || data.user.user_metadata?.name || 'User';
      
      const normalizedEmail = loginEmail.trim().toLowerCase();
      if (!profile?.role) {
        if (normalizedEmail.includes('adam.darwish.it')) {
          role = 'superadmin';
        } else if (normalizedEmail === 'admin@adtec.edu.my' || normalizedEmail === 'normaladmin@adtec.edu.my') {
          role = 'admin';
        }
      }

      const { data: settings } = await supabase.from('system_settings').select('is_maintenance_mode').eq('id', 1).single();
      if (settings?.is_maintenance_mode) {
         let normalizedRole = role.toLowerCase().replace(/\s+/g, '');
         if (normalizedRole !== 'admin' && normalizedRole !== 'superadmin') {
            await supabase.auth.signOut();
            if (onMaintenanceMode) onMaintenanceMode();
            return;
         }
      }

      onLogin({ id: data.user.id, email: loginEmail, role, name });
    } catch (err) {
      alert(err.message || (t ? t('loginFailed') : 'Login failed. Sila pastikan email dan password betul.'));
    } finally {
      setLoginLoading(false);
    }
  };

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupEmail === 'adam.darwish.it@gmail.com') {
      setSignupError('Akaun Super Admin tidak perlu mendaftar. Sila Log Masuk terus.');
      return;
    }
    if (signupPassword.length < 8) {
      setSignupError(t ? (t('passwordShortError') || 'Password must be at least 8 characters') : 'Password must be at least 8 characters');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError(t ? (t('passwordMismatchError') || 'Passwords do not match') : 'Passwords do not match');
      return;
    }
    setSignupError('');
    setSignupLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: signupName,
            username: signupName,
            role: 'user'
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        onSignup({ id: data.user.id, email: signupEmail, name: signupName, role: 'user' });
      } else {
        setShowOtpInput(true);
      }
    } catch (err) {
      setSignupError(err.message || 'Pendaftaran gagal. Sila cuba lagi.');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpLoading(true);
    setOtpError('');
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: signupEmail,
        token: otpCode,
        type: 'signup'
      });
      if (error) throw error;
      
      if (data.session) {
        onSignup({ id: data.user.id, email: signupEmail, name: signupName, role: 'user' });
      } else {
        setOtpError('Sesi tidak dijumpai selepas pengesahan OTP. Sila log masuk.');
      }
    } catch (err) {
      setOtpError(err.message || 'OTP tidak sah. Sila cuba lagi.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="bg-auth" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {/* Top Controls */}
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 1000 }}>
        <button onClick={onBackToHome} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
          <ArrowLeft size={16} /> {t ? t('backToHome') : 'Back to Home'}
        </button>
      </div>
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 1000 }}>
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

      <div className={`ds-container glass-panel ${isRightPanelActive ? 'right-panel-active' : ''}`}>
        
        {/* Sign Up Container */}
        <div className="ds-form-container ds-sign-up-container">
          <form className="ds-form" onSubmit={showOtpInput ? handleVerifyOtp : handleSignup}>
            <h1>{showOtpInput ? (t ? t('verifyOtpTitle') : 'Sahkan OTP') : (t ? t('signupTitle') : 'Create Account')}</h1>
            
            {showOtpInput ? (
              <>
                <p style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t ? t('otpSentMsg') : 'Sila masukkan kod OTP yang dihantar ke emel anda.'}</p>
                {otpError && <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '13px' }}>{otpError}</div>}
                
                <input 
                  type="text" 
                  placeholder="Contoh: 12345678" 
                  className="input-field" 
                  value={otpCode} 
                  onChange={(e) => setOtpCode(e.target.value)} 
                  maxLength={8}
                  style={{ textAlign: 'center', letterSpacing: '0.2rem', fontSize: '1.25rem', fontWeight: 'bold' }}
                  required 
                />

                <button type="submit" className="btn-primary" disabled={otpLoading}>
                  {otpLoading ? '...' : (t ? t('verifyOtpBtn') : 'Sahkan OTP')}
                </button>
              </>
            ) : (
              <>
                <span>{t ? t('signupDesc') : 'Join the Adtec Melaka network.'}</span>
                {signupError && <div style={{ color: '#ef4444', marginBottom: '10px', fontSize: '13px' }}>{signupError}</div>}
                
                <input type="text" placeholder={t ? t('fullNameLabel') : 'Full Name'} className="input-field" value={signupName} onChange={(e) => setSignupName(e.target.value)} required />
                <input type="email" placeholder={t ? t('emailLabel') : 'Email'} className="input-field" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required />
                
                <div style={{ position: 'relative', width: '100%' }}>
                  <input type={showSignupPassword ? 'text' : 'password'} placeholder={t ? t('passwordLabel') : 'Password'} className="input-field" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} style={{ paddingRight: '2.5rem' }} required />
                  <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} style={{ position: 'absolute', right: '0.75rem', top: '23px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div style={{ position: 'relative', width: '100%' }}>
                  <input type={showSignupConfirmPassword ? 'text' : 'password'} placeholder={t ? t('confirmPasswordLabel') : 'Confirm Password'} className="input-field" value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} style={{ paddingRight: '2.5rem' }} required />
                  <button type="button" onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)} style={{ position: 'absolute', right: '0.75rem', top: '23px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    {showSignupConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button type="submit" className="btn-primary" disabled={signupLoading}>
                  {signupLoading ? '...' : (t ? t('signUpBtn') : 'Sign Up')}
                </button>
              </>
            )}
          </form>
        </div>

        {/* Sign In Container */}
        <div className="ds-form-container ds-sign-in-container">
          <form className="ds-form" onSubmit={handleLogin}>
            <img src="https://esijil.jtm.gov.my/images/toplogo1.png" alt="Adtec Melaka Logo" style={{ height: '50px', marginBottom: '15px' }} />
            <h1>{t ? t('loginTitle') : 'Login'}</h1>
            <span>{t ? t('loginWelcome') : 'Welcome to Dashboard Adtec Melaka.'}</span>
            
            <input type="email" placeholder={t ? t('emailLabel') : 'Email'} className="input-field" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required style={{ marginTop: '10px' }} />
            
            <div style={{ position: 'relative', width: '100%' }}>
              <input type={showLoginPassword ? 'text' : 'password'} placeholder={t ? t('passwordLabel') : 'Password'} className="input-field" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ paddingRight: '2.5rem' }} required />
              <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} style={{ position: 'absolute', right: '0.75rem', top: '23px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '15px', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                {t ? t('staySignedIn') : 'Stay signed in'}
              </label>
              <button type="button" onClick={onForgotPassword} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}>
                {t ? t('forgotPassword') : 'Forgot password?'}
              </button>
            </div>

            <button type="submit" className="btn-primary" disabled={loginLoading}>
              {loginLoading ? '...' : (t ? t('signInBtn') : 'Sign In')}
            </button>
          </form>
        </div>

        {/* Overlay Container */}
        <div className="ds-overlay-container">
          <div className="ds-overlay">
            <div className="ds-overlay-panel ds-overlay-left">
              <h1 style={{ color: 'var(--text-main)', fontSize: '32px', marginBottom: '15px' }}>{t ? t('overlayWelcomeTitle') : 'Welcome Back!'}</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                {t ? t('overlayWelcomeDesc') : 'To keep connected with us please login with your personal info'}
              </p>
              <button className="ds-ghost-btn" style={{ borderColor: 'var(--text-main)', color: 'var(--text-main)' }} onClick={() => setIsRightPanelActive(false)}>{t ? t('signInBtn') : 'Sign In'}</button>
            </div>
            <div className="ds-overlay-panel ds-overlay-right">
              <h1 style={{ color: 'var(--text-main)', fontSize: '32px', marginBottom: '15px' }}>{t ? t('overlayHelloTitle') : 'Hello, Friend!'}</h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '14px', lineHeight: '1.5' }}>
                {t ? t('overlayHelloDesc') : 'Enter your personal details and start your journey with us'}
              </p>
              <button className="ds-ghost-btn" style={{ borderColor: 'var(--text-main)', color: 'var(--text-main)' }} onClick={() => setIsRightPanelActive(true)}>{t ? t('signUpBtn') : 'Sign Up'}</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}