'use client';

import { useQueryClient } from '@tanstack/react-query';
import ReactECharts from 'echarts-for-react';
import { useEffect } from 'react';

import { useTaskStatusCounts } from '@/hooks/useTaskStatusCounts';
import { pb } from '@/lib/pocketbase';

const getStatusConfig = (status: number) => {
  const config = {
    0: { label: '待處理', color: '#6b7280' },
    1: { label: '進行中', color: '#f59e0b' },
    2: { label: '已完成', color: '#10b981' },
  };
  return config[status as keyof typeof config];
};

export function TaskStatusChart() {
  const queryClient = useQueryClient();
  const { data: statusCounts = [], isLoading } = useTaskStatusCounts();

  // 添加 realtime 監聽
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const subscribe = async () => {
      try {
        unsubscribe = await pb.collection('tasks').subscribe('*', async () => {
          // 當 tasks 有變化時，重新獲取狀態統計
          await queryClient.refetchQueries({
            queryKey: ['taskStatusCounts'],
            exact: true,
          });
        });
      } catch (error) {
        console.error('訂閱失敗:', error);
      }
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [queryClient]);

  const pieOptions = {
    title: {
      text: '任務狀態分佈',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'horizontal',
      bottom: 'bottom',
    },
    series: [
      {
        name: '任務狀態',
        type: 'pie',
        radius: '50%',
        data: statusCounts.map((item) => ({
          value: item.count,
          name: getStatusConfig(item.status).label,
          itemStyle: {
            color: getStatusConfig(item.status).color,
          },
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
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
        <ReactECharts option={pieOptions} style={{ height: '100%' }} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {statusCounts.map((item) => (
          <div key={item.status} className="rounded-lg border p-4 text-center">
            <div className="text-sm text-muted-foreground">
              {getStatusConfig(item.status).label}
            </div>
            <div className="mt-2 text-2xl font-bold">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
