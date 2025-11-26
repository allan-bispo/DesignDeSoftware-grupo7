import { useState } from 'react';
import { Plus, Bell, LogOut, Settings } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import UserAuthModal from './UserAuthModal';
import Avatar from './Avatar';

interface HeaderProps {
  onNewCourse?: () => void;
}

export default function Header({ onNewCourse }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const logout = useUserStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleOpenAuth = () => {
    setIsAuthModalOpen(true);
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-5 shadow-soft sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Painel de Produção de Cursos
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">Gerencie e acompanhe sua linha de produção de cursos</p>
          </div>

          <div className="flex items-center gap-3">
            {onNewCourse && (
              <button
                onClick={onNewCourse}
                className="btn-primary flex items-center gap-2 group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Novo Curso</span>
              </button>
            )}

            <button className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
              <Bell size={20} className="text-gray-600 group-hover:text-primary-600 transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>

            {/* Menu de Usuário */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="hover:opacity-80 transition-all duration-200 hover:ring-2 hover:ring-primary-200 rounded-full"
                title={isAuthenticated && user ? `${user.name}` : 'Fazer login'}
              >
                <Avatar
                  src={user?.avatar}
                  name={user?.name}
                  size="sm"
                />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-large border border-gray-200 z-50 animate-scale-in overflow-hidden">
                  {isAuthenticated && user ? (
                    <>
                      {/* Informações do Usuário */}
                      <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100/50">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.avatar}
                            name={user.name}
                            size="md"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                            <p className="text-sm text-gray-600 truncate">{user.email}</p>
                            <p className="text-xs text-primary-700 font-semibold mt-1.5 uppercase tracking-wide">
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <button
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                        >
                          <Settings size={18} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                          <span className="font-medium">Configurações</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group mt-1"
                        >
                          <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                          <span className="font-medium">Fazer Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Quando não autenticado */}
                      <div className="p-5 text-center">
                        <p className="text-gray-700 font-medium mb-4">Faça login para continuar</p>
                        <button
                          onClick={handleOpenAuth}
                          className="btn-primary w-full"
                        >
                          Fazer Login
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Autenticação */}
      <UserAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
