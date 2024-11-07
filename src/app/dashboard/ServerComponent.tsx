import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getServerTranslations } from '@/i18n/server';

export async function ServerComponent() {
  const { t } = await getServerTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('dashboard.serverComponent')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{t('dashboard.serverContent')}</p>
      </CardContent>
    </Card>
  );
} 