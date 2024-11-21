import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTask, deleteTask, getTasks, GetTasksParams, updateTask } from '@/api/tasks';
import { TaskFormValues } from '@/types/task';

export function useTasks(params: GetTasksParams) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', params],
    queryFn: () => getTasks(params),
    staleTime: 0, // 數據立即變為過時
    refetchOnWindowFocus: true, // 窗口聚焦時重新獲取
  });

  const { mutateAsync: createTaskMutation } = useMutation({
    mutationFn: (data: TaskFormValues) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', params] });
    },
  });

  const { mutate: updateTaskMutation } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', params] });
    },
  });

  const { mutateAsync: deleteTaskMutation } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', params] });
    },
    onError: (error) => {
      throw error; // 確保錯誤被傳播到組件
    },
  });

  return {
    tasks: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    createTask: createTaskMutation,
    updateTask: updateTaskMutation,
    deleteTask: deleteTaskMutation,
  };
}
