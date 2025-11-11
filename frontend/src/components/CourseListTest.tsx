import { useState } from 'react';
import { useCourses, useCourseStats } from '../hooks/useCourses';
import { AlertCircle, CheckCircle, Loader2, RefreshCw } from 'lucide-react';

export default function CourseListTest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [responsible, setResponsible] = useState('All');

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    dataUpdatedAt,
  } = useCourses({
    search: searchTerm,
    responsible: responsible !== 'All' ? responsible : undefined,
  });

  const { data: stats, isLoading: statsLoading } = useCourseStats();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🧪 Teste React Query
        </h1>
        <p className="text-gray-600">
          Componente de teste para validar integração do React Query
        </p>
      </div>

      {/* Estatísticas */}
      {statsLoading ? (
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary-600" size={24} />
          <span className="ml-2 text-gray-600">Carregando estatísticas...</span>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Em Progresso</p>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Concluídos</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Atrasados</p>
            <p className="text-2xl font-bold text-red-600">{stats.delayed}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <p className="text-sm text-gray-600">Média Conclusão</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.averageCompletion}%
            </p>
          </div>
        </div>
      ) : null}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <select
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="All">Todos Responsáveis</option>
            <option value="Sarah Johnson">Sarah Johnson</option>
            <option value="Michael Chen">Michael Chen</option>
            <option value="Emily Rodriguez">Emily Rodriguez</option>
            <option value="David Kim">David Kim</option>
            <option value="Lisa Wang">Lisa Wang</option>
          </select>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw
              size={18}
              className={isFetching ? 'animate-spin' : ''}
            />
            Atualizar
          </button>
        </div>
      </div>

      {/* Status da Query */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Status da Query</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Estado: </span>
            <span className="font-semibold">
              {isLoading ? (
                <span className="text-blue-600">Carregando</span>
              ) : isError ? (
                <span className="text-red-600">Erro</span>
              ) : (
                <span className="text-green-600">Sucesso</span>
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Atualizando: </span>
            <span className="font-semibold">
              {isFetching ? 'Sim' : 'Não'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Última atualização: </span>
            <span className="font-semibold">
              {dataUpdatedAt
                ? new Date(dataUpdatedAt).toLocaleTimeString()
                : 'Nunca'}
            </span>
          </div>
        </div>
      </div>

      {/* Estado de Loading */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-primary-600 mb-4" size={48} />
          <p className="text-lg text-gray-600">Carregando cursos...</p>
          <p className="text-sm text-gray-500 mt-2">
            Simulando latência de rede (800ms)
          </p>
        </div>
      )}

      {/* Estado de Erro */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">
                Erro ao carregar cursos
              </h3>
              <p className="text-red-700 text-sm mb-4">
                {error?.message || 'Erro desconhecido'}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Cursos */}
      {data && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Cursos</h2>
              <p className="text-sm text-gray-600 mt-1">
                {data.pagination.total} cursos encontrados
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle size={18} />
              <span>Dados em cache</span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {data.data.map((course) => (
              <div key={course.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>👤 {course.responsible}</span>
                      <span>📚 {course.modules} módulos</span>
                      <span>⏱️ {course.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {course.completion}%
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${course.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação Info */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600 text-center">
            Página {data.pagination.page} de {data.pagination.totalPages}
          </div>
        </div>
      )}

      {/* Info sobre Cache */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">
          ℹ️ Informações sobre Cache
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            • Dados ficam em cache por <strong>5 minutos</strong>
          </li>
          <li>• Alterações nos filtros criam novas queries em cache</li>
          <li>
            • Use o botão "Atualizar" para forçar nova busca
          </li>
          <li>
            • Abra o <strong>React Query Devtools</strong> (canto inferior) para
            ver detalhes
          </li>
        </ul>
      </div>
    </div>
  );
}