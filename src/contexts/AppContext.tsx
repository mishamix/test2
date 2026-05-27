import React, { createContext, useContext, ReactNode } from 'react';
import { useLanguage, useTheme } from '../hooks/useFetch';
import { Language, Theme } from '../types';
import { getTranslation, getLangDirection } from '../i18n';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme, toggleTheme } = useTheme();

  const t = (key: string): string => getTranslation(language, key);
  const dir = getLangDirection(language);

  const value: AppContextType = {
    language,
    setLanguage,
    theme,
    setTheme,
    toggleTheme,
    t,
    dir,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
