import { create } from 'zustand';

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
    // 這裡模擬 API 呼叫
    if (email === 'test@test.com' && password === '123') {
      set({ isAuthenticated: true, user: { email } });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, user: null }),
})); 