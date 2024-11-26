'use client';

import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { Pagination } from '@/components/UserList/Pagination';
import { useRoles } from '@/hooks/useRoles';
import { pb } from '@/lib/pocketbase';
import { User } from '@/types/user';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  total: number;
  sort: string;
  onSort: (field: string) => void;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onPageChange: (page: number) => void;
}

export function UserTable({
  users,
  isLoading: isLoadingUsers,
  pageSize,
  currentPage,
  totalPages,
  total,
  sort,
  onSort,
  onEdit,
  onDelete,
  onPageChange,
}: UserTableProps) {
  const { t } = useTranslation();
  const { roles, isLoading: isLoadingRoles } = useRoles();

  const getAvatarUrl = (user: User) => {
    if (!user.avatar) return '';
    return pb.files.getUrl(user, user.avatar);
  };

  const renderHeaderCell = (field: string, label: string, width?: string) => (
    <TableHead
      onClick={() => onSort(field)}
      className={`cursor-pointer ${width ? width : 'flex-1'}`}
    >
      {t(label)} {sort.includes(field) && (sort.startsWith('-') ? '↓' : '↑')}
    </TableHead>
  );

  const renderUserRow = (user: User) => {
    const userRole = roles[user.role];

    return (
      <TableRow key={user.id}>
        <TableCell>
          <Avatar className="size-8">
            <AvatarImage src={getAvatarUrl(user)} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell className="font-medium">{user.name}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          {isLoadingRoles ? (
            <Skeleton className="h-5 w-[60px]" />
          ) : (
            <Badge variant={userRole?.rolename === 'admin' ? 'default' : 'secondary'}>
              {userRole?.rolename || t('common.unknown')}
            </Badge>
          )}
        </TableCell>
        <TableCell>{format(new Date(user.created), 'yyyy-MM-dd')}</TableCell>
        <TableCell className="text-right">
          <Button variant="ghost" size="icon" onClick={() => onEdit(user)}>
            <Pencil className="size-4" />
            <span className="sr-only">{t('userList.table.edit')}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(user.id)}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="size-4" />
            <span className="sr-only">{t('userList.table.delete')}</span>
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
              <TableHead className="w-[50px]"></TableHead>
              {renderHeaderCell('name', 'userList.table.name')}
              {renderHeaderCell('email', 'userList.table.email')}
              {renderHeaderCell('role', 'userList.table.role', 'w-[100px]')}
              {renderHeaderCell('created', 'userList.table.created', 'w-[120px]')}
              <TableHead className="w-[100px] text-right">{t('userList.table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingUsers
              ? Array.from({ length: pageSize }).map((_, index) => <UserRowSkeleton key={index} />)
              : users.map(renderUserRow)}
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

function UserRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="size-8 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[200px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-[60px]" />
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
