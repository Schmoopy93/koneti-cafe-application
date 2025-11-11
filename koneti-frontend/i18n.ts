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

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'sr', // Default language, will be overridden by URL parameter
    fallbackLng: 'sr',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false // Važno za SSR
    }
  });

export default i18n;