'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        background: 'radial-gradient(circle, rgba(255,142,83,0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <div style={{
        background: 'rgba(20,20,20,0.8)',
        backdropFilter: 'blur(20px)',
        padding: '50px',
        borderRadius: '24px',
        border: '1px solid rgba(255,142,83,0.2)',
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px'
          }}>
            MyTone
          </div>
          <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>
            🔒 Connexion Admin
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,107,107,0.1)',
            color: '#FF6B6B',
            padding: '14px',
            borderRadius: '12px',
            marginBottom: '25px',
            border: '1px solid rgba(255,107,107,0.3)',
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
              Username
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
              placeholder="admin"
              onFocus={(e) => e.target.style.borderColor = 'rgba(255,142,83,0.5)'}
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
              Mot de passe
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
              placeholder="••••••••"
              onFocus={(e) => e.target.style.borderColor = 'rgba(255,142,83,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? 'rgba(100,100,100,0.5)' : 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(255,142,83,0.3)'
            }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a 
            href="/" 
            style={{ 
              color: '#FF8E53', 
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Accueil
          </a>
          <a 
            href="/login/user" 
            style={{ 
              color: '#888', 
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            Connexion User
          </a>
        </div>
      </div>
    </div>
  );
}
