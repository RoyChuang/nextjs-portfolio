'use client';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { resources } from '@/locales';

export const initI18n = async () => {
  if (!i18n.isInitialized) {
    await i18n
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false,
        },
        load: 'languageOnly',
        supportedLngs: ['en', 'zh'],
      });
  }
  return i18n;
};

export default i18n;
