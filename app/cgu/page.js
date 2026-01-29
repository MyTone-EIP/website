'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/contexts/translations';
import LanguageSelector from '@/components/LanguageSelector';

export default function CGUPage() {
  const { currentLanguage, isClient } = useLanguage();
  const t = translations[currentLanguage] || translations.fr;

  if (!isClient) {
    return <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Chargement...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Navigation */}
      <nav style={{
        background: 'rgba(20,20,20,0.8)',
        backdropFilter: 'blur(20px)',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
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
        </a>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LanguageSelector />
          <a
            href="/"
            style={{
              padding: '8px 16px',
              background: 'rgba(98,0,238,0.1)',
              color: '#9D4EDD',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              border: '1px solid rgba(98,0,238,0.3)',
              fontWeight: '500'
            }}
          >
            {t.backToHome}
          </a>
        </div>
      </nav>

      {/* Contenu principal */}
      <div style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(20,20,20,0.6)',
          border: '1px solid rgba(98,0,238,0.2)',
          padding: '50px',
          borderRadius: '20px'
        }}>
          <h1 style={{
            margin: '0 0 20px 0',
            color: 'white',
            fontSize: '42px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            {t.cguTitle}
          </h1>
          
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '40px' }}>
            {t.cguLastUpdate}: 10 décembre 2025
          </p>

          <div style={{ color: '#ccc', lineHeight: '1.8', fontSize: '15px' }}>
            {/* Section 1 */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>
                1. {t.cguSection1Title}
              </h2>
              <p style={{ marginBottom: '15px' }}>
                {t.cguSection1Text}
              </p>
            </section>

            {/* Section 2 */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>
                2. {t.cguSection2Title}
              </h2>
              <p style={{ marginBottom: '15px' }}>
                {t.cguSection2Text}
              </p>
              <ul style={{ paddingLeft: '25px', marginTop: '10px' }}>
                <li style={{ marginBottom: '8px' }}>{t.cguSection2Item1}</li>
                <li style={{ marginBottom: '8px' }}>{t.cguSection2Item2}</li>
                <li style={{ marginBottom: '8px' }}>{t.cguSection2Item3}</li>
                <li style={{ marginBottom: '8px' }}>{t.cguSection2Item4}</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>
                3. {t.cguSection3Title}
              </h2>
              <p style={{ marginBottom: '15px' }}>
                {t.cguSection3Text}
              </p>
            </section>

            {/* Section 4 */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>
                4. {t.cguSection4Title}
              </h2>
              <p style={{ marginBottom: '15px' }}>
                {t.cguSection4Text}
              </p>
            </section>

            {/* Section 5 */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>
                5. {t.cguSection5Title}
              </h2>
              <p style={{ marginBottom: '15px' }}>
                {t.cguSection5Text}
              </p>
            </section>

            {/* Section 6 */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>
                6. {t.cguSection6Title}
              </h2>
              <p style={{ marginBottom: '15px' }}>
                {t.cguSection6Text}
              </p>
            </section>

            {/* Section 7 */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>
                7. {t.cguSection7Title}
              </h2>
              <p style={{ marginBottom: '15px' }}>
                {t.cguSection7Text}
              </p>
            </section>

            {/* Section 8 */}
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '15px' }}>
                8. {t.cguSection8Title}
              </h2>
              <p style={{ marginBottom: '15px' }}>
                {t.cguSection8Text}
              </p>
            </section>

            {/* Contact */}
            <section style={{
              marginTop: '50px',
              padding: '25px',
              background: 'rgba(98,0,238,0.1)',
              border: '1px solid rgba(98,0,238,0.3)',
              borderRadius: '12px'
            }}>
              <h3 style={{ color: '#9D4EDD', fontSize: '18px', fontWeight: '600', marginBottom: '10px' }}>
                {t.cguContact}
              </h3>
              <p>
                Email: <a href="mailto:contact@mytone.app" style={{ color: '#6200EE', textDecoration: 'none' }}>contact@mytone.app</a>
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '30px 40px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        <p>© 2025 MyTone. {t.cguFooter}</p>
      </footer>
    </div>
  );
}
