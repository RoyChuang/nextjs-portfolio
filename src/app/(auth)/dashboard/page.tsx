import { ClientComponent } from './ClientComponent';
import { ServerComponent } from './ServerComponent';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
