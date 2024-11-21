'use client';

import { format } from 'date-fns';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useTasks } from '@/hooks/useTasks';
import { TaskFormValues, TaskStatus } from '@/types/task';

import { TaskDialog } from './TaskDialog';

const getStatusConfig = (status: TaskStatus) => {
  const config = {
    0: { label: '待處理', variant: 'default' as const },
    1: { label: '進行中', variant: 'warning' as const },
    2: { label: '已完成', variant: 'success' as const },
  };
  return config[status];
};

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function TaskList() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; taskId: string | null }>({
    open: false,
    taskId: null,
  });

  const { tasks, total, totalPages, isLoading, updateTask, deleteTask, createTask } = useTasks({
    page: currentPage,
    pageSize: pageSize,
  });

  const handleStatusChange = (taskId: string, currentStatus: TaskStatus) => {
    let newStatus: TaskStatus = 0;
    if (currentStatus === 0) newStatus = 1;
    else if (currentStatus === 1) newStatus = 2;
    else if (currentStatus === 2) newStatus = 0;

    updateTask(taskId, { status: newStatus });
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = Number(value);
    setPageSize(newPageSize);
    setCurrentPage(1); // 重置到第一頁
  };

  // 頁碼按鈕生成
  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleCreateTask = async (data: TaskFormValues) => {
    try {
      await createTask(data);
      setCreateDialogOpen(false);
    } catch (error) {
      console.log('Failed to create task:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.taskId) return;

    try {
      await deleteTask(deleteConfirm.taskId);
      toast({
        description: '任務已刪除',
      });
    } catch (error) {
      console.log('Failed to delete task:', error);
      toast({
        variant: 'destructive',
        description: '刪除任務失敗',
      });
    } finally {
      setDeleteConfirm({ open: false, taskId: null });
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-[200px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          新增任務
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">每頁顯示：</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="選擇數量" />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TaskDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateTask}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>任務名稱</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead>進度</TableHead>
            <TableHead>截止日期</TableHead>
            <TableHead>創建時間</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const statusConfig = getStatusConfig(task.status);

            return (
              <TableRow key={task.id}>
                <TableCell className="font-medium">
                  <span>{task.name}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusConfig.variant}
                    className="cursor-pointer"
                    onClick={() => handleStatusChange(task.id, task.status)}
                  >
                    {statusConfig.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={task.progress || 0} className="w-[60px]" />
                    <span className="text-sm text-muted-foreground">{task.progress || 0}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  {task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '-'}
                </TableCell>
                <TableCell>{format(new Date(task.created), 'yyyy-MM-dd')}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteConfirm({ open: true, taskId: task.id })}
                    className="size-8 text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only">刪除任務</span>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* 分頁控制 */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-500">共 {total} 條記錄</div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            上一頁
          </button>
          {getPageNumbers().map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`rounded border px-3 py-1 ${
                currentPage === number ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            下一頁
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        onConfirm={handleDeleteConfirm}
        title="確認刪除"
        description="確認要刪除這個任務嗎？"
      />
    </div>
  );
}
