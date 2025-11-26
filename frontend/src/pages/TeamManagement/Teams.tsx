import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Users, UserCheck, Clock } from 'lucide-react';
import { teamService } from '../../services/api/teamService';

export default function Teams() {
  const [searchTerm] = useState('');

  const { data: teams, isLoading } = useQuery({
    queryKey: ['teams', searchTerm],
    queryFn: () => teamService.getAll({ search: searchTerm }),
  });

  const stats = {
    totalTeams: teams?.data?.length || 0,
    totalMembers: 0,
    activeTeams: 0,
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Equipes</h1>
          <p className="text-gray-600 mt-1">Gestão de Equipes e Colaboradores</p>
        </div>
        <Link
          to="/teams/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nova Equipe
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Equipes</p>
              <p className="text-2xl font-bold mt-1">{stats.totalTeams}</p>
            </div>
            <Users className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Membros Ativos</p>
              <p className="text-2xl font-bold mt-1">{stats.totalMembers}</p>
            </div>
            <UserCheck className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Equipes Ativas</p>
              <p className="text-2xl font-bold mt-1">{stats.activeTeams}</p>
            </div>
            <Clock className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : teams?.data?.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Nenhuma equipe cadastrada
            </h3>
            <p className="text-gray-500 mb-4">
              Comece criando sua primeira equipe
            </p>
            <Link
              to="/teams/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Criar Equipe
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {teams?.data?.map((team: any) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{team.name}</h3>
                    <p className="text-sm text-gray-600">{team.description}</p>
                  </div>
                  {team.isActive ? (
                    <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                      Ativa
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                      Inativa
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserCheck size={16} />
                    <span>{team.members?.length || 0} membros</span>
                  </div>

                  {team.microcourse && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{team.microcourse.name}</span>
                    </div>
                  )}
                </div>

                {team.leader && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-1">Líder</p>
                    <p className="text-sm font-medium">{team.leader.name}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
