'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/contexts/translations';
import LanguageSelector from '@/components/LanguageSelector';

// Composant pour l'upload APK
function ApkUploadSection() {
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.apk')) {
        setUploadMessage('❌ ' + t.apkFileRequired);
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setUploadMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('❌ ' + t.pleaseSelectApk);
      return;
    }

    setUploading(true);
    setUploadMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/apk', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadMessage('✅ APK uploadé avec succès !');
        setFile(null);
        // Reset l'input file
        const fileInput = document.getElementById('apk-file-input');
        if (fileInput) fileInput.value = '';
      } else {
        setUploadMessage(`❌ ${data.error || 'Erreur lors de l\'upload'}`);
      }
    } catch (error) {
      setUploadMessage('❌ Erreur de connexion au serveur');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {uploadMessage && (
        <div style={{
          padding: '14px',
          borderRadius: '12px',
          marginBottom: '20px',
          background: uploadMessage.includes('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          color: uploadMessage.includes('✅') ? '#22c55e' : '#EF4444',
          border: `1px solid ${uploadMessage.includes('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          fontSize: '14px',
          textAlign: 'center'
        }}>
          {uploadMessage}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
        padding: '30px',
        background: 'rgba(30,30,30,0.6)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <input
          id="apk-file-input"
          type="file"
          accept=".apk"
          onChange={handleFileChange}
          style={{
            flex: 1,
            padding: '12px',
            background: 'rgba(20,20,20,0.8)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        />
        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          style={{
            padding: '12px 30px',
            background: uploading || !file ? 'rgba(100,100,100,0.5)' : 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: uploading || !file ? 'not-allowed' : 'pointer',
            boxShadow: uploading || !file ? 'none' : '0 4px 15px rgba(98,0,238,0.3)',
            transition: 'all 0.3s',
            whiteSpace: 'nowrap'
          }}
        >
          {uploading ? t.uploading : t.uploadApk}
        </button>
      </div>

      {file && (
        <div style={{
          marginTop: '15px',
          padding: '12px',
          background: 'rgba(98,0,238,0.1)',
          border: '1px solid rgba(98,0,238,0.3)',
          borderRadius: '10px',
          color: '#9D4EDD',
          fontSize: '13px'
        }}>
          {t.fileSelected}: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [news, setNews] = useState([]);
  const [activeTab, setActiveTab] = useState('news'); // 'news' ou 'apk'
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  // Données multilingues
  const [formData, setFormData] = useState({
    title_en: '', description_en: '',
    title_fr: '', description_fr: '',
    title_es: '', description_es: '',
    title_it: '', description_it: '',
    title_de: '', description_de: '',
    title_zh: '', description_zh: ''
  });

  const languages = [
    { code: 'en', name: 'Anglais', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Espagnol', flag: '🇪🇸' },
    { code: 'it', name: 'Italien', flag: '🇮🇹' },
    { code: 'de', name: 'Allemand', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinois', flag: '🇨🇳' }
  ];

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login/admin');
    }
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('✅ News créée avec succès !');
        setFormData({
          title_en: '', description_en: '',
          title_fr: '', description_fr: '',
          title_es: '', description_es: '',
          title_it: '', description_it: '',
          title_de: '', description_de: '',
          title_zh: '', description_zh: ''
        });
        fetchNews();
      } else {
        const data = await response.json();
        setMessage('❌ ' + (data.error || 'Erreur lors de la création'));
      }
    } catch (error) {
      setMessage('❌ Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (status === 'loading') {
    return <div style={{ padding: '40px', textAlign: 'center', background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>{t.loading}</div>;
  }

  if (!session || session.user?.role !== 'admin') {
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
          MyTone Admin
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <LanguageSelector />
          <span style={{ color: '#888', fontSize: '14px' }}>
            🔒 {session.user.username || session.user.name}
          </span>
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

      {/* Onglets */}
      <div style={{
        background: 'rgba(20,20,20,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex'
      }}>
        <button
          onClick={() => setActiveTab('news')}
          style={{
            flex: 1,
            padding: '18px 30px',
            background: activeTab === 'news' ? 'rgba(98,0,238,0.2)' : 'transparent',
            color: activeTab === 'news' ? '#9D4EDD' : '#888',
            border: 'none',
            borderBottom: activeTab === 'news' ? '3px solid #6200EE' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
        >
          {t.newsManagement}
        </button>
        <button
          onClick={() => setActiveTab('apk')}
          style={{
            flex: 1,
            padding: '18px 30px',
            background: activeTab === 'apk' ? 'rgba(98,0,238,0.2)' : 'transparent',
            color: activeTab === 'apk' ? '#9D4EDD' : '#888',
            border: 'none',
            borderBottom: activeTab === 'apk' ? '3px solid #6200EE' : '3px solid transparent',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            transition: 'all 0.3s'
          }}
        >
          {t.uploadApkTab}
        </button>
      </div>

      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section Upload APK */}
        {activeTab === 'apk' && (
          <div style={{
            background: 'rgba(20,20,20,0.6)',
            border: '1px solid rgba(98,0,238,0.2)',
            padding: '40px',
            borderRadius: '20px',
            marginBottom: '30px'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '30px', color: 'white', fontSize: '28px', fontWeight: '700' }}>
              {t.uploadApkTitle}
            </h2>
            <ApkUploadSection />
          </div>
        )}

        {/* Section News */}
        {activeTab === 'news' && (
          <>
            <div style={{
              background: 'rgba(20,20,20,0.6)',
              border: '1px solid rgba(98,0,238,0.2)',
              padding: '40px',
              borderRadius: '20px',
              marginBottom: '30px'
            }}>
              <h2 style={{ marginTop: 0, marginBottom: '30px', color: 'white', fontSize: '28px', fontWeight: '700' }}>
                {t.createNews}
              </h2>

          {message && (
            <div style={{
              padding: '14px',
              borderRadius: '12px',
              marginBottom: '25px',
              background: message.includes('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(255,107,107,0.1)',
              color: message.includes('✅') ? '#22c55e' : '#FF6B6B',
              border: `1px solid ${message.includes('✅') ? 'rgba(34,197,94,0.3)' : 'rgba(255,107,107,0.3)'}`,
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
              gap: '30px'
            }}>
              {languages.map(lang => (
                <div
                  key={lang.code}
                  style={{
                    padding: '25px',
                    background: 'rgba(30,30,30,0.6)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px'
                  }}
                >
                  <h3 style={{
                    margin: '0 0 20px 0',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ fontSize: '24px' }}>{lang.flag}</span>
                    {lang.name}
                  </h3>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#bbb',
                      fontWeight: '500',
                      fontSize: '13px'
                    }}>
                      {t.title}
                    </label>
                    <input
                      type="text"
                      value={formData[`title_${lang.code}`]}
                      onChange={(e) => handleInputChange(`title_${lang.code}`, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(20,20,20,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        color: 'white',
                        outline: 'none'
                      }}
                      placeholder={`${t.title} (${lang.name})`}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#bbb',
                      fontWeight: '500',
                      fontSize: '13px'
                    }}>
                      {t.description}
                    </label>
                    <textarea
                      value={formData[`description_${lang.code}`]}
                      onChange={(e) => handleInputChange(`description_${lang.code}`, e.target.value)}
                      rows="4"
                      style={{
                        width: '100%',
                        padding: '12px',
                        background: 'rgba(20,20,20,0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        color: 'white',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                      placeholder={`${t.description} (${lang.name})`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '30px',
              paddingTop: '30px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              textAlign: 'center'
            }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '16px 50px',
                  background: loading ? 'rgba(100,100,100,0.5)' : 'linear-gradient(135deg, #6200EE 0%, #9D4EDD 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(98,0,238,0.3)',
                  transition: 'all 0.3s'
                }}
              >
                {loading ? t.publishing : t.publishNews}
              </button>
            </div>
          </form>
        </div>

        {/* Liste des news */}
        <div style={{
          background: 'rgba(20,20,20,0.6)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '40px',
          borderRadius: '20px'
        }}>
          <h2 style={{ marginTop: 0, marginBottom: '25px', color: 'white', fontSize: '24px', fontWeight: '700' }}>
            {t.publishedNews} ({news.length})
          </h2>

          {news.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>{t.noNews}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {news.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '30px',
                    background: 'rgba(30,30,30,0.8)',
                    border: '1px solid rgba(98,0,238,0.2)',
                    borderRadius: '16px'
                  }}
                >
                  <div style={{ 
                    marginBottom: '20px', 
                    paddingBottom: '15px', 
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h3 style={{ margin: 0, color: 'white', fontSize: '20px', fontWeight: '700' }}>
                      News #{item.id}
                    </h3>
                    <small style={{ color: '#666', fontSize: '12px' }}>
                      📅 {new Date(item.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </small>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '20px'
                  }}>
                    {languages.map(lang => (
                      <div
                        key={lang.code}
                        style={{
                          padding: '20px',
                          background: 'rgba(20,20,20,0.6)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          borderRadius: '12px'
                        }}
                      >
                        <h4 style={{
                          margin: '0 0 12px 0',
                          color: 'white',
                          fontSize: '15px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{ fontSize: '20px' }}>{lang.flag}</span>
                          {lang.name}
                        </h4>
                        <p style={{ 
                          margin: '0 0 10px 0', 
                          color: '#ddd', 
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {item[`news_title_${lang.code}`] || <span style={{ color: '#666', fontStyle: 'italic' }}>Non renseigné</span>}
                        </p>
                        <p style={{ 
                          margin: 0, 
                          color: '#999', 
                          fontSize: '13px',
                          lineHeight: '1.5'
                        }}>
                          {item[`news_description_${lang.code}`] || <span style={{ color: '#555', fontStyle: 'italic' }}>Non renseigné</span>}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
}