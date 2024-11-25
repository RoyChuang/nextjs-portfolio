import { useQuery } from '@tanstack/react-query';

import { getTaskStatusCounts } from '@/api/tasks';

export function useTaskStatusCounts() {
  return useQuery({
    queryKey: ['taskStatusCounts'],
    queryFn: getTaskStatusCounts,
    staleTime: 0, // 數據立即變為過時
    refetchOnWindowFocus: true, // 窗口聚焦時重新獲取
    refetchInterval: 1000 * 30, // 每30秒自動重新獲取
  });
}
