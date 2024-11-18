import { I18nProvider } from '@/providers/I18nProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { Roboto } from 'next/font/google';
import './globals.css';

import { AppLayout } from '@/components/AppLayout';

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <QueryProvider>
          <I18nProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
