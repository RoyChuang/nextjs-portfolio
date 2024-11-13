import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AuthState {
  isAuthenticated: boolean;
  user: null | { email: string };
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    try {
      if (email === 'test@test.com' && password === '123') {
        const authData = { isAuthenticated: true, user: { email } };
        set(authData);
        Cookies.set('auth', JSON.stringify(authData), { expires: 7 });
        window.location.href = '/dashboard';
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
    Cookies.remove('auth');
    window.location.href = '/login';
  },
}));