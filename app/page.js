'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/contexts/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function Home() {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/apk');
      const data = await response.json();
      
      if (data.url) {
        // Ouvrir l'URL de téléchargement dans un nouvel onglet
        window.open(data.url, '_blank');
      } else {
        alert('APK non disponible pour le moment');
      }
    } catch (error) {
      alert('Erreur lors du téléchargement');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: 'white'
    }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(20px)',
        padding: '20px 60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#6200EE'
          }}>
            MyTone
          </div>
          <span style={{ fontSize: '12px', color: '#888', fontWeight: '400' }}>BETA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <LanguageSelector />
          <button
            onClick={() => router.push('/login/user')}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 15px rgba(98,0,238,0.3)'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {t.connection}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        padding: '0px 50px 60px',
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '96px',
          fontWeight: '900',
          marginBottom: '20px',
          lineHeight: '1.2',
          paddingTop: '10px',
          paddingBottom: '10px',
          background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 50%, #B388FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-2px'
        }}>
          MyTone
        </h1>

        <div style={{
          display: 'inline-block',
          padding: '8px 20px',
          background: 'rgba(98,0,238,0.1)',
          border: '1px solid rgba(98,0,238,0.3)',
          borderRadius: '20px',
          marginBottom: '30px',
          fontSize: '14px',
          fontWeight: '600',
          color: '#6200EE'
        }}>
          {t.tagline}
        </div>
        
        <h2 style={{
          fontSize: '72px',
          fontWeight: '800',
          marginBottom: '30px',
          lineHeight: '1.1',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #C4B5FD 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {t.heroTitle}
        </h2>
        
        <p style={{
          fontSize: '22px',
          color: '#aaa',
          marginBottom: '50px',
          maxWidth: '800px',
          margin: '0 auto 50px',
          lineHeight: '1.6'
        }}>
          {t.heroDescription}
        </p>

        {/* Download Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(98,0,238,0.1) 0%, rgba(157,78,221,0.1) 100%)',
          border: '1px solid rgba(98,0,238,0.2)',
          borderRadius: '24px',
          padding: '50px',
          maxWidth: '700px',
          margin: '0 auto 80px',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📱</div>
          <h2 style={{ color: 'white', marginTop: 0, marginBottom: '15px', fontSize: '32px', fontWeight: '700' }}>
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
              padding: '18px 50px',
              background: downloading ? 'rgba(100,100,100,0.5)' : 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
              color: 'white',
              borderRadius: '30px',
              fontWeight: '700',
              fontSize: '18px',
              boxShadow: downloading ? 'none' : '0 8px 25px rgba(98,0,238,0.4)',
              transition: 'all 0.3s',
              border: 'none',
              cursor: downloading ? 'not-allowed' : 'pointer'
            }}
          >
            {downloading ? `⏳ ${t.downloading}` : `⬇ ${t.downloadButton}`}
          </button>
          <p style={{ 
            color: '#888', 
            marginTop: '25px', 
            fontSize: '13px' 
          }}>
            💡 Activez l'installation depuis des sources inconnues dans vos paramètres
          </p>
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          marginTop: '80px',
          maxWidth: '1100px',
          margin: '80px auto 0'
        }}>
          <div style={{
            background: 'rgba(20,20,20,0.8)',
            backdropFilter: 'blur(10px)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255,107,107,0.2)',
            transition: 'transform 0.3s'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎤</div>
            <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
              Voice to MIDI
            </h3>
            <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
              Transformez votre voix en piste MIDI exploitable en quelques secondes. 
              Chantez ou fredonnez, MyTone fait le reste.
            </p>
          </div>

          <div style={{
            background: 'rgba(20,20,20,0.8)',
            backdropFilter: 'blur(10px)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255,142,83,0.2)',
            transition: 'transform 0.3s'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎸</div>
            <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
              Stem Separation
            </h3>
            <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
              Séparez vos enregistrements en instruments distincts. 
              Isolez la voix, la batterie, la guitare ou la basse.
            </p>
          </div>

          <div style={{
            background: 'rgba(20,20,20,0.8)',
            backdropFilter: 'blur(10px)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255,160,122,0.2)',
            transition: 'transform 0.3s'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎺</div>
            <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
              Timbre Transform
            </h3>
            <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
              Métamorphosez votre timbre en guitare, violon, saxophone ou tout autre instrument.
            </p>
          </div>

          <div style={{
            background: 'rgba(20,20,20,0.8)',
            backdropFilter: 'blur(10px)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255,107,107,0.2)',
            transition: 'transform 0.3s'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🤖</div>
            <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
              AI Composition
            </h3>
            <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
              Enrichissez un simple "huhuhuhu" en véritable composition grâce à l'IA.
            </p>
          </div>

          <div style={{
            background: 'rgba(20,20,20,0.8)',
            backdropFilter: 'blur(10px)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255,142,83,0.2)',
            transition: 'transform 0.3s'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚡</div>
            <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
              Instantané
            </h3>
            <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
              Capturez vos idées partout, à tout moment. Plus aucune inspiration ne se perd.
            </p>
          </div>

          <div style={{
            background: 'rgba(20,20,20,0.8)',
            backdropFilter: 'blur(10px)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255,160,122,0.2)',
            transition: 'transform 0.3s'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎯</div>
            <h3 style={{ color: 'white', margin: '0 0 15px 0', fontSize: '24px', fontWeight: '700' }}>
              Pour Tous
            </h3>
            <p style={{ color: '#aaa', margin: 0, lineHeight: '1.6', fontSize: '15px' }}>
              Accessible aux musiciens débutants comme confirmés. Simple et intuitive.
            </p>
          </div>
        </div>
      </div>
      
      {/* Mission Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(98,0,238,0.05) 0%, rgba(157,78,221,0.05) 100%)',
        padding: '80px 40px',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '30px',
            color: 'white'
          }}>
            Notre Mission
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#bbb',
            lineHeight: '1.8',
            marginBottom: '0'
          }}>
            Rendre la composition musicale <strong style={{ color: '#9D4EDD' }}>instantanée et accessible</strong>, 
            pour que plus aucune idée ne se perde. De la voix à la chanson complète, 
            nous donnons vie à votre inspiration.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '50px 40px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{
          fontSize: '24px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '15px'
        }}>
          MyTone
        </div>
        <p style={{ margin: '10px 0', color: '#666', fontSize: '14px' }}>
          Turn voice into music. Ideas into songs.
        </p>
        <p style={{ margin: '20px 0 0 0', color: '#444', fontSize: '13px' }}>
          © 2025 MyTone - Projet EIP
          {' · '}
          <a href="/cgu" style={{ color: '#9D4EDD', textDecoration: 'none' }}>
            {t.cguTitle || 'CGU'}
          </a>
        </p>
      </footer>
    </div>
  );
}