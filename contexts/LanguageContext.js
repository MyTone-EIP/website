'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const languages = {
  fr: { name: 'Français', flag: '🇫🇷' },
  en: { name: 'English', flag: '🇬🇧' },
  es: { name: 'Español', flag: '🇪🇸' },
  it: { name: 'Italiano', flag: '🇮🇹' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  zh: { name: '中文', flag: '🇨🇳' }
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('fr');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Récupérer la langue sauvegardée
    try {
      const saved = localStorage.getItem('language');
      if (saved && languages[saved]) {
        setCurrentLanguage(saved);
      }
    } catch (error) {
      // localStorage peut être bloqué en navigation privée
      console.warn('localStorage not available:', error);
    }
  }, []);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (error) {
      // localStorage peut être bloqué en navigation privée
      console.warn('localStorage not available:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, languages, isClient }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
