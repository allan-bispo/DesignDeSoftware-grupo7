import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Users, Layers } from 'lucide-react';
import { ThematicArea } from '../../types';

export default function ThematicAreas() {
  // Dados mockados de áreas temáticas
  const [areas] = useState<ThematicArea[]>([
    {
      id: '1',
      name: 'Inteligência Artificial e Machine Learning',
      description: 'Área focada em algoritmos de aprendizado de máquina, redes neurais, processamento de linguagem natural e visão computacional.',
      isActive: true,
      coordinator: {
        id: 'c1',
        name: 'Dr. Roberto Silva',
        email: 'roberto.silva@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      createdAt: '2025-01-05T10:00:00Z',
      updatedAt: '2025-01-15T14:00:00Z',
    },
    {
      id: '2',
      name: 'Desenvolvimento Web Moderno',
      description: 'Tecnologias e frameworks para desenvolvimento web, incluindo React, Vue, Angular, Node.js e práticas de UX/UI.',
      isActive: true,
      coordinator: {
        id: 'c2',
        name: 'Profª Ana Paula Costa',
        email: 'ana.costa@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      createdAt: '2025-01-08T09:00:00Z',
      updatedAt: '2025-01-18T11:00:00Z',
    },
    {
      id: '3',
      name: 'DevOps e Infraestrutura Cloud',
      description: 'Práticas DevOps, containers, Kubernetes, CI/CD, monitoramento e serviços em cloud (AWS, Azure, GCP).',
      isActive: true,
      coordinator: {
        id: 'c3',
        name: 'Eng. Carlos Mendes',
        email: 'carlos.mendes@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      createdAt: '2025-01-10T08:00:00Z',
      updatedAt: '2025-01-20T16:00:00Z',
    },
    {
      id: '4',
      name: 'Segurança da Informação',
      description: 'Cibersegurança, criptografia, testes de penetração, análise de vulnerabilidades e boas práticas de segurança.',
      isActive: true,
      createdAt: '2025-01-12T10:30:00Z',
      updatedAt: '2025-01-22T13:00:00Z',
    },
    {
      id: '5',
      name: 'Análise de Dados e Big Data',
      description: 'Processamento e análise de grandes volumes de dados, data lakes, data warehouses e visualização de dados.',
      isActive: false,
      coordinator: {
        id: 'c4',
        name: 'Dr. Fernanda Oliveira',
        email: 'fernanda.oliveira@example.com',
        role: 'instructor',
        createdAt: '2024-01-01T00:00:00Z',
      },
      createdAt: '2025-01-15T11:00:00Z',
      updatedAt: '2025-01-23T09:00:00Z',
    },
  ]);

  const stats = {
    totalAreas: areas.length,
    totalMicrocourses: 45,
    totalCoordinators: 4,
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Áreas Temáticas</h1>
          <p className="text-gray-600 mt-1">Gestão do Projeto Pedagógico</p>
        </div>
        <Link
          to="/thematic-areas/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nova Área Temática
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Áreas</p>
              <p className="text-2xl font-bold mt-1">{stats.totalAreas}</p>
            </div>
            <Layers className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Microcursos</p>
              <p className="text-2xl font-bold mt-1">{stats.totalMicrocourses}</p>
            </div>
            <BookOpen className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Coordenadores</p>
              <p className="text-2xl font-bold mt-1">{stats.totalCoordinators}</p>
            </div>
            <Users className="text-purple-500" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {areas.length === 0 ? (
          <div className="p-12 text-center">
            <Layers className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Nenhuma área temática cadastrada
            </h3>
            <p className="text-gray-500 mb-4">
              Comece criando sua primeira área temática
            </p>
            <Link
              to="/thematic-areas/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Criar Área Temática
            </Link>
          </div>
        ) : (
          <div className="divide-y">
            {areas.map((area: ThematicArea) => {
              // Mock de número de microcursos por área
              const mockMicrocoursesCount = Math.floor(Math.random() * 15) + 3;

              return (
                <Link
                  key={area.id}
                  to={`/thematic-areas/${area.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{area.name}</h3>
                      <p className="text-gray-600 mb-3">{area.description}</p>

                      <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-gray-500" />
                          <span className="text-gray-600">
                            {mockMicrocoursesCount} microcursos
                          </span>
                        </div>
                        {area.coordinator && (
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-gray-500" />
                            <span className="text-gray-600">
                              {area.coordinator.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {area.isActive ? (
                      <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                        Ativa
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full">
                        Inativa
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
