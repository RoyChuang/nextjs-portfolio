import { pb } from '@/lib/pocketbase';
import { Role } from '@/types/role';

export const getRoles = async (): Promise<Role[]> => {
  const response = await pb.collection('roles').getList(1, 50, {
    sort: 'created',
  });
  return response.items;
};
