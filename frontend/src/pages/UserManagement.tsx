import { Users, UserPlus, Search, Edit, Trash2, Shield } from 'lucide-react';
import { useState } from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Produtor';
  createdAt: string;
}

export default function UserManagement() {
  const { user: currentUser } = usePermissions();
  const [searchTerm, setSearchTerm] = useState('');

  // Dados mockados de usuários
  const [users] = useState<MockUser[]>([
    {
      id: '1',
      name: 'João Admin',
      email: 'admin@courseflow.com',
      role: 'Admin',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Maria Silva',
      email: 'maria.silva@courseflow.com',
      role: 'Produtor',
      createdAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'Carlos Santos',
      email: 'carlos.santos@courseflow.com',
      role: 'Produtor',
      createdAt: '2024-03-10',
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana.costa@courseflow.com',
      role: 'Produtor',
      createdAt: '2024-03-15',
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: 'Admin' | 'Produtor') => {
    if (role === 'Admin') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          <Shield size={12} />
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        <Users size={12} />
        Produtor
      </span>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="text-primary-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
        </div>
        <p className="text-gray-600">
          Gerencie os usuários do sistema. Apenas administradores têm acesso a esta área.
        </p>
      </div>

      {/* User Info Banner */}
      <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-center gap-2 text-purple-700">
          <Shield size={20} />
          <p className="font-medium">
            Você está logado como: {currentUser?.name} ({currentUser?.role})
          </p>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
          <UserPlus size={20} />
          Adicionar Usuário
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Usuários</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <Users className="text-gray-400" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter((u) => u.role === 'Admin').length}
              </p>
            </div>
            <Shield className="text-purple-400" size={32} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produtores</p>
              <p className="text-2xl font-bold text-blue-600">
                {users.filter((u) => u.role === 'Produtor').length}
              </p>
            </div>
            <Users className="text-blue-400" size={32} />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Perfil
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Cadastro
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-4">
                      <Edit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Info Footer */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> Esta é uma página protegida por RBAC (Role-Based Access Control).
          Apenas usuários com perfil <strong>Admin</strong> podem acessar esta funcionalidade.
          Usuários com perfil <strong>Produtor</strong> não conseguem ver este link no menu nem
          acessar esta rota.
        </p>
      </div>
    </div>
  );
}
