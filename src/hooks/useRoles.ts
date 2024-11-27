import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createRole,
  deleteRole,
  getRoles,
  GetRolesParams,
  RolesResponse,
  updateRole,
} from '@/api/roles';
import { pb } from '@/lib/pocketbase';
import { Role, RoleFormValues } from '@/types/role';

// 用於列表頁面的 hook
export function useRolesList(params: GetRolesParams) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<RolesResponse>({
    queryKey: ['roles-list', params],
    queryFn: () => getRoles(params),
  });

  const { mutateAsync: createRoleMutation } = useMutation({
    mutationFn: (data: RoleFormValues) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
    },
  });

  const { mutateAsync: updateRoleMutation } = useMutation({
    mutationFn: (params: { id: string; data: Partial<RoleFormValues> }) => {
      return updateRole(params.id, params.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
    },
  });

  const { mutateAsync: deleteRoleMutation } = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles-list'] });
    },
  });

  return {
    roles: data?.items || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    createRole: createRoleMutation,
    updateRole: async (id: string, data: Partial<RoleFormValues>) => {
      return await updateRoleMutation({ id, data });
    },
    deleteRole: deleteRoleMutation,
  };
}

// 用於獲取所有角色的 hook (用於下拉選單等)
export function useRoles() {
  const { data, isLoading } = useQuery({
    queryKey: ['roles-all'],
    queryFn: async () => {
      const response = await pb.collection('roles').getFullList();
      return response.reduce(
        (acc, role) => {
          acc[role.id] = role;
          return acc;
        },
        {} as Record<string, Role>
      );
    },
  });

  return {
    roles: data || {},
    isLoading,
  };
}
