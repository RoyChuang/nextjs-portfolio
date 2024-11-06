import Cookies from 'js-cookie';
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setAuth: (user) => {
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    Cookies.remove('auth-token');
    window.history.replaceState(null, '', '/login');
    set({ user: null, isAuthenticated: false });
  },
}));
