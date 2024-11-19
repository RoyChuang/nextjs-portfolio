'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18next from '@/i18n/config';
import { useLanguageStore } from '@/store/languageStore';

export function I18nProvider({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);
  const { currentLanguage } = useLanguageStore();

  useEffect(() => {
    setMounted(true);
    i18next.changeLanguage(currentLanguage);
  }, [currentLanguage]);

  if (!mounted) {
    return null;
  }

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
