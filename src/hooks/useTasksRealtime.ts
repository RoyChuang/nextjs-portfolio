import { useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash/debounce';
import { useCallback, useEffect } from 'react';

import { pb } from '@/lib/pocketbase';

export function useTasksRealtime() {
  const queryClient = useQueryClient();

  const debouncedRefetch = useCallback(
    debounce(() => {
      queryClient
        .refetchQueries({
          queryKey: ['taskStatusCounts'],
          exact: true,
        })
        .catch((error) => console.error('更新狀態統計失敗:', error));

      queryClient
        .refetchQueries({
          queryKey: ['taskProgressStats'],
          exact: true,
        })
        .catch((error) => console.error('更新進度統計失敗:', error));

      queryClient
        .refetchQueries({
          queryKey: ['taskDueStats'],
          exact: true,
        })
        .catch((error) => console.error('更新到期統計失敗:', error));
    }, 300),
    [queryClient]
  );

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const subscribe = async () => {
      try {
        unsubscribe = await pb.collection('tasks').subscribe('*', debouncedRefetch);
      } catch (error) {
        console.error('訂閱失敗:', error);
      }
    };

    subscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        pb.collection('tasks').unsubscribe('*'); // 移除所有 '*' 主題的訂閱
        console.log('🚀 ~ unsubscribe');
      }
      debouncedRefetch.cancel();
    };
  }, [debouncedRefetch]);
}
