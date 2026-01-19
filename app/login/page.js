'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/dashboard');
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
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: windowWidth <= 1000 ? '20px' : '0',
      boxSizing: 'border-box'
    }}>
      {/* Background gradient effect */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: windowWidth <= 1000 ? '300px' : '600px',
        height: windowWidth <= 1000 ? '300px' : '600px',
        background: 'radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <div style={{
        background: 'rgba(20,20,20,0.8)',
        backdropFilter: 'blur(20px)',
        padding: windowWidth <= 1000 ? '30px 20px' : '50px',
        borderRadius: windowWidth <= 1000 ? '16px' : '24px',
        border: '1px solid rgba(255,107,107,0.2)',
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: windowWidth <= 1000 ? '30px' : '40px' }}>
          <div style={{
            fontSize: windowWidth <= 1000 ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px'
          }}>
            MyTone
          </div>
          <p style={{ color: '#888', margin: 0, fontSize: windowWidth <= 1000 ? '13px' : '14px' }}>
            Connectez-vous à votre compte
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,107,107,0.1)',
            color: '#FF6B6B',
            padding: windowWidth <= 1000 ? '12px' : '14px',
            borderRadius: windowWidth <= 1000 ? '10px' : '12px',
            marginBottom: windowWidth <= 1000 ? '20px' : '25px',
            border: '1px solid rgba(255,107,107,0.3)',
            fontSize: windowWidth <= 1000 ? '13px' : '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: windowWidth <= 1000 ? '15px' : '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: windowWidth <= 1000 ? '8px' : '10px', 
              color: '#bbb', 
              fontWeight: '500',
              fontSize: windowWidth <= 1000 ? '13px' : '14px'
            }}>
              Email ou Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={{
                width: '100%',
                padding: windowWidth <= 1000 ? '12px' : '14px',
                background: 'rgba(30,30,30,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: windowWidth <= 1000 ? '10px' : '12px',
                fontSize: windowWidth <= 1000 ? '14px' : '15px',
                boxSizing: 'border-box',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              placeholder="admin ou user@email.com"
              onFocus={(e) => e.target.style.borderColor = 'rgba(255,107,107,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ marginBottom: windowWidth <= 1000 ? '20px' : '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: windowWidth <= 1000 ? '8px' : '10px', 
              color: '#bbb', 
              fontWeight: '500',
              fontSize: windowWidth <= 1000 ? '13px' : '14px'
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: windowWidth <= 1000 ? '12px' : '14px',
                background: 'rgba(30,30,30,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: windowWidth <= 1000 ? '10px' : '12px',
                fontSize: windowWidth <= 1000 ? '14px' : '15px',
                boxSizing: 'border-box',
                color: 'white',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = 'rgba(255,107,107,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: windowWidth <= 1000 ? '14px' : '16px',
              background: loading ? 'rgba(100,100,100,0.5)' : 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
              color: 'white',
              border: 'none',
              borderRadius: windowWidth <= 1000 ? '10px' : '12px',
              fontSize: windowWidth <= 1000 ? '15px' : '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(255,107,107,0.3)'
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: windowWidth <= 1000 ? '20px' : '30px', textAlign: 'center' }}>
          <a 
            href="/" 
            style={{ 
              color: '#FF8E53', 
              textDecoration: 'none',
              fontSize: windowWidth <= 1000 ? '13px' : '14px',
              fontWeight: '500',
              transition: 'color 0.3s'
            }}
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}
