'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/contexts/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordMismatch);
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
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
        // Redirection vers login après inscription réussie
        router.push('/login/user?registered=true');
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
      padding: '40px 20px'
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
        padding: '50px',
        borderRadius: '24px',
        border: '1px solid rgba(98,0,238,0.2)',
        width: '100%',
        maxWidth: '500px',
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
            {t.signupTitle}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px',
            color: '#EF4444',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                color: '#bbb', 
                fontWeight: '500',
                fontSize: '14px'
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
                  padding: '14px',
                  background: 'rgba(40,40,40,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                color: '#bbb', 
                fontWeight: '500',
                fontSize: '14px'
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
                  padding: '14px',
                  background: 'rgba(40,40,40,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#bbb', 
              fontWeight: '500',
              fontSize: '14px'
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
                padding: '14px',
                background: 'rgba(40,40,40,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#bbb', 
              fontWeight: '500',
              fontSize: '14px'
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
                padding: '14px',
                background: 'rgba(40,40,40,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#bbb', 
              fontWeight: '500',
              fontSize: '14px'
            }}>
              {t.password} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(40,40,40,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              color: '#bbb', 
              fontWeight: '500',
              fontSize: '14px'
            }}>
              {t.confirmPassword} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(40,40,40,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px', marginTop: '10px' }}>
            <span style={{ color: '#EF4444' }}>*</span> {t.requiredFields}
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? 'rgba(100,100,100,0.5)' : 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(98,0,238,0.3)'
            }}
          >
            {loading ? t.signingUp : t.signupButton}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          <a 
            href="/login/user" 
            style={{ 
              color: '#888', 
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            {t.alreadyHaveAccount}
          </a>
        </div>
      </div>
    </div>
  );
}
