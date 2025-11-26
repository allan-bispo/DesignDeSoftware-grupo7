import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { BookOpen, Search, Eye, Edit, Plus, Calendar } from 'lucide-react';
import Header from '../components/Header';
import { useCourses, useCreateCourse, useUpdateCourse } from '../hooks/useCourses';
import { Course } from '../types';
import CreateCourseModal from '../components/CreateCourseModal';
import ViewCourseModal from '../components/ViewCourseModal';
import EditCourseModal from '../components/EditCourseModal';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const queryClient = useQueryClient();

  // Busca cursos do backend
  const { data: coursesData, isLoading, error } = useCourses({
    search: searchTerm || undefined,
    limit: 100,
  });

  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();

  const courses = coursesData?.data || [];

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleCreateCourse = async (data: any) => {
    await createCourseMutation.mutateAsync(data);
    queryClient.invalidateQueries({ queryKey: ['courses'] });
  };

  const handleUpdateCourse = async (data: any) => {
    if (!selectedCourse) return;
    await updateCourseMutation.mutateAsync({ id: selectedCourse.id, data });
    queryClient.invalidateQueries({ queryKey: ['courses'] });
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Header />
        <div className="flex flex-col items-center justify-center h-96">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl mb-4">
            <p className="text-red-700 font-medium">Erro ao carregar cursos: {(error as Error).message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <Header />
      
      <main className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Gestão de Cursos</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center gap-2 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Novo Curso</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="card p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-11"
              />
            </div>
          </div>
        </div>

        {/* Tabela de Cursos */}
        <div className="card overflow-hidden">
          {courses.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <BookOpen className="text-gray-400" size={40} />
              </div>
              <p className="text-gray-600 font-medium text-lg mb-2">Nenhum curso encontrado</p>
              <p className="text-gray-500 text-sm">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Carga Horária
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Progresso
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Data de Expiração
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {courses.map((course: Course, index: number) => (
                    <tr 
                      key={course.id} 
                      className="hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 animate-fade-in group"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                            <BookOpen className="text-primary-600" size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                              {course.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md line-clamp-2" title={course.description}>
                          {course.description || 'Sem descrição'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
                            {course.workload}h
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                course.completion >= 80 ? 'bg-green-500' :
                                course.completion >= 50 ? 'bg-blue-500' :
                                course.completion >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${course.completion}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{course.completion}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          {formatDate(course.expirationDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewCourse(course)}
                            className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Ver detalhes"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                            title="Editar"
                          >
                            <Edit size={18} />
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
        {courses.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{courses.length}</span>{' '}
            {courses.length === 1 ? 'curso' : 'cursos'}
          </div>
        )}
      </main>

      {/* Modal de Criação */}
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCourse={handleCreateCourse}
        isLoading={createCourseMutation.isPending}
      />

      {/* Modal de Visualização */}
      <ViewCourseModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedCourse(null);
        }}
        course={selectedCourse}
      />

      {/* Modal de Edição */}
      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCourse(null);
        }}
        onUpdateCourse={handleUpdateCourse}
        course={selectedCourse}
        isLoading={updateCourseMutation.isPending}
      />
    </div>
  );
}
