import { useQuery } from '@tanstack/react-query';

import { getTaskDueStats } from '@/api/tasks';

export function useTaskDueStats() {
  return useQuery({
    queryKey: ['taskDueStats'],
    queryFn: getTaskDueStats,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
}
