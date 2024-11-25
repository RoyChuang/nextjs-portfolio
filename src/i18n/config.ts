'use client';

import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import Cookies from 'js-cookie';
import { initReactI18next } from 'react-i18next';

export const LANG_COOKIE_NAME = 'NEXT_LOCALE';

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    lng: Cookies.get(LANG_COOKIE_NAME) || 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
      skipOnVariables: false, // 添加這行，確保變量被正確處理
      prefix: '{', // 添加這行，指定變量前綴
      suffix: '}', // 添加這行，指定變量後綴
    },
    detection: {
      order: ['cookie'],
      lookupCookie: LANG_COOKIE_NAME,
      caches: ['cookie'],
    },
  });

export default i18next;
