import { TaskStatusChart } from '@/components/TaskStatusChart';

import { ClientComponent } from './ClientComponent';
import { ServerComponent } from './ServerComponent';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <TaskStatusChart />
        </div>
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
