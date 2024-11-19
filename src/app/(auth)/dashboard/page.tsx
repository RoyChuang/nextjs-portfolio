import { ServerComponent } from './ServerComponent';
import { ClientComponent } from './ClientComponent';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ClientComponent />
        <ClientComponent />
        <ClientComponent />
        <ClientComponent />
        <ClientComponent />
        <ClientComponent />
        <ClientComponent />
        <ClientComponent />
        <ClientComponent />
        <ClientComponent />
        <ServerComponent />
      </div>
    </div>
  );
} 