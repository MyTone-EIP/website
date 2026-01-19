'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/contexts/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: email,
        password,
        userType: 'user'
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(98,0,238,0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <div style={{
        background: 'rgba(20,20,20,0.8)',
        backdropFilter: 'blur(20px)',
        padding: '50px',
        borderRadius: '24px',
        border: '1px solid rgba(98,0,238,0.2)',
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
          <LanguageSelector />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 50%, #B388FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px'
          }}>
            MyTone
          </div>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
            {t.loginUser}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            color: '#EF4444',
            padding: '14px',
            borderRadius: '12px',
            marginBottom: '25px',
            border: '1px solid rgba(239,68,68,0.3)',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#bbb', 
              fontWeight: '500',
              fontSize: '14px'
            }}>
              {t.emailOrUsername}
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(30,30,30,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '15px',
                boxSizing: 'border-box',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              placeholder={t.emailUsernamePlaceholder}
              onFocus={(e) => e.target.style.borderColor = 'rgba(98,0,238,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#bbb', 
              fontWeight: '500',
              fontSize: '14px'
            }}>
              {t.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(30,30,30,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '15px',
                boxSizing: 'border-box',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              placeholder={t.passwordPlaceholder}
              onFocus={(e) => e.target.style.borderColor = 'rgba(98,0,238,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
            <a 
              href="/resetpwd" 
              style={{ 
                color: '#b187d3',
                textDecoration: 'underline',
                fontSize: '14px',
            }}
            >
              {t.resetPassword}
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? 'rgba(100,100,100,0.5)' : 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(98,0,238,0.3)'
            }}
          >
            {loading ? t.loggingIn : t.loginButton}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a 
            href="/" 
            style={{ 
              color: '#b187d3',
              textDecoration: 'underline',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {t.backToHome}
          </a>
          <a 
            href="/signup" 
            style={{ 
              color: '#b187d3', 
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            {t.noAccountYet}
          </a>
        </div>

        <div style={{ 
          marginTop: '25px', 
          textAlign: 'center',
          paddingTop: '25px',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>
            {t.adminQuestion}
          </p>
          <a 
            href="/login/admin" 
            style={{ 
              color: '#9D4EDD', 
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {t.adminLink}
          </a>
        </div>
      </div>
    </div>
  );
}
