import { LoginForm } from '@/components/auth/LoginForm';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      {/* Login Form */}
      <div className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
