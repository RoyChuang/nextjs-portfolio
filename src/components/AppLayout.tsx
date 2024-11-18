"use client"

import { useAuthStore } from '@/store/authStore';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LogoutButton } from '@/components/LogoutButton';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 w-full">
          <div className="sticky top-0 p-4 bg-background z-50 flex justify-between items-center">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <LogoutButton />
            </div>
          </div>
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  ) : (
    <div className="min-h-screen">
      {children}
    </div>
  );
}