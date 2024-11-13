'use client';

import { useAuthStore } from '@/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const publicPaths = ['/login'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, pathname });
    
    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      console.log('Redirecting to login...');
      router.replace('/login');
    } else if (isAuthenticated && pathname === '/login') {
      console.log('Redirecting to dashboard...');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
} 