import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

/**
 * Componente de proteção para rotas privadas
 * Verifica se o usuário está autenticado antes de permitir acesso
 * Se não estiver autenticado, redireciona para /login
 */
export default function ProtectedRoute() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
