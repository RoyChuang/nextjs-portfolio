'use client';

import { format } from 'date-fns';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Task, TaskFormValues, TaskStatus } from '@/types/task';

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
  const [editTask, setEditTask] = useState<{ open: boolean; task: Task | null }>({
    open: false,
    task: null,
  });
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-created');

  const { tasks, total, totalPages, isLoading, deleteTask, createTask, updateTask } = useTasks({
    page: currentPage,
    pageSize: pageSize,
    search: search,
    sort: sort,
  });

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

  const handleEditTask = async (data: TaskFormValues) => {
    if (!editTask.task) return;
    try {
      const payload = {
        name: data.name,
        status: data.status,
        progress: data.progress,
        dueDate: data.dueDate ? data.dueDate.toISOString() : null,
      };

      console.log('更新任務數據:', payload); // 調試用

      await updateTask(editTask.task.id, payload);

      setEditTask({ open: false, task: null });
      toast({
        description: '任務已更新',
      });
    } catch (error) {
      console.error('更新任務失敗:', error);
      toast({
        variant: 'destructive',
        description: '更新任務失敗',
      });
    }
  };

  const handleSort = (field: string) => {
    setSort(sort === field ? `-${field}` : field);
  };

  // 處理搜索按鈕點擊
  const handleSearch = () => {
    setCurrentPage(1); // 重置到第一頁
    setSearch(searchInput);
  };

  // 處理清除搜索
  const handleClearSearch = () => {
    setCurrentPage(1); // 重置到第一頁
    setSearch('');
    setSearchInput('');
  };

  // 處理按下 Enter 鍵
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            新增任務
          </Button>
          <div className="flex gap-2">
            <div className="relative">
              <Input
                placeholder="搜尋任務名稱..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-[200px] pr-8"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
                onClick={handleSearch}
              >
                <Search className="size-4 text-muted-foreground" />
                <span className="sr-only">搜尋</span>
              </Button>
            </div>
            {search && (
              <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                清除
              </Button>
            )}
          </div>
        </div>

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

      <div className="relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')} className="flex-1 cursor-pointer">
                任務名稱 {sort.includes('name') && (sort.startsWith('-') ? '↓' : '↑')}
              </TableHead>
              <TableHead onClick={() => handleSort('status')} className="w-[100px] cursor-pointer">
                狀態 {sort.includes('status') && (sort.startsWith('-') ? '↓' : '↑')}
              </TableHead>
              <TableHead
                onClick={() => handleSort('progress')}
                className="w-[120px] cursor-pointer"
              >
                進度 {sort.includes('progress') && (sort.startsWith('-') ? '↓' : '↑')}
              </TableHead>
              <TableHead onClick={() => handleSort('dueDate')} className="w-[120px] cursor-pointer">
                截止日期 {sort.includes('dueDate') && (sort.startsWith('-') ? '↓' : '↑')}
              </TableHead>
              <TableHead onClick={() => handleSort('created')} className="w-[100px] cursor-pointer">
                創建時間 {sort.includes('created') && (sort.startsWith('-') ? '↓' : '↑')}
              </TableHead>
              <TableHead className="w-[100px] text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? // 顯示多個骨架行
                Array.from({ length: pageSize }).map((_, index) => <TaskRowSkeleton key={index} />)
              : tasks.map((task) => {
                  const statusConfig = getStatusConfig(task.status);

                  return (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <span>{task.name}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={task.progress || 0} className="w-[60px]" />
                          <span className="text-sm text-muted-foreground">
                            {task.progress || 0}%
                          </span>
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
                          onClick={() => setEditTask({ open: true, task: task })}
                          className="size-8 text-primary hover:text-primary/90"
                        >
                          <Pencil className="size-4" />
                          <span className="sr-only">编辑任务</span>
                        </Button>
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
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            {isLoading ? <Skeleton className="h-4 w-[100px]" /> : `共 ${total} 條記錄`}
          </div>
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
                  currentPage === number
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-gray-100'
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
      </div>

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        onConfirm={handleDeleteConfirm}
        title="確認刪除"
        description="確認要刪除這個任務嗎？"
      />

      <TaskDialog
        open={editTask.open}
        onOpenChange={(open) => setEditTask({ ...editTask, open })}
        onSubmit={handleEditTask}
        defaultValues={editTask.task || undefined}
      />
    </div>
  );
}

export function TaskRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 w-[60px]" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4" />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Skeleton className="size-8" />
          <Skeleton className="size-8" />
        </div>
      </TableCell>
    </TableRow>
  );
}
