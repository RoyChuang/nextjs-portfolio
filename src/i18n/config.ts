'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import commonEn from './locales/en/common.json';
import commonZh from './locales/zh/common.json';

const resources = {
  en: {
    common: commonEn,
  },
  zh: {
    common: commonZh,
  },
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: 'en', // 預設語言
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next; 