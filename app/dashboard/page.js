'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/contexts/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      router.push('/admin');
    }
  }, [status, session, router]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Erreur lors du chargement des news');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0a0a0a',
        color: 'white'
      }}>
        {t.loading}
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <nav style={{
        background: 'rgba(20,20,20,0.8)',
        backdropFilter: 'blur(20px)',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          MyTone
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LanguageSelector />
          <span style={{ color: '#888', fontSize: '14px' }}>
            👤 {session.user.name || session.user.email}
          </span>
          <a
            href="/"
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.05)',
              color: '#bbb',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {t.home}
          </a>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{
              padding: '8px 16px',
              background: 'rgba(239,68,68,0.1)',
              color: '#EF4444',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {t.logout}
          </button>
        </div>
      </nav>

      <div style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(20,20,20,0.6)',
          border: '1px solid rgba(98,0,238,0.2)',
          padding: '40px',
          borderRadius: '20px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: '0 0 15px 0', 
            color: 'white',
            fontSize: '36px',
            fontWeight: '700'
          }}>
            {t.welcomeDashboard}
          </h1>
          <p style={{ color: '#aaa', fontSize: '18px', margin: 0 }}>
            {t.dashboardSubtitle}
          </p>
        </div>

        <div style={{
          background: 'rgba(20,20,20,0.6)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '40px',
          borderRadius: '20px'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '30px', color: 'white', fontSize: '28px', fontWeight: '700' }}>
            {t.latestNews}
          </h2>

          {news.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#666'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
              <p style={{ fontSize: '16px' }}>{t.noNews}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              {news.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '30px',
                    background: 'rgba(30,30,30,0.8)',
                    border: '1px solid rgba(98,0,238,0.2)',
                    borderRadius: '16px',
                    transition: 'transform 0.2s, border-color 0.2s'
                  }}
                >
                  <h3 style={{ 
                    margin: '0 0 15px 0', 
                    color: 'white', 
                    fontSize: '22px',
                    fontWeight: '600'
                  }}>
                    {item[`news_title_${currentLanguage}`] || item.title}
                  </h3>
                  <p style={{ 
                    margin: '0 0 15px 0', 
                    color: '#bbb', 
                    lineHeight: '1.7',
                    fontSize: '15px'
                  }}>
                    {item[`news_description_${currentLanguage}`] || item.content}
                  </p>
                  <small style={{ color: '#666', fontSize: '13px' }}>
                    📅 {new Date(item.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
