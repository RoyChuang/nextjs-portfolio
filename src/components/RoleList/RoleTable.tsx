'use client';

import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Role } from '@/types/role';

interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  total: number;
  sort: string;
  onSort: (field: string) => void;
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  onPageChange: (page: number) => void;
}

export function RoleTable({
  roles,
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
}: RoleTableProps) {
  const { t } = useTranslation();

  const renderHeaderCell = (field: string, label: string, width?: string) => (
    <TableHead
      onClick={() => onSort(field)}
      className={`cursor-pointer ${width ? width : 'flex-1'}`}
    >
      {t(label)} {sort.includes(field) && (sort.startsWith('-') ? '↓' : '↑')}
    </TableHead>
  );

  const renderRoleRow = (role: Role) => (
    <TableRow key={role.id}>
      <TableCell className="font-medium">{role.rolename}</TableCell>
      <TableCell>{format(new Date(role.created), 'yyyy-MM-dd')}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon" onClick={() => onEdit(role)}>
          <Pencil className="size-4" />
          <span className="sr-only">{t('roleList.table.edit')}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(role.id)}
          className="text-destructive hover:text-destructive/90"
        >
          <Trash2 className="size-4" />
          <span className="sr-only">{t('roleList.table.delete')}</span>
        </Button>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {renderHeaderCell('rolename', 'roleList.table.rolename')}
              {renderHeaderCell('created', 'roleList.table.created', 'w-[120px]')}
              <TableHead className="w-[100px] text-right">{t('roleList.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: pageSize }).map((_, index) => <RoleRowSkeleton key={index} />)
              : roles.map(renderRoleRow)}
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

function RoleRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
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
