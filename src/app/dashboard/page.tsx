import { ServerComponent } from './ServerComponent';
import { ClientComponent } from './ClientComponent';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LogoutButton } from '@/components/LogoutButton';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <LanguageSwitcher />
        <LogoutButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ClientComponent />
        <ServerComponent />
      </div>
    </div>
  );
} 