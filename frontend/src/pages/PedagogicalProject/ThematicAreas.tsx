import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Users, Layers } from 'lucide-react';
import { thematicAreaService } from '../../services/api/thematicAreaService';

export default function ThematicAreas() {
  const [searchTerm] = useState('');

  const { data: areas, isLoading } = useQuery({
    queryKey: ['thematic-areas', searchTerm],
    queryFn: () => thematicAreaService.getAll({ search: searchTerm }),
  });

  const stats = {
    totalAreas: areas?.data?.length || 0,
    totalMicrocourses: 0,
    totalCoordinators: 0,
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
        {isLoading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : areas?.data?.length === 0 ? (
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
            {areas?.data?.map((area: any) => (
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
                          {area.microcourses?.length || 0} microcursos
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
