import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Users, BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import { learningTrailService } from '../../services/api/learningTrailService';

export default function LearningTrails() {
  const [searchTerm] = useState('');

  const { data: trails, isLoading } = useQuery({
    queryKey: ['learning-trails', searchTerm],
    queryFn: () => learningTrailService.getAll({ search: searchTerm }),
  });

  const stats = {
    totalTrails: trails?.data?.length || 0,
    totalStudents: 0,
    totalMicrocourses: 0,
    avgCompletion: 0,
  };

  const getColorClasses = (index: number) => {
    const colors = [
      'border-t-blue-500',
      'border-t-green-500',
      'border-t-purple-500',
      'border-t-orange-500',
      'border-t-pink-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Trilhas de Aprendizagem</h1>
          <p className="text-gray-600 mt-1">Gestão do Projeto Pedagógico</p>
        </div>
        <Link
          to="/learning-trails/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Nova Trilha
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total de Trilhas</p>
              <p className="text-2xl font-bold mt-1">{stats.totalTrails}</p>
            </div>
            <BookOpen className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Estudantes</p>
              <p className="text-2xl font-bold mt-1">{stats.totalStudents}</p>
            </div>
            <Users className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Microcursos</p>
              <p className="text-2xl font-bold mt-1">{stats.totalMicrocourses}</p>
            </div>
            <BookOpen className="text-purple-500" size={32} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Conclusão Média</p>
              <p className="text-2xl font-bold mt-1">{stats.avgCompletion}%</p>
            </div>
            <TrendingUp className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : trails?.data?.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Nenhuma trilha cadastrada
            </h3>
            <p className="text-gray-500 mb-4">
              Comece criando sua primeira trilha de aprendizagem
            </p>
            <Link
              to="/learning-trails/new"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Criar Trilha
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {trails?.data?.map((trail: any, index: number) => (
              <div
                key={trail.id}
                className={`bg-white border-t-4 ${getColorClasses(index)} rounded-lg shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{trail.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {trail.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Microcursos</p>
                      <p className="text-lg font-semibold">
                        {trail.microcourses?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Estudantes</p>
                      <p className="text-lg font-semibold">0</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conclusão</p>
                      <p className="text-lg font-semibold">0%</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progresso</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: '0%' }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/learning-trails/${trail.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Ver Detalhes
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
