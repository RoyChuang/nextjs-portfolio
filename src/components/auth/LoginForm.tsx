'use client';

import * as Form from '@radix-ui/react-form';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/hooks/useAuth';

export function LoginForm() {
  const { t } = useTranslation();
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const identity = formData.get('identity') as string;
    const password = formData.get('password') as string;

    login({ identity, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {t('auth.login.title')}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t('auth.login.subtitle')}
          </p>
        </div>

        <Form.Root className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Form.Field className="space-y-1" name="identity">
              <Form.Label className="sr-only">
                {t('auth.login.email')}
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={t('auth.login.email')}
                />
              </Form.Control>
              <Form.Message
                className="text-sm text-red-500"
                match="valueMissing"
              >
                {t('auth.login.emailRequired')}
              </Form.Message>
              <Form.Message
                className="text-sm text-red-500"
                match="typeMismatch"
              >
                {t('auth.login.emailInvalid')}
              </Form.Message>
            </Form.Field>

            <Form.Field className="space-y-1" name="password">
              <Form.Label className="sr-only">
                {t('auth.login.password')}
              </Form.Label>
              <Form.Control asChild>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder={t('auth.login.password')}
                />
              </Form.Control>
              <Form.Message
                className="text-sm text-red-500"
                match="valueMissing"
              >
                {t('auth.login.passwordRequired')}
              </Form.Message>
            </Form.Field>
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center">
              {t('auth.login.invalidCredentials')}
            </div>
          )}

          <div>
            <Form.Submit asChild>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t('auth.login.loading')}
                  </span>
                ) : (
                  t('auth.login.submit')
                )}
              </button>
            </Form.Submit>
          </div>
        </Form.Root>
      </div>
    </div>
  );
}
