import { pb } from '@/lib/pocketbase';
import { Role, RoleFormValues } from '@/types/role';

export interface GetRolesParams {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
}

export interface RolesResponse {
  items: Role[];
  total: number;
  totalPages: number;
}

export const getRoles = async ({
  page,
  pageSize,
  search,
  sort = '-created',
}: GetRolesParams): Promise<RolesResponse> => {
  const filter = search ? `rolename ~ "${search}"` : '';

  const response = await pb.collection('roles').getList(page, pageSize, {
    sort,
    filter,
  });

  return {
    items: response.items,
    total: response.totalItems,
    totalPages: response.totalPages,
  };
};

export const createRole = async (data: RoleFormValues) => {
  return await pb.collection('roles').create(data);
};

export const updateRole = async (id: string, data: Partial<RoleFormValues>) => {
  return await pb.collection('roles').update(id, data);
};

export const deleteRole = async (id: string) => {
  return await pb.collection('roles').delete(id);
};
