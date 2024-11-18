'use client';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const { t } = useTranslation();
  const { logout } = useAuth();

  return (
    <Button 
      variant="destructive" 
      onClick={logout}
    >
      {t('common.logout')}
    </Button>
  );
} 