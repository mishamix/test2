import { Language } from '../types';
import en from './translations/en';
import uk from './translations/uk';
import ru from './translations/ru';
import fr from './translations/fr';
import ar from './translations/ar';

export const translations = {
  en,
  uk,
  ru,
  fr,
  ar,
};

export type TranslationKey = keyof typeof en;

export const getTranslation = (lang: Language, key: string): string => {
  const keys = key.split('.');
  let result: unknown = translations[lang];

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      let fallback: unknown = translations.en;
      for (const fallbackKey of keys) {
        if (fallback && typeof fallback === 'object' && fallbackKey in fallback) {
          fallback = (fallback as Record<string, unknown>)[fallbackKey];
        } else {
          return key;
        }
      }
      return typeof fallback === 'string' ? fallback : key;
    }
  }

  return typeof result === 'string' ? result : key;
};

export const isRTL = (lang: Language): boolean => lang === 'ar';

export const getLangDirection = (lang: Language): 'rtl' | 'ltr' => {
  return isRTL(lang) ? 'rtl' : 'ltr';
};

export { en, uk, ru, fr, ar };
