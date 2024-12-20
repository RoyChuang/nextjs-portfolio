'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// 假設你有一個 Slider 組件
import { Slider } from '@/components/ui/slider';
import { useUsers } from '@/hooks/useUsers';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';

const taskFormSchema = z.object({
  name: z.string().min(1, '請輸入任務名稱'),
  status: z.number().min(0).max(2),
  progress: z.number().min(0).max(100).default(0),
  dueDate: z.date().optional(),
  assignedTo: z.string().nullable().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskFormValues) => void;
  defaultValues?: Task;
}

export function TaskDialog({ open, onOpenChange, onSubmit, defaultValues }: TaskDialogProps) {
  const { t } = useTranslation();
  const { users } = useUsers({ page: 1, pageSize: 100 }); // 獲取所有用戶
  const isEditing = !!defaultValues;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: '',
      status: 0,
      progress: 0,
      assignedTo: '', // 添加默認值
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name,
        status: defaultValues.status,
        progress: defaultValues.progress || 0,
        dueDate: defaultValues.dueDate ? new Date(defaultValues.dueDate) : undefined,
        assignedTo: defaultValues.assignedTo || '', // 設置指派用戶
      });
    } else {
      form.reset({
        name: '',
        status: 0,
        progress: 0,
        assignedTo: '',
      });
    }
  }, [form, defaultValues, open]);

  const handleSubmit = async (data: TaskFormValues) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const formData: TaskFormValues = {
        name: data.name,
        status: data.status,
        progress: data.progress,
        dueDate: data.dueDate,
        assignedTo: data.assignedTo === 'unassigned' ? null : data.assignedTo,
      };

      await onSubmit(formData);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create/update task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? '編輯任務' : '新增任務'}</DialogTitle>
          <DialogDescription>
            {isEditing ? '修改任務的詳細信息' : '在此填寫新任務的詳細信息'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>任務名稱</FormLabel>
                  <FormControl>
                    <Input placeholder="輸入任務名稱..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>狀態</FormLabel>
                  <Select
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇狀態" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">待處理</SelectItem>
                      <SelectItem value="1">進行中</SelectItem>
                      <SelectItem value="2">已完成</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="progress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>進度 ({field.value}%)</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[field.value]}
                      onValueChange={(values) => {
                        field.onChange(values[0]);
                      }}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>截止日期</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(field.value, 'yyyy-MM-dd') : <span>選擇日期</span>}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('taskList.form.assignedTo')}</FormLabel>
                  <Select
                    value={field.value || 'unassigned'}
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('taskList.form.selectUser')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">{t('taskList.form.unassigned')}</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    處理中...
                  </>
                ) : (
                  '確認'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
