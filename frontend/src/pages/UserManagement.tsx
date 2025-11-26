import { Users, UserPlus, Search, Edit, Trash2, Shield } from 'lucide-react';
import { useState } from 'react';
import Header from '../components/Header';
import { usePermissions } from '../hooks/usePermissions';
import Avatar from '../components/Avatar';
import Tag from '../components/Tag';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
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
      role: 'admin',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Maria Silva',
      email: 'maria.silva@courseflow.com',
      role: 'instructor',
      createdAt: '2024-02-20',
    },
    {
      id: '3',
      name: 'Carlos Santos',
      email: 'carlos.santos@courseflow.com',
      role: 'instructor',
      createdAt: '2024-03-10',
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana.costa@courseflow.com',
      role: 'student',
      createdAt: '2024-03-15',
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: 'admin' | 'instructor' | 'student') => {
    if (role === 'admin') {
      return (
        <Tag variant="purple" size="sm" icon={<Shield size={12} />}>
          Admin
        </Tag>
      );
    }
    if (role === 'instructor') {
      return (
        <Tag variant="info" size="sm" icon={<Users size={12} />}>
          Instructor
        </Tag>
      );
    }
    return (
      <Tag variant="default" size="sm" icon={<Users size={12} />}>
        Student
      </Tag>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const instructorCount = users.filter((u) => u.role === 'instructor').length;
  const studentCount = users.filter((u) => u.role === 'student').length;

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <Header />

      <main className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Users className="text-primary-600" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Usuários</h1>
              <p className="text-gray-600 mt-1">
                Gerencie os usuários do sistema. Apenas administradores têm acesso a esta área.
              </p>
            </div>
          </div>
        </div>

        {/* User Info Banner */}
        <div className="card p-4 mb-6 bg-gradient-to-r from-purple-50 to-purple-100/50 border-purple-200">
          <div className="flex items-center gap-3 text-purple-700">
            <div className="p-2 bg-purple-200 rounded-lg">
              <Shield size={20} className="text-purple-700" />
            </div>
            <p className="font-semibold">
              Você está logado como: <span className="text-purple-900">{currentUser?.name}</span> ({currentUser?.role})
            </p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="card p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-11"
              />
            </div>
            <button className="btn-primary flex items-center gap-2 group">
              <UserPlus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Adicionar Usuário</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="card p-6 hover:shadow-large transition-all duration-300 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total de Usuários</p>
                <p className="text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-xl">
                <Users className="text-primary-600" size={32} />
              </div>
            </div>
          </div>
          <div className="card p-6 hover:shadow-large transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Administradores</p>
                <p className="text-3xl font-bold text-purple-600">{adminCount}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Shield className="text-purple-600" size={32} />
              </div>
            </div>
          </div>
          <div className="card p-6 hover:shadow-large transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Instrutores</p>
                <p className="text-3xl font-bold text-blue-600">{instructorCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="text-blue-600" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <Users className="text-gray-400" size={40} />
              </div>
              <p className="text-gray-600 font-medium text-lg mb-2">Nenhum usuário encontrado</p>
              <p className="text-gray-500 text-sm">Tente ajustar os termos de busca</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Perfil
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 animate-fade-in group"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar name={user.name} size="md" />
                          <div>
                            <div className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{formatDate(user.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Editar usuário"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Excluir usuário"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Resumo */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{filteredUsers.length}</span> de{' '}
            <span className="font-semibold text-gray-900">{users.length}</span> usuários
          </div>
        )}

        {/* Info Footer */}
        <div className="mt-6 card p-5 bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-200 rounded-lg flex-shrink-0">
              <Shield size={20} className="text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Controle de Acesso (RBAC)</p>
              <p className="text-sm text-blue-800 leading-relaxed">
                Esta página é protegida por <strong>Role-Based Access Control</strong>. Apenas usuários com perfil{' '}
                <strong>Admin</strong> podem acessar esta funcionalidade. Usuários com outros perfis não conseguem ver
                este link no menu nem acessar esta rota.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
