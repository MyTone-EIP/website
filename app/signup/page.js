'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/contexts/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    confirmEmail: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { currentLanguage, isClient } = useLanguage();
  const t = translations[currentLanguage] || translations.fr;

  // Attendre que le client soit chargé
  if (!isClient) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0a0a0a', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white'
      }}>
        Chargement...
      </div>
    );
  }

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.email !== formData.confirmEmail) {
      setError(t.emailMismatch);
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      setLoading(false);
      return;
    }

    if (formData.password.length < 10) {
      setError(t.passwordTooShort);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          username: formData.username,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Connexion automatique après inscription
        const loginResult = await signIn('credentials', {
          redirect: false,
          identifier: formData.email,
          password: formData.password,
          userType: 'user'
        });
        
        if (!loginResult?.error) {
          router.push('/');
          router.refresh();
        } else {
          router.push('/');
        }
      } else {
        setError(data.error || t.signupError);
      }
    } catch (err) {
      setError(t.serverError);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            {t.signupTitle}
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

        <form onSubmit={handleSubmit}>
          <div style={{ display: windowWidth <= 1000 ? 'block' : 'grid', gridTemplateColumns: windowWidth <= 1000 ? '1fr' : '1fr 1fr', gap: windowWidth <= 1000 ? '12px' : '15px', marginBottom: windowWidth <= 1000 ? '15px' : '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: windowWidth <= 1000 ? '8px' : '10px', 
                color: '#bbb', 
                fontWeight: '500',
                fontSize: windowWidth <= 1000 ? '13px' : '14px'
              }}>
                {t.name} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
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
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: windowWidth <= 1000 ? '8px' : '10px', 
                color: '#bbb', 
                fontWeight: '500',
                fontSize: windowWidth <= 1000 ? '13px' : '14px'
              }}>
                {t.surname} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
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
          </div>

          <div style={{ marginBottom: windowWidth <= 1000 ? '15px' : '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: windowWidth <= 1000 ? '8px' : '10px', 
              color: '#bbb', 
              fontWeight: '500',
              fontSize: windowWidth <= 1000 ? '13px' : '14px'
            }}>
              {t.email} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              {t.confirmEmail || 'Confirmer l\'email'} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="email"
              name="confirmEmail"
              value={formData.confirmEmail}
              onChange={handleChange}
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
              {t.username} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
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
              {t.password} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: windowWidth <= 1000 ? '12px' : '14px',
                  paddingRight: windowWidth <= 1000 ? '45px' : '45px',
                  background: 'rgba(40,40,40,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: windowWidth <= 1000 ? '8px' : '10px',
                  color: 'white',
                  fontSize: windowWidth <= 1000 ? '13px' : '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: windowWidth <= 1000 ? '12px' : '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                {showPassword ? '👁' : '👁‍🗨'}
              </button>
            </div>
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
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: windowWidth <= 1000 ? '12px' : '14px',
                  paddingRight: windowWidth <= 1000 ? '45px' : '45px',
                  background: 'rgba(40,40,40,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: windowWidth <= 1000 ? '8px' : '10px',
                  color: 'white',
                  fontSize: windowWidth <= 1000 ? '13px' : '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: windowWidth <= 1000 ? '12px' : '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}
              >
                {showConfirmPassword ? '👁' : '👁‍🗨'}
              </button>
            </div>
          </div>

          <p style={{ color: '#888', fontSize: windowWidth <= 1000 ? '12px' : '13px', marginBottom: windowWidth <= 1000 ? '15px' : '20px', marginTop: '10px' }}>
            <span style={{ color: '#EF4444' }}>*</span> {t.requiredFields}
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
            {loading ? t.signingUp : t.signupButton}
          </button>
        </form>

        <div style={{ marginTop: windowWidth <= 1000 ? '20px' : '30px', textAlign: 'center', display: 'flex', flexDirection: windowWidth <= 1000 ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: windowWidth <= 1000 ? '10px' : '0' }}>
          <a 
            href="/" 
            style={{ 
              color: '#b187d3', 
              textDecoration: 'underline',
              fontSize: windowWidth <= 1000 ? '13px' : '14px',
              fontWeight: '500'
            }}
          >
            {t.backToHome}
          </a>
          <a 
            href="/login/user" 
            style={{ 
              color: '#b187d3', 
              textDecoration: 'underline',
              fontSize: windowWidth <= 1000 ? '13px' : '14px'
            }}
          >
            {t.alreadyHaveAccount}
          </a>
        </div>
      </div>
    </div>
  );
}
