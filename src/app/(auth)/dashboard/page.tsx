'use client';

import { TaskDueChart } from '@/components/TaskDueChart';
import { TaskProgressChart } from '@/components/TaskProgressChart';
import { TaskStatusChart } from '@/components/TaskStatusChart';
import { useTasksRealtime } from '@/hooks/useTasksRealtime';

export default function DashboardPage() {
  // 使用共用的 realtime 訂閱
  useTasksRealtime();

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TaskStatusChart />
        <TaskProgressChart />
        <TaskDueChart />
      </div>
    </div>
  );
}
