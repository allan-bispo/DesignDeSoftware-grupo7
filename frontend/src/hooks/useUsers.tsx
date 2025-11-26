import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { userService, User } from '../services/userService';
import { PaginatedResponse } from '../types/api';

// Query keys para o React Query
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
};

/**
 * Hook para buscar lista de usuários
 */
export function useUsers(
  options?: UseQueryOptions<PaginatedResponse<User>, Error>
) {
  return useQuery<PaginatedResponse<User>, Error>({
    queryKey: userKeys.lists(),
    queryFn: () => userService.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
}
