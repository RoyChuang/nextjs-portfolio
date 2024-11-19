import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import { authApi } from '@/api/auth';
import { pb } from '@/lib/pocketbase';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      Cookies.set('auth-token', data.token);
      setAuth({
        username: data.record.username,
        email: data.record.email,
        avatar: data.record.avatar,
        ...data.record,
      });
      router.push('/dashboard');
    },
    onError: () => {
      pb.authStore.clear();
      Cookies.remove('auth-token');
    },
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return {
    login: loginMutation.mutate,
    logout: handleLogout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
}
