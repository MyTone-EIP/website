'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/contexts/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
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
        identifier: username,
        password,
        userType: 'admin'
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/admin');
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
            background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px'
          }}>
            MyTone
          </div>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
            {t.loginAdmin}
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
              {t.username}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              placeholder={t.usernamePlaceholder}
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

        <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <a 
            href="/" 
            style={{ 
              color: '#9D4EDD', 
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {t.backToHome}
          </a>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <a 
              href="/signup" 
              style={{ 
                color: '#888', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              {t.noAccountYet}
            </a>
            <a 
              href="/login/user" 
              style={{ 
                color: '#888', 
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              {t.userLink}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
