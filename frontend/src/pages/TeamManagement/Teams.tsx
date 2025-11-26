import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, UserCheck, Clock } from 'lucide-react';
import { Team, TeamType } from '../../types';

export default function Teams() {
  // Dados mockados de equipes
  const [teams] = useState<Team[]>([
    {
      id: '1',
      name: 'Equipe de Produção de Conteúdo',
      description: 'Responsável pela criação e revisão de materiais didáticos e conteúdos educacionais.',
      type: TeamType.PRODUCTION,
      leader: {
        id: 'u1',
        name: 'Ana Paula Costa',
        email: 'ana.costa@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      isActive: true,
      createdAt: '2025-01-05T10:00:00Z',
      updatedAt: '2025-01-15T14:00:00Z',
    },
    {
      id: '2',
      name: 'Equipe Pedagógica',
      description: 'Elaboração de estratégias pedagógicas e acompanhamento metodológico dos cursos.',
      type: TeamType.PEDAGOGICAL,
      leader: {
        id: 'u2',
        name: 'Dr. Roberto Silva',
        email: 'roberto.silva@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      isActive: true,
      createdAt: '2025-01-08T09:00:00Z',
      updatedAt: '2025-01-18T11:00:00Z',
    },
    {
      id: '3',
      name: 'Equipe de Tutoria',
      description: 'Suporte e acompanhamento direto aos alunos durante os cursos.',
      type: TeamType.TUTORING,
      leader: {
        id: 'u3',
        name: 'Maria Eduarda Santos',
        email: 'maria.santos@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      isActive: true,
      createdAt: '2025-01-10T08:00:00Z',
      updatedAt: '2025-01-20T16:00:00Z',
    },
    {
      id: '4',
      name: 'Equipe de Coordenação',
      description: 'Gestão e coordenação geral dos projetos e equipes.',
      type: TeamType.COORDINATION,
      leader: {
        id: 'u4',
        name: 'Prof. Carlos Mendes',
        email: 'carlos.mendes@example.com',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00Z',
      },
      isActive: true,
      createdAt: '2025-01-12T10:30:00Z',
      updatedAt: '2025-01-22T13:00:00Z',
    },
    {
      id: '5',
      name: 'Equipe de Suporte Técnico',
      description: 'Suporte técnico e resolução de problemas da plataforma.',
      type: TeamType.SUPPORT,
      isActive: false,
      createdAt: '2025-01-15T11:00:00Z',
      updatedAt: '2025-01-23T09:00:00Z',
    },
  ]);

  const activeTeams = teams.filter(t => t.isActive);
  const stats = {
    totalTeams: teams.length,
    totalMembers: 87,
    activeTeams: activeTeams.length,
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
        {teams.length === 0 ? (
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
            {teams.map((team: Team) => {
              // Mock de membros
              const mockMembersCount = Math.floor(Math.random() * 20) + 5;

              return (
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
                      <span>{mockMembersCount} membros</span>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
