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
import { UserDialog } from '@/components/UserList/UserDialog';
import { UserTable } from '@/components/UserList/UserTable';
import { useToast } from '@/hooks/use-toast';
import { useRolesList } from '@/hooks/useRoles';
import { useUsers } from '@/hooks/useUsers';
import { User, UserFormValues } from '@/types/user';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function UserList() {
  // 從 UsersPage 複製所有狀態和邏輯
  const { toast } = useToast();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-created');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; userId: string | null }>({
    open: false,
    userId: null,
  });

  // 使用相同的 hooks
  const { users, total, totalPages, isLoading, createUser, updateUser, deleteUser } = useUsers({
    page: currentPage,
    pageSize,
    search,
    sort,
  });

  const { roles } = useRolesList({
    page: 1,
    pageSize: 100,
    sort: 'rolename',
  });

  // 複製所有處理函數
  const handleCreateUser = async (data: UserFormValues) => {
    try {
      await createUser(data);
      setCreateDialogOpen(false);
      toast({
        description: t('userList.dialog.createSuccess'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        description: t('userList.dialog.createError'),
      });
    }
  };

  const handleEditUser = async (data: UserFormValues) => {
    if (!editUser.user) return;
    try {
      await updateUser(editUser.user.id, data);
      setEditUser({ open: false, user: null });
      toast({
        description: t('userList.dialog.updateSuccess'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        description: t('userList.dialog.updateError'),
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.userId) return;
    try {
      await deleteUser(deleteConfirm.userId);
      toast({
        description: t('userList.dialog.deleteSuccess'),
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        description: t('userList.dialog.deleteError'),
      });
    } finally {
      setDeleteConfirm({ open: false, userId: null });
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setCurrentPage(1);
    setSearch('');
    setSearchInput('');
  };

  const handleSort = (field: string) => {
    setSort(sort === field ? `-${field}` : field);
  };

  // 返回相同的 JSX
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 size-4" />
            {t('userList.addUser')}
          </Button>
          <div className="flex gap-2">
            <div className="relative">
              <Input
                placeholder={t('userList.search.placeholder')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-[200px] pr-8"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
                onClick={handleSearch}
              >
                <Search className="size-4 text-muted-foreground" />
              </Button>
            </div>
            {search && (
              <Button variant="ghost" size="sm" onClick={handleClearSearch}>
                {t('userList.search.clear')}
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">{t('userList.perPage.label')}</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue />
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

      <UserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateUser}
        roles={roles}
      />

      <UserTable
        users={users}
        isLoading={isLoading}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        sort={sort}
        onSort={handleSort}
        onEdit={(user) => setEditUser({ open: true, user })}
        onDelete={(userId) => setDeleteConfirm({ open: true, userId })}
        onPageChange={setCurrentPage}
      />

      <UserDialog
        open={editUser.open}
        onOpenChange={(open) => setEditUser({ ...editUser, open })}
        onSubmit={handleEditUser}
        defaultValues={editUser.user || undefined}
        roles={roles}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        onConfirm={handleDeleteConfirm}
        title={t('userList.dialog.deleteTitle')}
        description={t('userList.dialog.deleteDescription')}
      />
    </div>
  );
}
