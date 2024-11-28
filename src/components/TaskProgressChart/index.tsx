'use client';

import ReactECharts from 'echarts-for-react';

import { useTaskProgressStats } from '@/hooks/useTaskProgressStats';

export function TaskProgressChart() {
  const { data: progressStats = [], isLoading } = useTaskProgressStats();

  const barOptions = {
    title: {
      text: '任務進度分佈',
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
      data: progressStats.map((item) => `${item.range}%`),
    },
    yAxis: {
      type: 'value',
      name: '任務數量',
    },
    series: [
      {
        name: '任務數量',
        type: 'bar',
        data: progressStats.map((item) => item.count),
        itemStyle: {
          color: '#60a5fa',
        },
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
      <div className="mt-4 grid grid-cols-5 gap-4">
        {progressStats.map((item) => (
          <div key={item.range} className="rounded-lg border p-4 text-center">
            <div className="text-sm text-muted-foreground">{item.range}%</div>
            <div className="mt-2 text-2xl font-bold">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
