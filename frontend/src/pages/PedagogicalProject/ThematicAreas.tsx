import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookOpen, Users, Layers } from 'lucide-react';
import { ThematicArea } from '../../types';
import { thematicAreaService } from '../../services/api/thematicAreaService';

export default function ThematicAreas() {
  const [areas, setAreas] = useState<ThematicArea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAreas();
  }, []);

  const loadAreas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await thematicAreaService.getAll();
      setAreas(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar áreas temáticas');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    totalAreas: areas.length,
    totalMicrocourses: areas.reduce((acc, area: any) => acc + (area.microcourses?.length || 0), 0),
    totalCoordinators: areas.filter((area: any) => area.coordinator).length,
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
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Carregando áreas temáticas...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <div className="text-red-600 mb-4">Erro: {error}</div>
            <button
              onClick={loadAreas}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        ) : areas.length === 0 ? (
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
              const microcoursesCount = (area as any).microcourses?.length || 0;

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
                            {microcoursesCount} microcursos
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
