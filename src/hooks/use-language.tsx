'use client';

import { useState, useEffect, createContext, useContext, type ReactNode, useCallback } from 'react';
import esTranslations from '@/lib/locales/es.json';
import enTranslations from '@/lib/locales/en.json';

type Locale = 'en' | 'es';

type Translations = {
  [key: string]: any;
};

const translations: Record<Locale, Translations> = {
  es: esTranslations,
  en: enTranslations,
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>('es');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en' || browserLang === 'es') {
      setLocale(browserLang);
    }
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let result = translations[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult = translations['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }
        return fallbackResult || key;
      }
    }
    return result || key;
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
