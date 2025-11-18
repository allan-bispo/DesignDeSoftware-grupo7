import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';

/**
 * Componente de proteção para rotas públicas (como login)
 * Se o usuário já estiver autenticado, redireciona para /dashboard
 * Caso contrário, permite acesso à rota pública
 */
export default function PublicRoute() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
