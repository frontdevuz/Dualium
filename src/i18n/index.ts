import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import uz from './locales/uz';

const savedLanguage = localStorage.getItem('dualium-language');
const defaultLanguage = savedLanguage === 'uz' || savedLanguage === 'en' ? savedLanguage : 'en';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    uz: { translation: uz },
  },
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (language) => {
  localStorage.setItem('dualium-language', language);
});

export default i18n;
