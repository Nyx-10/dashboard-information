import React, { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';

export function LoginView({ onLogin, onSwitch, onForgotPassword, onBackToHome }) {
  const { lang, setLang, t } = useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Allow hardcoded super admin bypass or normal Supabase login
      let role = 'user';
      let name = 'User';

      if (email === 'adampendek10@gmail.com' && password === 'Adamdarwish10#') {
        role = 'superadmin';
        name = 'Super Admin';
        onLogin({ email, role, name });
        setLoading(false);
        return;
      }
      
      if (email === 'adam.darwish.it@gmail.com' && password === 'Adamdarwish11#') {
        role = 'user';
        name = 'Normal User';
        onLogin({ email, role, name });
        setLoading(false);
        return;
      }

      // Normal Supabase Authentication
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      name = data.user.user_metadata?.name || 'User';
      
      if (email === 'adampendek10@gmail.com') {
        role = 'superadmin';
        name = 'Super Admin';
      } else if (email === 'admin@adtec.edu.my') {
        role = 'admin';
        name = 'Normal Admin';
      } else if (email === 'normaladmin@adtec.edu.my') {
        role = 'admin';
        name = 'Normal Admin';
      } else if (email === 'adam.darwish.it@gmail.com') {
        role = 'user';
        name = 'Normal User';
      }

      onLogin({ email, role, name });
    } catch (err) {
      alert(err.message || 'Login failed. Sila pastikan email dan password betul.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-auth" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
        <button onClick={onBackToHome} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
          <ArrowLeft size={16} /> {t ? t('backToHome') : 'Back to Home'}
        </button>
      </div>
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{t ? t('loginTitle') : 'Login'}</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t ? t('loginWelcome') : 'Welcome to Dashboard Adtec Melaka.'}</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t ? t('emailLabel') : 'Email'}</label>
            <input type="email" required className="input-field" placeholder="student@adtec.edu.my" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>{t ? t('passwordLabel') : 'Password'}</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} required className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingRight: '2.5rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <button type="button" onClick={onForgotPassword} style={{ color: 'var(--text-main)', background: 'none', border: 'none', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>
                {t ? t('forgotPassword') : 'Forgot Password?'}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '1rem', padding: '0.75rem', width: '100%', opacity: loading ? 0.7 : 1 }}>
            {loading ? (t ? t('loading') || 'Loading...' : 'Loading...') : (t ? t('signInBtn') : 'Sign In')}
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          {t ? t('noAccount') : "Don't have an account?"} <button onClick={onSwitch} style={{ color: 'var(--text-main)', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>{t ? t('signUpBtn') : 'Sign Up'}</button>
        </p>
      </div>
    </div>
  );
}
