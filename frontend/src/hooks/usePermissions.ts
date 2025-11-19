import { useUserStore } from '../store/useUserStore';
import { UserRole } from '../store/types';

/**
 * Hook para verificar permissões baseadas em roles (RBAC)
 */
export function usePermissions() {
  const user = useUserStore((state) => state.user);

  /**
   * Verifica se o usuário tem um dos roles especificados
   * @param allowedRoles - Array de roles permitidos
   * @returns true se o usuário tem permissão, false caso contrário
   */
  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  /**
   * Verifica se o usuário é Admin
   */
  const isAdmin = (): boolean => {
    return user?.role === 'Admin';
  };

  /**
   * Verifica se o usuário é Produtor
   */
  const isProdutor = (): boolean => {
    return user?.role === 'Produtor';
  };

  /**
   * Retorna o role atual do usuário
   */
  const getCurrentRole = (): UserRole | null => {
    return user?.role || null;
  };

  return {
    hasRole,
    isAdmin,
    isProdutor,
    getCurrentRole,
    user,
  };
}
