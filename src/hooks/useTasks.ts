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

  const { mutateAsync: updateTaskMutation } = useMutation({
    mutationFn: (params: { id: string; data: Partial<TaskFormValues> }) => {
      const updateData = {
        ...params.data,
        assignedTo: params.data.assignedTo === 'unassigned' ? null : params.data.assignedTo,
      };
      console.log('Update mutation data:', updateData);
      return updateTask(params.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      throw error;
    },
  });

  const { mutateAsync: deleteTaskMutation } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', params] });
    },
    onError: (error) => {
      throw error;
    },
  });

  return {
    tasks: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    createTask: createTaskMutation,
    updateTask: async (id: string, data: Partial<TaskFormValues>) => {
      return await updateTaskMutation({ id, data });
    },
    deleteTask: deleteTaskMutation,
  };
}
