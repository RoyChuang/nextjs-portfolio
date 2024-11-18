import { create } from 'zustand';
import Cookies from 'js-cookie';
import { pb } from '@/lib/pocketbase';
import { User } from '@/types/user';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setAuth: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: pb.authStore.isValid,
  user: pb.authStore.model as User | null,
  setAuth: (userData) => {
    set({
      isAuthenticated: true,
      user: userData
    });
  },
  logout: () => {
    pb.authStore.clear();
    Cookies.remove('auth-token');
    set({ isAuthenticated: false, user: null });
  },
})); 