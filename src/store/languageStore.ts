import { create } from 'zustand';
import i18n from '@/i18n/config';
import Cookies from 'js-cookie';

const LANG_COOKIE_NAME = 'NEXT_LOCALE'

interface LanguageState {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  // 初始化時從 cookie 讀取
  currentLanguage: Cookies.get(LANG_COOKIE_NAME) || 'en',
  setLanguage: (lang: string) => {
    // 設置 cookie
    Cookies.set(LANG_COOKIE_NAME, lang, { path: '/' });
    i18n.changeLanguage(lang);
    set({ currentLanguage: lang });
  },
}));