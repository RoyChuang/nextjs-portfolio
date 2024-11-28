import { pb } from '@/lib/pocketbase';
import { Task, TaskFormValues } from '@/types/task';

export interface GetTasksParams {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
}

export interface TasksResponse {
  items: Task[];
  total: number;
  totalPages: number;
}

export const getTasks = async ({
  page,
  pageSize,
  search,
  sort = '-created',
}: GetTasksParams): Promise<TasksResponse> => {
  const filter = search ? `name ~ "${search}"` : '';

  const response = await pb.collection('tasks').getList(page, pageSize, {
    sort: sort,
    filter: filter,
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

export const updateTask = async (id: string, data: Partial<TaskFormValues>) => {
  const payload = {
    ...data,
    dueDate: data.dueDate ? data.dueDate : null,
    assignedTo: data.assignedTo === undefined ? null : data.assignedTo,
  };

  return await pb.collection('tasks').update(id, payload);
};

export const deleteTask = async (id: string) => {
  return await pb.collection('tasks').delete(id);
};

export const getTaskStatusCounts = async () => {
  const response = await fetch(
    'https://fellow-letter.pockethost.io/api/collections/statusCount/records'
  );
  const data = await response.json();
  return data.items;
};

export const getProgressStats = async () => {
  const ranges = ['0_20', '21_40', '41_60', '61_80', '81_100'];
  const stats = await Promise.all(
    ranges.map(async (range) => {
      const response = await fetch(
        `https://fellow-letter.pockethost.io/api/collections/view_progress_${range}/records`
      );
      const data = await response.json();
      return data.items[0];
    })
  );
  return stats;
};

export const getTaskDueStats = async () => {
  const views = ['overdue', 'today', 'week', 'twoweek'];
  const stats = await Promise.all(
    views.map(async (view) => {
      const response = await pb.collection(`view_due_${view}_tasks`).getList(1, 1);
      return response.items[0];
    })
  );
  return stats;
};
