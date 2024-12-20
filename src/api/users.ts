import { RecordModel } from 'pocketbase';

import { pb } from '@/lib/pocketbase';
import { User, UserFormValues } from '@/types/user';

export interface GetUsersParams {
  page: number;
  pageSize: number;
  search?: string;
  sort?: string;
}

export interface UsersResponse {
  items: RecordModel[];
  total: number;
  totalPages: number;
}

export const getUsers = async ({
  page,
  pageSize,
  search,
  sort = '-created',
}: GetUsersParams): Promise<UsersResponse> => {
  const filter = search ? `name ~ "${search}" || email ~ "${search}"` : '';

  const response = await pb.collection('users').getList(page, pageSize, {
    sort: sort,
    filter: filter,
  });

  return {
    items: response.items,
    total: response.totalItems,
    totalPages: response.totalPages,
  };
};

export const createUser = async (data: UserFormValues): Promise<User> => {
  const formData = new FormData();

  // 添加基本字段
  formData.append('email', data.email);
  formData.append('emailVisibility', 'true');
  formData.append('name', data.name);
  formData.append('role', data.role ?? '');
  if (data.password) {
    formData.append('password', data.password);
    formData.append('passwordConfirm', data.passwordConfirm || data.password);
  }

  // 如果有頭像
  if (data.avatar) {
    formData.append('avatar', data.avatar);
  }

  const response = (await pb.collection('users').create(formData)) as User;
  return response;
};

export const updateUser = async (id: string, data: Partial<UserFormValues>) => {
  const formData = new FormData();

  if (data.email) formData.append('email', data.email);
  if (data.name) formData.append('name', data.name);
  if (data.role) formData.append('role', data.role);
  if (data.password) {
    formData.append('password', data.password);
    formData.append('passwordConfirm', data.passwordConfirm || '');
    formData.append('oldPassword', data.oldPassword || '');
  }
  if (data.avatar) formData.append('avatar', data.avatar);

  return await pb.collection('users').update(id, formData);
};

export const deleteUser = async (id: string) => {
  return await pb.collection('users').delete(id);
};
