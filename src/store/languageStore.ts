import Cookies from 'js-cookie';
import { create } from 'zustand';

import i18n, { LANG_COOKIE_NAME } from '@/i18n/config';

interface LanguageState {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: Cookies.get(LANG_COOKIE_NAME) || 'en',
  setLanguage: (lang: string) => {
    Cookies.set(LANG_COOKIE_NAME, lang, { path: '/' });
    i18n.changeLanguage(lang);
    set({ currentLanguage: lang });
  },
}));
