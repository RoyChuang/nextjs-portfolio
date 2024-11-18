import { create } from 'zustand';
import Cookies from 'js-cookie';
import { pb } from '@/lib/pocketbase';
import { User } from '@/types/user'; // 添加这行导入语句


interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (userData) => {
    set({
      isAuthenticated: true,
      user: userData
    });
  },
  logout: () => {
    pb.authStore.clear();
    set({ isAuthenticated: false, user: null });
    Cookies.remove('auth-token');
  },
}));