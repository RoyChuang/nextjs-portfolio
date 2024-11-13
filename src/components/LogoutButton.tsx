'use client';

import { useAuthStore } from '@/store/authStore';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const { t } = useTranslation();
  const logout = useAuthStore((state) => state.logout);

  return (
    <Button 
      variant="destructive" 
      onClick={logout}
    >
      {t('common.logout')}
    </Button>
  );
} 