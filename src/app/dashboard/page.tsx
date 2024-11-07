import { ServerComponent } from './ServerComponent';
import { ClientComponent } from './ClientComponent';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';


export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <LanguageSwitcher />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ClientComponent />
        <ServerComponent />
      </div>
    </div>
  );
} 