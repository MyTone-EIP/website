'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/contexts/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('download');
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featureScrollPos, setFeatureScrollPos] = useState(0);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  useEffect(() => {
    fetchNews();
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchNews = async () => {
    setLoadingNews(true);
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error while loading news.');
    } finally {
      setLoadingNews(false);
    }
  };

  const handleDownload = async () => {
    const userConfirmed = window.confirm(
      `${t.aiWarningTitle}\n\n${t.aiWarningMessage}`
    );
    
    if (!userConfirmed) {
      return;
    }
    
    setDownloading(true);
    try {
      const response = await fetch('/api/apk');
      const data = await response.json();
      
      if (data.url) {
        window.open(data.url, '_blank');
      } else {
        alert(t.apkNotAvailable);
      }
    } catch (error) {
      alert(t.downloadError);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '56vh', 
      background: '#0a0a0a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: 'white',
      overflowX: 'hidden',
      width: '100%',
      position: 'relative'
    }}>
      <style>{`
        .carousel-no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .carousel-no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(20px)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        gap: '12px',
        flexWrap: 'nowrap'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 'fit-content' }}>
          <h1 style={{
            fontSize: windowWidth <= 480 ? '20px' : windowWidth <= 768 ? '24px' : '28px',
            fontWeight: '900',
            margin: '0',
            lineHeight: '1.2',
            background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 50%, #B388FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.5px',
            whiteSpace: 'nowrap'
          }}>
            MyTone
          </h1>
          <span style={{ fontSize: windowWidth <= 480 ? '8px' : windowWidth <= 768 ? '9px' : '12px', color: '#888', fontWeight: '400' }}>BETA</span>
        </div>

        {/* Desktop: Social Links + Language + Auth */}
        {windowWidth > 768 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'flex-end', flex: 1 }}>
            {/* Social Media Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a href="https://discord.gg/vhWKA3ugZt" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <svg width="20" height="20" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#5865F2"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/mytoneappmusic?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#E4405F"/>
                </svg>
              </a>
              <a href="https://www.tiktok.com/@mytoneapp" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <svg width="20" height="20" viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25v178.72A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0h88a121.18 121.18 0 0 0 1.86 22.17A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14z" fill="#FFFFFF"/>
                </svg>
              </a>
            </div>

            <LanguageSelector />
            
            {session ? (
              <>
                <button
                  onClick={() => {
                    if (session.user?.role === 'admin') {
                      router.push('/admin');
                    }
                  }}
                  style={{
                    color: session.user?.role === 'admin' ? '#6200EE' : '#888',
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    background: 'none',
                    border: 'none',
                    cursor: session.user?.role === 'admin' ? 'pointer' : 'default',
                    fontWeight: session.user?.role === 'admin' ? '600' : '400',
                    transition: 'all 0.2s',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}
                  onMouseOver={(e) => {
                    if (session.user?.role === 'admin') {
                      e.target.style.background = 'rgba(98,0,238,0.1)';
                      e.target.style.color = '#9D4EDD';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (session.user?.role === 'admin') {
                      e.target.style.background = 'none';
                      e.target.style.color = '#6200EE';
                    }
                  }}
                  title={session.user?.role === 'admin' ? 'Accéder au panneau d\'administration' : ''}
                >
                  👤 {session.user.name || session.user.email}
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(239,68,68,0.1)',
                    color: '#EF4444',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(239,68,68,0.2)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(239,68,68,0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/login/user')}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    color: '#9D4EDD',
                    border: '2px solid #6200EE',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(98,0,238,0.1)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {t.login}
                </button>
                <button
                  onClick={() => router.push('/signup')}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '12px',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 15px rgba(98,0,238,0.3)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  {t.signup}
                </button>
              </>
            )}
          </div>
        )}

        {/* Mobile: Hamburger Menu */}
        {windowWidth <= 768 && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9D4EDD',
              cursor: 'pointer',
              fontSize: '24px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              minHeight: '32px'
            }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        )}
      </nav>

      {/* Mobile Menu Dropdown */}
      {windowWidth <= 768 && mobileMenuOpen && (
        <div style={{
          background: 'rgba(20,20,20,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative',
          zIndex: 999
        }}>
          {/* Social Links in Mobile Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'left', paddingBottom: '12px',paddingLeft: '5px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <a href="https://discord.gg/vhWKA3ugZt" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <svg width="18" height="18" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#5865F2"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/mytoneappmusic?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#E4405F"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@mytoneapp" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <svg width="18" height="18" viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25v178.72A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0h88a121.18 121.18 0 0 0 1.86 22.17A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14z" fill="#FFFFFF"/>
              </svg>
            </a>
          {/* Language Selector in Mobile Menu */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '5px', paddingLeft: '150px'}}>
            <LanguageSelector />
          </div>
          </div>


          {/* Auth Buttons */}
          {session ? (
            <>
              <button
                onClick={() => {
                  if (session.user?.role === 'admin') {
                    router.push('/admin');
                    setMobileMenuOpen(false);
                  }
                }}
                style={{
                  color: session.user?.role === 'admin' ? '#6200EE' : '#888',
                  fontSize: '13px',
                  background: 'none',
                  border: 'none',
                  cursor: session.user?.role === 'admin' ? 'pointer' : 'default',
                  fontWeight: session.user?.role === 'admin' ? '600' : '400',
                  transition: 'all 0.2s',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  width: '100%',
                  textAlign: 'center'
                }}
                title={session.user?.role === 'admin' ? 'Accéder au panneau d\'administration' : ''}
              >
                👤 {session.user.name || session.user.email}
              </button>
              <button
                onClick={() => {
                  signOut({ callbackUrl: '/' });
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '10px 16px',
                  background: 'rgba(239,68,68,0.1)',
                  color: '#EF4444',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
              >
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  router.push('/login/user');
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  color: '#9D4EDD',
                  border: '2px solid #6200EE',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
              >
                {t.login}
              </button>
              <button
                onClick={() => {
                  router.push('/signup');
                  setMobileMenuOpen(false);
                }}
                style={{
                  padding: '10px 16px',
                  background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                  transition: 'transform 0.2s',
                  boxShadow: '0 4px 15px rgba(98,0,238,0.3)',
                  width: '100%'
                }}
              >
                {t.signup}
              </button>
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <div style={{
        padding: windowWidth <= 1000 ? '4px 20px 30px' : '60px 60px 50px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: windowWidth <= 1000 ? '55px' : '96px',
          fontWeight: '900',
          marginBottom: '20px',
          lineHeight: '1.2',
          background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 50%, #B388FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: windowWidth <= 1000 ? '-1px' : '-2px',
          wordBreak: 'keep-all',
          overflowWrap: 'normal'
        }}>
          MyTone
        </h1>

        <div style={{
          // display: 'inline-block',
          padding: '8px 55px',
          marginBottom: '30px',
          fontSize: windowWidth <= 1000 ? '25px' : '34px',
          fontWeight: '600',
          color: 'transparent',
          background: 'linear-gradient(135deg, #6200EE 0%, #ffffff 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          // border: '1px solid rgba(98,0,238,0.3)',
          // borderRadius: '20px',
          maxWidth: '90%'
        }}>
          {t.tagline}
        </div>
        
        <h2 style={{
          fontSize: windowWidth <= 480 ? '20px' : windowWidth <= 1000 ? '48px' : '72px',
          fontWeight: '800',
          marginBottom: '30px',
          lineHeight: '1.2',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #C4B5FD 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          wordBreak: 'keep-all',
          overflowWrap: 'break-word'
        }}>
          {t.heroTitle}
        </h2>
        
        <p style={{
          fontSize: windowWidth <= 1000 ? '12px' : '20px',
          color: '#aaa',
          marginBottom: windowWidth <= 1000 ? '30px' : '50px',
          maxWidth: '800px',
          margin: windowWidth <= 1000 ? '0 auto 30px' : '0 auto 50px',
          lineHeight: '1.6',
          padding: windowWidth <= 1000 ? '0 10px' : '0'
        }}>
          {t.heroDescription}
        </p>
      </div>

      {/* Onglets */}
      <div style={{
        background: 'rgba(20,20,20,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'center',
        gap: '0'
      }}>
        <button
          onClick={() => setActiveTab('download')}
          style={{
            flex: windowWidth <= 1000 ? '1' : '0 0 auto',
            minWidth: windowWidth <= 1000 ? 'auto' : '350px',
            padding: windowWidth <= 1000 ? '14px 20px' : '18px 40px',
            background: activeTab === 'download' ? 'rgba(98,0,238,0.2)' : 'transparent',
            color: activeTab === 'download' ? '#9D4EDD' : '#888',
            border: 'none',
            borderBottom: activeTab === 'download' ? '3px solid #6200EE' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: windowWidth <= 1000 ? '15px' : '15px',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
        >
          📱 {t.downloadTab || 'Téléchargement'}
        </button>
        <button
          onClick={() => setActiveTab('news')}
          style={{
            flex: windowWidth <= 1000 ? '1' : '0 0 auto',
            minWidth: windowWidth <= 1000 ? 'auto' : '350px',
            padding: windowWidth <= 1000 ? '14px 20px' : '18px 40px',
            background: activeTab === 'news' ? 'rgba(98,0,238,0.2)' : 'transparent',
            color: activeTab === 'news' ? '#9D4EDD' : '#888',
            border: 'none',
            borderBottom: activeTab === 'news' ? '3px solid #6200EE' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: windowWidth <= 1000 ? '15px' : '15px',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
        >
          📰 {t.newsTab || 'Actualités'}
        </button>
      </div>

      {/* Contenu des onglets */}
      <div style={{ padding: windowWidth <= 1000 ? '40px 20px' : '60px 40px', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'download' && (
          <div>
            {/* Download Section */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(98,0,238,0.1) 0%, rgba(157,78,221,0.1) 100%)',
              border: '1px solid rgba(98,0,238,0.2)',
              borderRadius: windowWidth <= 1000 ? '16px' : '24px',
              padding: windowWidth <= 1000 ? '30px 20px' : '50px',
              maxWidth: '700px',
              margin: windowWidth <= 1000 ? '0 auto 40px' : '0 auto 60px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>📱</div>
              <h2 style={{ color: 'white', marginTop: 0, marginBottom: '15px', fontSize: windowWidth <= 1000 ? '24px' : '32px', fontWeight: '700' }}>
                {t.downloadTitle}
              </h2>
              <p style={{ color: '#bbb', marginBottom: '35px', fontSize: '16px' }}>
                {t.downloadDescription}
              </p>
              <button
                onClick={handleDownload}
                disabled={downloading}
                style={{
                  display: 'inline-block',
                  padding: windowWidth <= 1000 ? '14px 30px' : '18px 50px',
                  background: downloading ? 'rgba(100,100,100,0.5)' : 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
                  color: 'white',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: windowWidth <= 1000 ? '16px' : '18px',
                  boxShadow: downloading ? 'none' : '0 8px 25px rgba(98,0,238,0.4)',
                  transition: 'all 0.3s',
                  border: 'none',
                  cursor: downloading ? 'not-allowed' : 'pointer'
                }}
              >
                {downloading ? `⏳ ${t.downloading}` : `⏬ ${t.downloadButton}`}
              </button>
              <p style={{ 
                color: '#888', 
                marginTop: '25px', 
                fontSize: '13px' 
              }}>
                💡 {t.downloadTip || 'Activez l\'installation depuis des sources inconnues dans vos paramètres'}
              </p>
            </div>
            {/* Features - Mobile Carousel */}
            {windowWidth <= 768 && (
              <div style={{
                position: 'relative',
                marginBottom: '40px'
              }}>
                {/* Carousel Container */}
                <div ref={(el) => {
                  if (el) window.featureCarousel = el;
                }}
                  className="carousel-no-scrollbar"
                  style={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: '20px',
                    paddingBottom: '15px',
                    scrollBehavior: 'smooth',
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch'
                  }}
                  onScroll={(e) => setFeatureScrollPos(e.target.scrollLeft)}
                >
                  {/* Card 1 */}
                  <div style={{
                    flexShrink: 0,
                    width: windowWidth <= 480 ? '255px' : '320px',
                    background: 'rgba(20,20,20,0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '40px 25px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,107,107,0.2)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,107,107,0.2)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎤</div>
                    <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '20px', fontWeight: '700' }}>
                      {t.feature1Title}
                    </h3>
                    <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
                      {t.feature1Desc}
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div style={{
                    flexShrink: 0,
                    width: windowWidth <= 480 ? '255px' : '320px',
                    background: 'rgba(20,20,20,0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '40px 25px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,142,83,0.2)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,142,83,0.2)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎸</div>
                    <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '20px', fontWeight: '700' }}>
                      {t.feature2Title}
                    </h3>
                    <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
                      {t.feature2Desc}
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div style={{
                    flexShrink: 0,
                    width: windowWidth <= 480 ? '255px' : '320px',
                    background: 'rgba(20,20,20,0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '40px 25px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,160,122,0.2)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,160,122,0.2)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎺</div>
                    <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '20px', fontWeight: '700' }}>
                      {t.feature3Title}
                    </h3>
                    <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
                      {t.feature3Desc}
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div style={{
                    flexShrink: 0,
                    width: windowWidth <= 480 ? '255px' : '320px',
                    background: 'rgba(20,20,20,0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '40px 25px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,107,107,0.2)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,107,107,0.2)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤖</div>
                    <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '20px', fontWeight: '700' }}>
                      {t.feature4Title}
                    </h3>
                    <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
                      {t.feature4Desc}
                    </p>
                  </div>

                  {/* Card 5 */}
                  <div style={{
                    flexShrink: 0,
                    width: windowWidth <= 480 ? '255px' : '320px',
                    background: 'rgba(20,20,20,0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '40px 25px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,142,83,0.2)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,142,83,0.2)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
                    <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '20px', fontWeight: '700' }}>
                      {t.feature5Title}
                    </h3>
                    <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
                      {t.feature5Desc}
                    </p>
                  </div>

                  {/* Card 6 */}
                  <div style={{
                    flexShrink: 0,
                    width: windowWidth <= 480 ? '255px' : '320px',
                    background: 'rgba(20,20,20,0.8)',
                    backdropFilter: 'blur(10px)',
                    padding: '40px 25px',
                    borderRadius: '20px',
                    border: '1px solid rgba(255,160,122,0.2)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }} onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,160,122,0.2)';
                  }} onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
                    <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '20px', fontWeight: '700' }}>
                      {t.feature6Title}
                    </h3>
                    <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '14px' }}>
                      {t.feature6Desc}
                    </p>
                  </div>
                </div>

                {/* Scroll Indicator for Mobile */}
                <div style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  fontSize: '12px',
                  color: '#888'
                }}>
                  ← Glissez pour plus →
                </div>
              </div>
            )}

            {/* Features - Desktop Grid */}
            {windowWidth > 768 && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '30px',
                maxWidth: '1100px',
                margin: '0 auto',
                marginBottom: '40px'
              }}>
                {/* Card 1 */}
                <div style={{
                  background: 'rgba(20,20,20,0.8)',
                  backdropFilter: 'blur(10px)',
                  padding: '40px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,107,107,0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,107,107,0.2)';
                }} onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎤</div>
                  <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
                    {t.feature1Title}
                  </h3>
                  <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
                    {t.feature1Desc}
                  </p>
                </div>

                {/* Card 2 */}
                <div style={{
                  background: 'rgba(20,20,20,0.8)',
                  backdropFilter: 'blur(10px)',
                  padding: '40px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,142,83,0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,142,83,0.2)';
                }} onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎸</div>
                  <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
                    {t.feature2Title}
                  </h3>
                  <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
                    {t.feature2Desc}
                  </p>
                </div>

                {/* Card 3 */}
                <div style={{
                  background: 'rgba(20,20,20,0.8)',
                  backdropFilter: 'blur(10px)',
                  padding: '40px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,160,122,0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,160,122,0.2)';
                }} onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎺</div>
                  <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
                    {t.feature3Title}
                  </h3>
                  <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
                    {t.feature3Desc}
                  </p>
                </div>

                {/* Card 4 */}
                <div style={{
                  background: 'rgba(20,20,20,0.8)',
                  backdropFilter: 'blur(10px)',
                  padding: '40px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,107,107,0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,107,107,0.2)';
                }} onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤖</div>
                  <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
                    {t.feature4Title}
                  </h3>
                  <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
                    {t.feature4Desc}
                  </p>
                </div>

                {/* Card 5 */}
                <div style={{
                  background: 'rgba(20,20,20,0.8)',
                  backdropFilter: 'blur(10px)',
                  padding: '40px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,142,83,0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,142,83,0.2)';
                }} onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
                  <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
                    {t.feature5Title}
                  </h3>
                  <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
                    {t.feature5Desc}
                  </p>
                </div>

                {/* Card 6 */}
                <div style={{
                  background: 'rgba(20,20,20,0.8)',
                  backdropFilter: 'blur(10px)',
                  padding: '40px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,160,122,0.2)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }} onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(255,160,122,0.2)';
                }} onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
                  <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
                    {t.feature6Title}
                  </h3>
                  <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
                    {t.feature6Desc}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'news' && (
          <div>
            <h2 style={{ 
              color: 'white', 
              fontSize: windowWidth <= 1000 ? '24px' : '32px', 
              fontWeight: '700', 
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              {t.latestNews}
            </h2>

            {loadingNews ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#888'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                <p>{t.loading}</p>
              </div>
            ) : news.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#666'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📭</div>
                <p style={{ fontSize: '16px' }}>{t.noNews}</p>
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '25px',
                maxWidth: '900px',
                margin: '0 auto'
              }}>
                {news.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: windowWidth <= 1000 ? '20px' : '30px',
                      background: 'rgba(20,20,20,0.8)',
                      border: '1px solid rgba(98,0,238,0.2)',
                      borderRadius: '16px',
                      transition: 'transform 0.2s, border-color 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = 'rgba(98,0,238,0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'rgba(98,0,238,0.2)';
                    }}
                  >
                    <h3 style={{ 
                      margin: '0 0 15px 0', 
                      color: 'white', 
                      fontSize: windowWidth <= 1000 ? '18px' : '22px',
                      fontWeight: '600'
                    }}>
                      {item[`news_title_${currentLanguage}`] || item.news_title_en}
                    </h3>
                    <p style={{ 
                      margin: '0 0 15px 0', 
                      color: '#bbb', 
                      lineHeight: '1.7',
                      fontSize: windowWidth <= 1000 ? '14px' : '15px'
                    }}>
                      {item[`news_description_${currentLanguage}`] || item.news_description_en}
                    </p>
                    <small style={{ color: '#666', fontSize: '13px' }}>
                      📅 {new Date(item.created_at).toLocaleDateString(currentLanguage === 'fr' ? 'fr-FR' : 'en-US', {
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
        )}
      </div>
      
      {/* Mission Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(98,0,238,0.05) 0%, rgba(157,78,221,0.05) 100%)',
        padding: windowWidth <= 1000 ? '50px 20px' : '80px 40px',
        marginTop: windowWidth <= 1000 ? '40px' : '60px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: windowWidth <= 1000 ? '28px' : '42px',
            fontWeight: '700',
            marginBottom: '30px',
            color: 'white'
          }}>
            {t.missionTitle}
          </h2>
          <p style={{
            fontSize: windowWidth <= 1000 ? '16px' : '20px',
            color: '#bbb',
            lineHeight: '1.8',
            marginBottom: '0'
          }}>
            {t.missionText}
          </p>
        </div>
      </div>

      {/* Social Media Section */}
      <div style={{
        padding: windowWidth <= 1000 ? '40px 20px' : '50px 40px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <h3 style={{
          fontSize: windowWidth <= 1000 ? '20px' : '24px',
          fontWeight: '600',
          marginBottom: '25px',
          color: 'white'
        }}>
          {t.followUs || 'Suivez-nous'}
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: windowWidth <= 1000 ? '20px' : '30px',
          flexWrap: 'wrap'
        }}>
          <a
            href="https://discord.gg/vhWKA3ugZt"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#9D4EDD',
              transition: 'transform 0.2s',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="48" height="48" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="#5865F2"/>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Discord</span>
          </a>
          <a
            href="https://www.instagram.com/mytoneappmusic?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#9D4EDD',
              transition: 'transform 0.2s',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="url(#instagram-gradient)"/>
              <defs>
                <linearGradient id="instagram-gradient" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FD5"/>
                  <stop offset=".5" stopColor="#FF543E"/>
                  <stop offset="1" stopColor="#C837AB"/>
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Instagram</span>
          </a>
          <a
            href="https://www.tiktok.com/@mytoneapp"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#9D4EDD',
              transition: 'transform 0.2s',
              gap: '8px'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <svg width="48" height="48" viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25v178.72A162.55 162.55 0 1 1 185 188.31v89.89a74.62 74.62 0 1 0 52.23 71.18V0h88a121.18 121.18 0 0 0 1.86 22.17A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14z" fill="#ffffff"/>
            </svg>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>TikTok</span>
          </a>
          
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: windowWidth <= 1000 ? '40px 20px' : '50px 40px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 50%, #B388FF 100%)',

          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '15px',
          paddingBottom: '5px',
          lineHeight: '1.4'
        }}>
          MyTone
        </div>
        <p style={{ margin: '10px 0', color: '#666', fontSize: '14px' }}>
          {t.footerSlogan}
        </p>
        <p style={{ margin: '20px 0 0 0', color: '#444', fontSize: '13px' }}>
          {t.footerCopyright}
          {' · '}
          <a href="/cgu" style={{ color: '#9D4EDD', textDecoration: 'none' }}>
            {t.cguTitle || 'CGU'}
          </a>
        </p>
      </footer>
    </div>
  );
}