'use client';

import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Pagination } from '@/components/TaskList/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Task, TaskStatus } from '@/types/task';

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  total: number;
  sort: string;
  onSort: (field: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onPageChange: (page: number) => void;
}

export function TaskTable({
  tasks,
  isLoading,
  pageSize,
  currentPage,
  totalPages,
  total,
  sort,
  onSort,
  onEdit,
  onDelete,
  onPageChange,
}: TaskTableProps) {
  const { t } = useTranslation();

  const getStatusConfig = (status: TaskStatus) => {
    const config = {
      0: { label: t('taskList.status.pending'), variant: 'default' as const },
      1: { label: t('taskList.status.inProgress'), variant: 'warning' as const },
      2: { label: t('taskList.status.completed'), variant: 'success' as const },
    };
    return config[status];
  };

  // 渲染表頭列
  const renderHeaderCell = (field: string, label: string, width?: string) => (
    <TableHead
      onClick={() => onSort(field)}
      className={`cursor-pointer ${width ? width : 'flex-1'}`}
    >
      {t(label)} {sort.includes(field) && (sort.startsWith('-') ? '↓' : '↑')}
    </TableHead>
  );

  // 渲染任務行
  const renderTaskRow = (task: Task) => {
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
            <span className="text-sm text-muted-foreground">{task.progress || 0}%</span>
          </div>
        </TableCell>
        <TableCell>{format(new Date(task.created), 'yyyy-MM-dd')}</TableCell>
        <TableCell>{task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '-'}</TableCell>

        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="size-8 text-primary hover:text-primary/90"
          >
            <Pencil className="size-4" />
            <span className="sr-only">編輯任務</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="size-8 text-destructive hover:text-destructive/90"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">刪除任務</span>
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {renderHeaderCell('name', 'taskList.table.name')}
              {renderHeaderCell('status', 'taskList.table.status', 'w-[100px]')}
              {renderHeaderCell('progress', 'taskList.table.progress', 'w-[120px]')}
              {renderHeaderCell('created', 'taskList.table.created', 'w-[100px]')}
              {renderHeaderCell('dueDate', 'taskList.table.dueDate', 'w-[100px]')}
              <TableHead className="w-[100px] text-right">{t('taskList.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, index) => <TaskRowSkeleton key={index} />)
              : tasks.map(renderTaskRow)}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}

// 骨架屏組件
function TaskRowSkeleton() {
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
