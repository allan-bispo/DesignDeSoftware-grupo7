import { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { LogOut, LogIn } from 'lucide-react';

/**
 * Componente de exemplo demonstrando como usar o store de usuário
 * Este componente mostra:
 * - Como fazer login
 * - Como fazer logout
 * - Como acessar dados do usuário de qualquer lugar
 */
export default function UserLoginExample() {
  const [email, setEmail] = useState('usuario@example.com');
  const [password, setPassword] = useState('senha123');

  // Acessando o estado global do store
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);

  // Acessando as ações do store
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Exemplo: Store de Usuário</h2>

      {!isAuthenticated ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none"
              placeholder="Sua senha"
            />
          </div>

          {error && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            {isLoading ? 'Carregando...' : 'Fazer Login'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3">Usuário Autenticado!</h3>
            <div className="space-y-2 text-sm text-green-700">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full mb-3"
                />
              )}
              <p>
                <strong>Nome:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Função:</strong> {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Fazer Logout
          </button>
        </div>
      )}
    </div>
  );
}
