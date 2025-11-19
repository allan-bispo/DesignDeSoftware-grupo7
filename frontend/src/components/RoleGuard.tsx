import { Navigate, Outlet } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import { UserRole } from '../store/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
}

/**
 * Componente de proteção para rotas baseadas em roles (RBAC)
 * Verifica se o usuário tem um dos roles permitidos antes de permitir acesso
 * Se não tiver permissão, redireciona para a rota especificada
 */
export default function RoleGuard({ allowedRoles, redirectTo = '/dashboard' }: RoleGuardProps) {
  const { hasRole } = usePermissions();

  if (!hasRole(allowedRoles)) {
    // Usuário não tem permissão, redireciona
    return <Navigate to={redirectTo} replace />;
  }

  // Usuário tem permissão, renderiza as rotas filhas
  return <Outlet />;
}
