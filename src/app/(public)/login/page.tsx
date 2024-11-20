'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

// 定义表单验证架构
const loginSchema = z.object({
  email: z.string().email('login.emailInvalid').min(1, 'login.emailRequired'),
  password: z.string().min(1, 'login.passwordRequired'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, isLoading, error } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <LanguageSwitcher />
        <h2 className="mt-6 text-center text-3xl font-bold">{t('login.title')}</h2>
        <form className="mt-8 space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-1">
              <Input
                type="email"
                placeholder={t('login.email')}
                {...form.register('email')}
                disabled={isLoading}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{t(form.formState.errors.email.message!)}</p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                type="password"
                placeholder={t('login.password')}
                {...form.register('password')}
                disabled={isLoading}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{t(form.formState.errors.password.message!)}</p>
              )}
            </div>

            {error && <div className="text-sm text-red-500">{t('login.error')}</div>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('common.loading') : t('login.submit')}
          </Button>
        </form>
      </div>
    </div>
  );
}
