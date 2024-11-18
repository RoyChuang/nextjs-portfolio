import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // 設置 cookie
      Cookies.set('auth-token', data.token);
      // 更新 zustand store
      setAuth({
        username: data.record.username,
        email: data.record.email,
        avatar: data.record.avatar,
        ...data.record
      });
      router.replace('/dashboard');
    },
    onError: () => {
      // 確保清除所有認證狀態
      pb.authStore.clear();
      Cookies.remove('auth-token');
    }
  });

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };


  return {
    login: loginMutation.mutate,
    logout: handleLogout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}