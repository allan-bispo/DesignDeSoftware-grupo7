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
    return user?.role === 'admin';
  };

  /**
   * Verifica se o usuário é Instructor (Produtor de conteúdo)
   */
  const isInstructor = (): boolean => {
    return user?.role === 'instructor';
  };

  /**
   * Verifica se o usuário é Student
   */
  const isStudent = (): boolean => {
    return user?.role === 'student';
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
    isInstructor,
    isStudent,
    getCurrentRole,
    user,
    // Backwards compatibility aliases
    isProdutor: isInstructor,
  };
}
