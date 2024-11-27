'use client';

import { Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RoleDialog } from '@/components/RoleList/RoleDialog';
import { RoleTable } from '@/components/RoleList/RoleTable';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRolesList } from '@/hooks/useRoles';
import { Role } from '@/types/role';

export default function RolesPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sort, setSort] = useState('-created');
  const [editRole, setEditRole] = useState<{ open: boolean; role?: Role }>({
    open: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    roleId?: string;
  }>({ open: false });

  const { roles, total, totalPages, isLoading, createRole, updateRole, deleteRole } = useRolesList({
    page: currentPage,
    pageSize,
    search,
    sort,
  });

  const handleSort = (field: string) => {
    setSort(sort === field ? `-${field}` : field);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearchInput('');
    setSearch('');
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (deleteConfirm.roleId) {
      try {
        await deleteRole(deleteConfirm.roleId);
        toast({
          description: t('roleList.dialog.deleteSuccess'),
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          description: t('roleList.dialog.error'),
        });
      }
      setDeleteConfirm({ open: false });
    }
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={() => setEditRole({ open: true })}>
            <Plus className="mr-2 size-4" />
            {t('roleList.addRole')}
          </Button>
          <div className="flex gap-2">
            <div className="relative">
              <Input
                placeholder={t('roleList.search.placeholder')}
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
              <Button variant="ghost" size="sm" onClick={handleClear}>
                {t('roleList.search.clear')}
              </Button>
            )}
          </div>
        </div>
      </div>

      <RoleTable
        roles={roles}
        isLoading={isLoading}
        pageSize={pageSize}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        sort={sort}
        onSort={handleSort}
        onEdit={(role) => setEditRole({ open: true, role })}
        onDelete={(roleId) => setDeleteConfirm({ open: true, roleId })}
        onPageChange={setCurrentPage}
      />

      <RoleDialog
        open={editRole.open}
        role={editRole.role}
        onOpenChange={(open) => setEditRole({ open })}
        onSubmit={async (data) => {
          try {
            if (editRole.role) {
              await updateRole(editRole.role.id, data);
              toast({
                description: t('roleList.dialog.updateSuccess'),
              });
            } else {
              await createRole(data);
              toast({
                description: t('roleList.dialog.createSuccess'),
              });
            }
            setEditRole({ open: false });
          } catch (error) {
            toast({
              variant: 'destructive',
              description: t('roleList.dialog.error'),
            });
          }
        }}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open })}
        onConfirm={handleDelete}
        title={t('roleList.dialog.deleteTitle')}
        description={t('roleList.dialog.deleteDescription')}
      />
    </div>
  );
}
