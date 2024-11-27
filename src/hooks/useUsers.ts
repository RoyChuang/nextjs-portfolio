import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createUser, deleteUser, getUsers, GetUsersParams, updateUser } from '@/api/users';
import { UserFormValues } from '@/types/user';

export function useUsers(params: GetUsersParams) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', params],
    queryFn: () => getUsers(params),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const { mutateAsync: createUserMutation } = useMutation({
    mutationFn: (data: UserFormValues) => {
      const { role, ...rest } = data;
      return createUser({
        ...rest,
        role,
        passwordConfirm: data.passwordConfirm,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', params] });
    },
  });

  const { mutateAsync: updateUserMutation } = useMutation({
    mutationFn: (params: { id: string; data: Partial<UserFormValues> }) => {
      return updateUser(params.id, params.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      throw error;
    },
  });

  const { mutateAsync: deleteUserMutation } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', params] });
    },
    onError: (error) => {
      throw error;
    },
  });

  return {
    users: data?.items || [],
    total: Number(data?.total) || 0,
    totalPages: Number(data?.totalPages) || 0,
    isLoading,
    createUser: createUserMutation,
    updateUser: async (id: string, data: Partial<UserFormValues>) => {
      return await updateUserMutation({ id, data });
    },
    deleteUser: deleteUserMutation,
  };
}
