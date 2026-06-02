import en from './en.json';
import fi from './fi.json';

type TranslationDict = typeof en;
type Locale = 'en' | 'fi';

const dicts: Record<Locale, TranslationDict> = { en, fi };

let currentLocale: Locale = 'en';

/**
 * Initialize locale from localStorage or browser preference.
 */
export function initLocale(): Locale {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('locale') as Locale | null;
    if (stored === 'en' || stored === 'fi') {
      currentLocale = stored;
      document.documentElement.setAttribute('data-lang', stored);
      return stored;
    }
    // Default to English
    currentLocale = 'en';
    document.documentElement.setAttribute('data-lang', 'en');
  }
  return currentLocale;
}

/**
 * Set locale and persist.
 */
export function setLocale(locale: Locale): void {
  currentLocale = locale;
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', locale);
    document.documentElement.setAttribute('data-lang', locale);
  }
}

/**
 * Get current locale.
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Translate a dot-separated key path, e.g. "hero.greeting".
 */
export function t(key: string, locale?: Locale): string {
  const loc = locale ?? currentLocale;
  const dict = dicts[loc];
  const parts = key.split('.');
  let value: unknown = dict;
  for (const part of parts) {
    if (typeof value === 'object' && value !== null && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return key; // fallback: return the key itself
    }
  }
  return typeof value === 'string' ? value : key;
}
