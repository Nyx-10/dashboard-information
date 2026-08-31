import React, { useState, useContext, useEffect } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './sliding-auth.css';

export function SlidingAuthView({ 
  initialMode = 'login', 
  onLogin, 
  onSignup, 
  onForgotPassword, 
  onBackToHome, 
  onMaintenanceMode 
}) {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [isRightPanelActive, setIsRightPanelActive] = useState(initialMode === 'signup');

  useEffect(() => {
    setIsRightPanelActive(initialMode === 'signup');
  }, [initialMode]);

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
        throw new Error(t('accountSuspended') || 'Your account is suspended.');
      }
      
      let role = profile?.role || data.user.user_metadata?.role || 'user';
      let name = profile?.username || data.user.user_metadata?.name || 'User';
      
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

      if (onLogin) onLogin({ id: data.user.id, email: loginEmail, role, name });
    } catch (err) {
      alert(err.message || (t ? t('loginFailed') : 'Login failed. Sila pastikan email dan password betul.'));
    } finally {
      setLoginLoading(false);
    }
  };

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
        if (onSignup) onSignup({ id: data.user.id, email: signupEmail, name: signupName, role: 'user' });
      } else {
        setSignupSuccess(true);
      }
    } catch (err) {
      setSignupError(err.message || 'Pendaftaran gagal. Sila cuba lagi.');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="bg-auth" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '1rem' }}>
      
      {/* Top Left Back Button */}
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 200 }}>
        <button onClick={onBackToHome} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
          <ArrowLeft size={16} /> {t ? t('backToHome') : 'Back to Home'}
        </button>
      </div>

      {/* Top Right Lang Toggle */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 200 }}>
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          style={{ padding: '0.4rem', borderRadius: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', outline: 'none', cursor: 'pointer', fontWeight: 500 }}
        >
          <option value="ms">Melayu</option>
          <option value="en">English</option>
          <option value="zh">Σ╕¡µûç</option>
          <option value="ta">α«ñα««α«┐α«┤α»ì</option>
        </select>
      </div>

      <div className={`sliding-auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
        
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <div className="auth-form glass-panel" style={{ borderRadius: 0, border: 'none' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t ? t('signupTitle') : 'Create Account'}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{signupSuccess ? 'Pendaftaran Berjaya!' : (t ? t('signupDesc') : 'Join the Adtec Melaka network.')}</p>
            
            {signupError && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'left', fontSize: '0.875rem', width: '100%' }}>
                {signupError}
              </div>
            )}

            {!signupSuccess ? (
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', textAlign: 'left' }}>
                <div>
                  <input type="text" required className="input-field" placeholder={t ? t('fullNameLabel') : 'Full Name'} value={signupName} onChange={(e) => setSignupName(e.target.value)} />
                </div>
                <div>
                  <input type="email" required className="input-field" placeholder="Email (student@adtec.edu.my)" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
                </div>
                <div style={{ position: 'relative' }}>
                  <input type={showSignupPassword ? 'text' : 'password'} required minLength={8} className="input-field" placeholder={t ? t('passwordLabel') : 'Password'} value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} style={{ paddingRight: '2.5rem' }} />
                  <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input type={showSignupConfirmPassword ? 'text' : 'password'} required minLength={8} className="input-field" placeholder={t ? (t('confirmPasswordLabel') || 'Confirm Password') : 'Confirm Password'} value={signupConfirmPassword} onChange={(e) => setSignupConfirmPassword(e.target.value)} style={{ paddingRight: '2.5rem' }} />
                  <button type="button" onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showSignupConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button type="submit" disabled={signupLoading} className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem', width: '100%', opacity: signupLoading ? 0.7 : 1 }}>
                  {signupLoading ? (t ? t('loading') || 'Loading...' : 'Loading...') : (t ? t('signUpBtn') : 'Sign Up')}
                </button>
              </form>
            ) : (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', marginBottom: '1.5rem', width: '100%' }}>
                <p style={{ color: '#10B981', fontWeight: 600 }}>Sila semak peti masuk anda!</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Satu pautan pengesahan telah dihantar ke <strong>{signupEmail}</strong>. Sila klik pautan tersebut untuk mengaktifkan akaun anda sebelum log masuk.
                </p>
              </div>
            )}
            
            <button className="mobile-switch" onClick={() => setIsRightPanelActive(false)}>
              {t ? t('signInBtn') : 'Sign In'} instead
            </button>
          </div>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <div className="auth-form glass-panel" style={{ borderRadius: 0, border: 'none' }}>
            <img src="https://esijil.jtm.gov.my/images/toplogo1.png" alt="Adtec Melaka Logo" style={{ height: '50px', margin: '0 auto 1rem', display: 'block' }} />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t ? t('loginTitle') : 'Login'}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t ? t('loginWelcome') : 'Welcome to Dashboard Adtec Melaka.'}</p>
            
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.875rem' }}>{t ? t('emailLabel') : 'Email'}</label>
                <input type="email" required className="input-field" placeholder="student@adtec.edu.my" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 500, fontSize: '0.875rem' }}>{t ? t('passwordLabel') : 'Password'}</label>
                <div style={{ position: 'relative' }}>
                  <input type={showLoginPassword ? 'text' : 'password'} required className="input-field" placeholder="ΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇóΓÇó" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} style={{ paddingRight: '2.5rem' }} />
                  <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div style={{ textAlign: 'right', marginTop: '0.25rem' }}>
                  <button type="button" onClick={onForgotPassword} style={{ color: 'var(--text-main)', background: 'none', border: 'none', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}>
                    {t ? t('forgotPassword') : 'Forgot Password?'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ cursor: 'pointer' }} />
                <label htmlFor="rememberMe" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  {t ? t('staySignedIn') : 'Stay signed in'}
                </label>
              </div>

              <button type="submit" disabled={loginLoading} className="btn-primary" style={{ marginTop: '0.5rem', padding: '0.75rem', width: '100%', opacity: loginLoading ? 0.7 : 1 }}>
                {loginLoading ? (t ? t('loading') : 'Loading...') : (t ? t('signInBtn') : 'Sign In')}
              </button>
            </form>
            
            <button className="mobile-switch" onClick={() => setIsRightPanelActive(true)}>
              {t ? t('signUpBtn') : 'Sign Up'} instead
            </button>
          </div>
        </div>

        {/* Overlay Panel for sliding effect */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welcome Back!</h2>
              <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>To keep connected with us please login with your personal info</p>
              <button className="ghost-btn" onClick={() => setIsRightPanelActive(false)}>{t ? t('signInBtn') : 'Sign In'}</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Hello, Friend!</h2>
              <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>Enter your personal details and start journey with us</p>
              <button className="ghost-btn" onClick={() => setIsRightPanelActive(true)}>{t ? t('signUpBtn') : 'Sign Up'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
