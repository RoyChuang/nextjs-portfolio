'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import { AppSidebar } from '@/components/AppSidebar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LogoutButton } from '@/components/LogoutButton';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/authStore';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      redirect('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="w-full flex-1">
          <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <LogoutButton />
            </div>
          </div>
          <div className="w-full">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
