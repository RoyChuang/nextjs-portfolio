'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '@/stores/useAuthStore';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              {t('dashboard.logout')}
            </button>
          </div>
          <div className="mb-4">
            <p className="text-gray-600">
              {t('dashboard.welcome', {
                name: user?.name || t('dashboard.defaultUser'),
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
