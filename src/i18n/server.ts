import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { initReactI18next } from 'react-i18next/initReactI18next';

const LANG_COOKIE_NAME = 'NEXT_LOCALE';

const initI18next = async (lang: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: lang,
      fallbackLng: 'en',
      ns: ['common'],
      defaultNS: 'common',
      interpolation: {
        escapeValue: false,
        skipOnVariables: false,
        prefix: '{',
        suffix: '}',
      },
    });
  return i18nInstance;
};

// 新增 getServerTranslations，使用 cache 優化效能
export const getServerTranslations = cache(async () => {
  const cookieStore = await cookies();
  const lang = cookieStore.get(LANG_COOKIE_NAME)?.value || 'en';

  const i18next = await initI18next(lang);
  return {
    t: i18next.getFixedT(lang),
  };
});
