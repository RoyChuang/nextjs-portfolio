import { useQuery } from '@tanstack/react-query';

import { getTaskStatusCounts } from '@/api/tasks';

export function useTaskStatusCounts() {
  return useQuery({
    queryKey: ['taskStatusCounts'],
    queryFn: getTaskStatusCounts,
    staleTime: Infinity, // 因為有 realtime 更新，所以不需要自動過期
    refetchOnWindowFocus: false, // 因為有 realtime 更新，不需要在窗口聚焦時重新獲取
    refetchInterval: false, // 因為有 realtime 更新，不需要定時獲取
  });
}
