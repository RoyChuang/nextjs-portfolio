'use client';

import { PropsWithChildren, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '@/i18n/config';
import { useLanguageStore } from '@/store/languageStore';

export function I18nProvider({ children }: PropsWithChildren) {
  const { currentLanguage } = useLanguageStore();

  useEffect(() => {
    i18next.changeLanguage(currentLanguage);
  }, [currentLanguage]);

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
} 