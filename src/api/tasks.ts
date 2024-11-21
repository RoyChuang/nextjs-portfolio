import { pb } from '@/lib/pocketbase';
import { Task, TaskFormValues } from '@/types/task';

export interface GetTasksParams {
  page: number;
  pageSize: number;
}

export interface TasksResponse {
  items: Task[];
  total: number;
  totalPages: number;
}

export const getTasks = async ({ page, pageSize }: GetTasksParams): Promise<TasksResponse> => {
  const response = await pb.collection('tasks').getList(page, pageSize, {
    sort: '-created',
  });

  return {
    items: response.items,
    total: response.totalItems,
    totalPages: response.totalPages,
  };
};

export const createTask = async (data: TaskFormValues): Promise<Task> => {
  const response = await pb.collection('tasks').create({
    ...data,
    dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
    created: new Date().toISOString(),
  });
  return response;
};

export const updateTask = async (id: string, data: { completed: boolean }) => {
  return await pb.collection('tasks').update(id, data);
};

export const deleteTask = async (id: string) => {
  return await pb.collection('tasks').delete(id);
};
