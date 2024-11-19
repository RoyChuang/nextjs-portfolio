'use client';

import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function LogoutButton() {
  const { t } = useTranslation();
  const { logout } = useAuth();

  return (
    <Button variant="destructive" onClick={logout}>
      {t('common.logout')}
    </Button>
  );
}
