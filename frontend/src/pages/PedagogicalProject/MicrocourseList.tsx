import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, GraduationCap } from 'lucide-react';
import { microcourseService } from '../../services/api/microcourseService';
import CreateMicrocourseModal from '../../components/CreateMicrocourseModal';

export default function MicrocourseList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: microcoursesData, isLoading } = useQuery({
    queryKey: ['microcourses', searchTerm],
    queryFn: () => microcourseService.getAll({ search: searchTerm }),
  });

  const microcourses = (microcoursesData as any)?.data || [];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Microcursos</h1>
          <p className="text-gray-600">Gestão do Projeto Pedagógico</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center gap-2 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Novo Microcurso</span>
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="card p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar microcursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-11"
          />
        </div>
      </div>

      {/* Lista de Microcursos */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando microcursos...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {microcourses.length > 0 ? (
              microcourses.map((microcourse: any, index: number) => (
                <Link
                  key={microcourse.id}
                  to={`/microcourses/${microcourse.id}`}
                  className="block p-6 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors">
                      <GraduationCap className="text-primary-600" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors mb-1">
                        {microcourse.name}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{microcourse.description}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <GraduationCap className="text-gray-400" size={40} />
                </div>
                <p className="text-gray-600 font-medium text-lg mb-2">Nenhum microcurso encontrado</p>
                <p className="text-gray-500 text-sm">Tente ajustar os termos de busca</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Criação */}
      <CreateMicrocourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['microcourses'] });
        }}
      />
    </div>
  );
}
