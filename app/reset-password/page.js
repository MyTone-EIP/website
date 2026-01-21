'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/contexts/translations';
import LanguageSelector from '@/components/LanguageSelector';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!token) {
      setError(t.invalidResetLink || 'Lien de réinitialisation invalide ou expiré');
    }
  }, [token, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError(t.passwordMismatch || 'Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (password.length < 10) {
      setError(t.passwordTooShort || 'Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        token,
        password: password
      }),
    });

    if (response.ok) {
      setMessage(t.passwordResetSuccess || 'Votre mot de passe a été réinitialisé avec succès');
      setTimeout(() => {
        router.push('/login/user');
      }, 2000);
    } else {
      const data = await response.json().catch(() => ({}));
      setError(data.error || t.resetError || 'Une erreur est survenue');
    }
  };

  if (!token) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0a0a0a', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        position: 'relative',
        padding: windowWidth <= 1000 ? '30px 20px' : '40px 20px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: 'rgba(20,20,20,0.8)',
          backdropFilter: 'blur(20px)',
          padding: windowWidth <= 1000 ? '30px 20px' : '50px',
          borderRadius: windowWidth <= 1000 ? '16px' : '24px',
          border: '1px solid rgba(98,0,238,0.2)',
          width: '100%',
          maxWidth: windowWidth <= 1000 ? '100%' : '500px',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: windowWidth <= 1000 ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '20px'
          }}>
            MyTone
          </div>
          <div style={{
            padding: '12px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: windowWidth <= 1000 ? '8px' : '10px',
            color: '#EF4444',
            marginBottom: '20px',
            fontSize: windowWidth <= 1000 ? '12px' : '14px'
          }}>
            {t.invalidResetLink || 'Lien de réinitialisation invalide ou expiré'}
          </div>
          <a 
            href="/forgot-password" 
            style={{ 
              color: '#b187d3', 
              textDecoration: 'underline',
              fontSize: windowWidth <= 1000 ? '13px' : '14px',
              fontWeight: '500'
            }}
          >
            {t.requestNewResetLink || 'Demander un nouveau lien'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      padding: windowWidth <= 1000 ? '30px 20px' : '40px 20px',
      boxSizing: 'border-box'
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(98,0,238,0.15) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        background: 'rgba(20,20,20,0.8)',
        backdropFilter: 'blur(20px)',
        padding: windowWidth <= 1000 ? '30px 20px' : '50px',
        borderRadius: windowWidth <= 1000 ? '16px' : '24px',
        border: '1px solid rgba(98,0,238,0.2)',
        width: '100%',
        maxWidth: windowWidth <= 1000 ? '100%' : '500px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
      }}>
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
          <LanguageSelector />
        </div>

        <div style={{ textAlign: 'center', marginBottom: windowWidth <= 1000 ? '30px' : '40px' }}>
          <div style={{
            fontSize: windowWidth <= 1000 ? '28px' : '36px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '10px'
          }}>
            MyTone
          </div>
          <p style={{ color: '#888', margin: 0, fontSize: windowWidth <= 1000 ? '13px' : '14px' }}>
            {t.resetPasswordTitle || 'Créer un nouveau mot de passe'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: windowWidth <= 1000 ? '10px' : '12px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: windowWidth <= 1000 ? '8px' : '10px',
            color: '#EF4444',
            marginBottom: windowWidth <= 1000 ? '15px' : '20px',
            fontSize: windowWidth <= 1000 ? '12px' : '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {message && (
          <div style={{
            padding: windowWidth <= 1000 ? '10px' : '12px',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: windowWidth <= 1000 ? '8px' : '10px',
            color: '#22C55E',
            marginBottom: windowWidth <= 1000 ? '15px' : '20px',
            fontSize: windowWidth <= 1000 ? '12px' : '14px',
            textAlign: 'center'
          }}>
            {message}
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
              {t.newPassword} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: windowWidth <= 1000 ? '12px' : '14px',
                background: 'rgba(40,40,40,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: windowWidth <= 1000 ? '8px' : '10px',
                color: 'white',
                fontSize: windowWidth <= 1000 ? '13px' : '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: windowWidth <= 1000 ? '15px' : '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: windowWidth <= 1000 ? '8px' : '10px', 
              color: '#bbb', 
              fontWeight: '500',
              fontSize: windowWidth <= 1000 ? '13px' : '14px'
            }}>
              {t.confirmPassword} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: windowWidth <= 1000 ? '12px' : '14px',
                background: 'rgba(40,40,40,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: windowWidth <= 1000 ? '8px' : '10px',
                color: 'white',
                fontSize: windowWidth <= 1000 ? '13px' : '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <p style={{ color: '#888', fontSize: windowWidth <= 1000 ? '12px' : '13px', marginBottom: windowWidth <= 1000 ? '15px' : '20px', marginTop: '10px' }}>
            <span style={{ color: '#EF4444' }}>*</span> {t.requiredFields || 'Champs obligatoires'}
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: windowWidth <= 1000 ? '14px' : '16px',
              background: loading ? 'rgba(100,100,100,0.5)' : 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
              color: 'white',
              border: 'none',
              borderRadius: windowWidth <= 1000 ? '8px' : '10px',
              fontSize: windowWidth <= 1000 ? '15px' : '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(98,0,238,0.3)'
            }}
          >
            {loading ? (t.resettingPassword || 'Réinitialisation...') : (t.resetPassword || 'Réinitialiser le mot de passe')}
          </button>
        </form>

        <div style={{ marginTop: windowWidth <= 1000 ? '20px' : '30px', textAlign: 'center' }}>
          <a 
            href="/login/user" 
            style={{ 
              color: '#b187d3', 
              textDecoration: 'underline',
              fontSize: windowWidth <= 1000 ? '13px' : '14px',
              fontWeight: '500'
            }}
          >
            {t.backToLogin || 'Retour à la connexion'}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'rgba(20,20,20,0.8)',
        backdropFilter: 'blur(20px)',
        padding: '50px',
        borderRadius: '24px',
        border: '1px solid rgba(98,0,238,0.2)',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
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
        <p style={{ color: '#888', margin: 0, fontSize: '14px' }}>Chargement...</p>
      </div>
    </div>
  );
}
