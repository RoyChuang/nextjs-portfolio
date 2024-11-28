import { useQuery } from '@tanstack/react-query';

import { getProgressStats } from '@/api/tasks';

export function useTaskProgressStats() {
  return useQuery({
    queryKey: ['taskProgressStats'],
    queryFn: getProgressStats,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });
}
