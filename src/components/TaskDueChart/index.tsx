'use client';

import ReactECharts from 'echarts-for-react';

import { useTaskDueStats } from '@/hooks/useTaskDueStats';

const getDueConfig = (type: string) => {
  const config = {
    overdue: { label: '已逾期', color: '#ef4444' },
    today: { label: '今天到期', color: '#f59e0b' },
    week: { label: '一週內', color: '#60a5fa' },
    twoweek: { label: '兩週內', color: '#818cf8' },
  };
  return config[type as keyof typeof config];
};

export function TaskDueChart() {
  const { data: dueStats = [], isLoading } = useTaskDueStats();

  const barOptions = {
    title: {
      text: '任務到期統計',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    xAxis: {
      type: 'category',
      data: dueStats.map((item) => getDueConfig(item.type).label),
    },
    yAxis: {
      type: 'value',
      name: '任務數量',
    },
    series: [
      {
        name: '任務數量',
        type: 'bar',
        data: dueStats.map((item) => ({
          value: item.count,
          itemStyle: {
            color: getDueConfig(item.type).color,
          },
        })),
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg border bg-card">
        載入中...
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="h-[300px]">
        <ReactECharts option={barOptions} style={{ height: '100%' }} />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {dueStats.map((item) => (
          <div key={item.type} className="rounded-lg border p-4 text-center">
            <div className="text-sm text-muted-foreground">{getDueConfig(item.type).label}</div>
            <div className="mt-2 text-2xl font-bold">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
