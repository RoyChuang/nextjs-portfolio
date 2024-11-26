import { useQuery } from '@tanstack/react-query';

import { getRoles } from '@/api/roles';
import { Role } from '@/types/role';

export function useRoles() {
  const { data: roles = [], isLoading } = useQuery<Role[]>({
    queryKey: ['roles'],
    queryFn: getRoles,
    staleTime: 1000 * 60 * 5, // 5分鐘內不重新獲取
    cacheTime: 1000 * 60 * 30, // 30分鐘後清除緩存
  });

  // 轉換為以 id 為 key 的對象
  const rolesMap = roles.reduce(
    (acc, role) => {
      acc[role.id] = role;
      return acc;
    },
    {} as Record<string, Role>
  );

  return {
    roles: rolesMap,
    isLoading,
  };
}
