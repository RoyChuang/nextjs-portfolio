'use client';

import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskFormValues } from '@/types/task';

import { TaskDialog } from './TaskDialog';
import { TaskTable } from './TaskTable';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function TaskList() {
  const { toast } = useToast();
  const { t } = useTranslation();
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

  const handleCreateTask = async (data: TaskFormValues) => {
    try {
      await createTask(data);
      setCreateDialogOpen(false);
      toast({
        description: t('taskList.dialog.createSuccess'),
      });
    } catch (error) {
      console.log(t('taskList.debug.failedCreateTask'), error);
      toast({
        variant: 'destructive',
        description: t('taskList.dialog.createError'),
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.taskId) return;

    try {
      await deleteTask(deleteConfirm.taskId);
      toast({
        description: t('taskList.dialog.deleteSuccess'),
      });
    } catch (error) {
      console.log('Failed to delete task:', error);
      toast({
        variant: 'destructive',
        description: t('taskList.dialog.deleteError'),
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

      await updateTask(editTask.task.id, payload);

      setEditTask({ open: false, task: null });
      toast({
        description: t('taskList.dialog.updateSuccess'),
      });
    } catch (error) {
      console.error('更新任務失敗:', error);
      toast({
        variant: 'destructive',
        description: t('taskList.dialog.updateError'),
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
            {t('taskList.addTask')}
          </Button>
          <div className="flex gap-2">
            <div className="relative">
              <Input
                placeholder={t('taskList.search.placeholder')}
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
                <span className="sr-only">{t('taskList.search.button')}</span>
              </Button>
            </div>
            {search && (
              <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                {t('taskList.search.clear')}
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{t('taskList.perPage.label')}</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder={t('taskList.perPage.placeholder')} />
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

      <TaskTable
        tasks={tasks}
        isLoading={isLoading}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        sort={sort}
        onSort={handleSort}
        onEdit={(task) => setEditTask({ open: true, task })}
        onDelete={(taskId) => setDeleteConfirm({ open: true, taskId })}
        onPageChange={setCurrentPage}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        onConfirm={handleDeleteConfirm}
        title={t('taskList.dialog.deleteTitle')}
        description={t('taskList.dialog.deleteDescription')}
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
