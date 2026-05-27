import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Language } from '../types';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-secondary-300/80 dark:border-zinc-600/70 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800/90 shadow-md dark:shadow-black/40 transition-all duration-300"
      >
        <Globe className="w-4 h-4 text-secondary-800 dark:text-secondary-100" />
        <span className="text-xs tracking-wide font-semibold text-secondary-900 dark:text-secondary-100">
          {currentLanguage.code.toUpperCase()}
        </span>
        <ChevronDown className={`w-4 h-4 text-secondary-700 dark:text-secondary-200 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-52 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-secondary-900/15 dark:shadow-black/55 border border-secondary-300/85 dark:border-white/10 py-2 z-[70] animate-scale-in">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                language === lang.code
                  ? 'bg-luxury-gold/15 dark:bg-luxury-gold/20 text-luxury-gold'
                  : 'hover:bg-secondary-100 dark:hover:bg-zinc-800/90'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className={`text-sm ${
                language === lang.code
                  ? 'text-luxury-gold font-semibold'
                  : 'text-secondary-900 dark:text-zinc-100'
              }`}>
                {lang.code.toUpperCase()} - {lang.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
