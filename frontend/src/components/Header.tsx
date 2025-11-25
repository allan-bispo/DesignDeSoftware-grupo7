import { useState } from 'react';
import { Plus, Bell, LogOut, Settings } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import UserAuthModal from './UserAuthModal';
import Avatar from './Avatar';

export default function Header() {
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
      <header className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Course Production Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your course production pipeline</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              <Plus size={20} />
              New Course
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Menu de Usuário */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="hover:opacity-80 transition-opacity"
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
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {isAuthenticated && user ? (
                    <>
                      {/* Informações do Usuário */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.avatar}
                            name={user.name}
                            size="md"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-primary-600 font-medium mt-1 uppercase">
                              {user.role}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          <Settings size={16} />
                          <span>Configurações</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Fazer Logout</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Quando não autenticado */}
                      <div className="p-4 text-center">
                        <p className="text-gray-700 font-medium mb-3">Faça login para continuar</p>
                        <button
                          onClick={handleOpenAuth}
                          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
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
