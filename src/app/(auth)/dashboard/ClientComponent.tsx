'use client';

import { useTranslation } from 'react-i18next';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ClientComponent() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.clientComponent')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Client-side rendered content</p>
      </CardContent>
    </Card>
  );
}
