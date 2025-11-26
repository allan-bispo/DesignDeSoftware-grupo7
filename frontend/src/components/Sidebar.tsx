import {
  LayoutDashboard, BookOpen, Users, BarChart3, Library, LogOut, Shield,
  GraduationCap, Briefcase, FileText, School, UserCheck, Calendar, Award
} from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { usePermissions } from '../hooks/usePermissions';
import { UserRole } from '../store/types';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  allowedRoles?: UserRole[]; // Se não especificado, todos podem ver
}

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useUserStore((state) => state.logout);
  const { hasRole } = usePermissions();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    // AKCIT - Projeto Pedagógico
    {
      id: 'microcourses',
      label: 'Microcursos',
      icon: GraduationCap,
      path: '/microcourses'
    },
    
    {
      id: 'library',
      label: 'Biblioteca',
      icon: Library,
      path: '/library'
    },
    {
      id: 'user-management',
      label: 'Usuários',
      icon: Shield,
      path: '/user-management',
      allowedRoles: ['admin'] // Corrigido para minúsculo
    },
  ];

  // Filtra os itens de menu baseado nas permissões do usuário
  const visibleMenuItems = menuItems.filter((item) => {
    if (!item.allowedRoles) return true; // Se não tem restrição, todos podem ver
    return hasRole(item.allowedRoles); // Verifica se o usuário tem permissão
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 shadow-medium z-40">
      {/* Logo Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-lg">AK</span>
          </div>
          <div>
            <span className="font-bold text-xl text-white">AKCIT</span>
            <p className="text-xs text-primary-100">Sistema de Gestão</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {visibleMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={`group w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 animate-slide-up ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-medium transform scale-[1.02]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-soft'
                }`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Icon 
                  size={20} 
                  className={`transition-transform duration-200 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'
                  }`}
                />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-gray-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 font-medium group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
