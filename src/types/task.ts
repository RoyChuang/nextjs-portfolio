import { z } from 'zod';

export type TaskStatus = 0 | 1 | 2;

export const taskFormSchema = z.object({
  name: z.string().min(1, '請輸入任務名稱'),
  status: z.number().min(0).max(2),
  progress: z.number().min(0).max(100).default(0),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  progress?: number;
  dueDate?: string;
  created: string;
  assignedTo?: string;
}
