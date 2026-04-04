'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SupportedLanguage, defaultLanguage, supportedLanguages, getTranslation } from '@/i18n/messages';

const STORAGE_KEY = 'mood-checker-language';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  supportedLanguages: SupportedLanguage[];
}

const I18nContext = createContext<I18nContextType | null>(null);

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return defaultLanguage;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && supportedLanguages.includes(stored as SupportedLanguage)) {
      return stored as SupportedLanguage;
    }
  } catch {
    // localStorage not available
  }
  return defaultLanguage;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(defaultLanguage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLanguageState(getInitialLanguage());
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage not available
    }
    // Update html lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
    // Sync to backend (fire and forget)
    fetch('/api/user/language', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: lang }),
    }).catch(() => {
      // Silently fail - localStorage is the primary store
    });
  }, []);

  const t = useCallback((key: string): string => {
    return getTranslation(language, key);
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    t,
    supportedLanguages,
  }), [language, setLanguage, t]);

  // Avoid hydration mismatch by rendering with default language on server
  if (!mounted) {
    const serverValue: I18nContextType = {
      language: defaultLanguage,
      setLanguage,
      t: (key: string) => getTranslation(defaultLanguage, key),
      supportedLanguages,
    };
    return (
      <I18nContext.Provider value={serverValue}>
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
}

export default useTranslation;
