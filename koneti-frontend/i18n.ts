import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import translationSR from './locales/sr.json';
import translationEN from './locales/en.json';

const resources = {
  sr: {
    translation: translationSR
  },
  en: {
    translation: translationEN
  }
};

// Provera da li smo na klijentu
const isBrowser = typeof window !== 'undefined';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: isBrowser ? (localStorage.getItem('language') || 'sr') : 'sr',
    fallbackLng: 'sr',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false // Važno za SSR
    }
  });

export default i18n;