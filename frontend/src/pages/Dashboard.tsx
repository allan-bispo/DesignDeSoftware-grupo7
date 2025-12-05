import { useState, useMemo } from 'react';
import { BookOpen, Search, Eye, Edit, Plus, Calendar, X, Clock, Target, Award, Lightbulb, CheckCircle2, Link2, History, ListTodo, ExternalLink, GraduationCap, TrendingUp, AlertCircle, BarChart3 } from 'lucide-react';
import Header from '../components/Header';
import { Course } from '../types';
import CreateCourseModal from '../components/CreateCourseModal';
import EditCourseModal from '../components/EditCourseModal';
import { mockLibraryItems } from '../data/mockData';

type ModalTab = 'info' | 'library' | 'recent' | 'general';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState<ModalTab>('info');
  const [linkedLibraryItems, setLinkedLibraryItems] = useState<string[]>([]);
  const [generalActivities, setGeneralActivities] = useState<{[key: string]: boolean}>({
    'Leitura de material introdutório': false,
    'Exercícios práticos': false,
    'Projeto final': false,
    'Avaliação diagnóstica': false,
    'Fórum de discussão': false,
    'Questionário de autoavaliação': false,
  });

  // Dados mockados de cursos
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Introdução ao React',
      description: 'Aprenda os fundamentos do React, incluindo componentes, hooks e gerenciamento de estado.',
      workload: 40,
      completion: 75,
      expirationDate: '2025-06-30',
      createdAt: '2025-01-10',
      responsible: 'João Silva',
      modules: 8,
      trainingType: 'Frontend',
    },
    {
      id: '2',
      name: 'Node.js Avançado',
      description: 'Domine técnicas avançadas de Node.js, incluindo APIs REST, autenticação e banco de dados.',
      workload: 60,
      completion: 45,
      expirationDate: '2025-07-15',
      createdAt: '2025-01-15',
      responsible: 'Maria Santos',
      modules: 10,
      trainingType: 'Backend',
    },
    {
      id: '3',
      name: 'TypeScript Essencial',
      description: 'Entenda os conceitos essenciais do TypeScript para desenvolver aplicações robustas e tipadas.',
      workload: 30,
      completion: 90,
      expirationDate: '2025-05-20',
      createdAt: '2025-01-05',
      responsible: 'Carlos Oliveira',
      modules: 6,
      trainingType: 'Fullstack',
    },
    {
      id: '4',
      name: 'Python para Data Science',
      description: 'Aprenda a usar Python para análise de dados, visualização e machine learning.',
      workload: 80,
      completion: 30,
      expirationDate: '2025-08-10',
      createdAt: '2025-01-20',
      responsible: 'Ana Costa',
      modules: 12,
      trainingType: 'Data Science',
    },
    {
      id: '5',
      name: 'DevOps e CI/CD',
      description: 'Implemente pipelines de CI/CD e pratique automação de infraestrutura com Docker e Kubernetes.',
      workload: 50,
      completion: 60,
      expirationDate: '2025-07-30',
      createdAt: '2025-01-12',
      responsible: 'Pedro Almeida',
      modules: 9,
      trainingType: 'DevOps',
    },
  ]);

  // Filtra cursos por termo de busca
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleCreateCourse = async (data: any) => {
    // Simula criação de curso
    const newCourse: Course = {
      id: String(courses.length + 1),
      name: data.name,
      description: data.description || '',
      workload: data.workload || 0,
      completion: 0,
      expirationDate: data.expirationDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      responsible: data.responsible,
      modules: data.modules || 0,
      trainingType: data.trainingType,
    };
    setCourses([...courses, newCourse]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateCourse = async (data: any) => {
    if (!selectedCourse) return;
    // Simula atualização de curso
    setCourses(courses.map(course =>
      course.id === selectedCourse.id
        ? { ...course, ...data }
        : course
    ));
    setIsEditModalOpen(false);
    setSelectedCourse(null);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsViewModalOpen(true);
    setActiveTab('info');
  };

  const handleCloseDetails = () => {
    setIsViewModalOpen(false);
    setSelectedCourse(null);
    setActiveTab('info');
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const toggleLibraryItem = (itemId: string) => {
    setLinkedLibraryItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleGeneralActivity = (activity: string) => {
    setGeneralActivities(prev => ({
      ...prev,
      [activity]: !prev[activity]
    }));
  };

  // Dados mockados de atividades recentes
  const recentActivities = selectedCourse?.actionHistory || [
    { id: '1', action: 'Curso criado', user: 'Sistema', timestamp: new Date(), details: 'Curso inicial criado no sistema' },
  ];

  // Calcula a porcentagem de conclusão baseada apenas nas atividades gerais
  const calculateCompletionPercentage = () => {
    const totalGeneralActivities = Object.keys(generalActivities).length;
    const completedGeneralActivities = Object.values(generalActivities).filter(Boolean).length;

    return totalGeneralActivities > 0 ? Math.round((completedGeneralActivities / totalGeneralActivities) * 100) : 0;
  };

  const completionPercentage = calculateCompletionPercentage();

  // Cálculo das métricas
  const metrics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total = courses.length;
    const completed = courses.filter(c => c.completion === 100).length;
    const inProgress = courses.filter(c => c.completion > 0 && c.completion < 100).length;
    const delayed = courses.filter(c => {
      const expiration = new Date(c.expirationDate);
      expiration.setHours(0, 0, 0, 0);
      return expiration < today && c.completion < 100;
    }).length;
    const notStarted = courses.filter(c => c.completion === 0).length;

    const averageCompletion = total > 0
      ? Math.round(courses.reduce((sum, c) => sum + c.completion, 0) / total)
      : 0;

    const totalWorkload = courses.reduce((sum, c) => sum + (c.workload || 0), 0);

    // Distribuição por tipo de treinamento
    const byType: { [key: string]: number } = {};
    courses.forEach(c => {
      const type = c.trainingType || 'Outros';
      byType[type] = (byType[type] || 0) + 1;
    });

    return {
      total,
      completed,
      inProgress,
      delayed,
      notStarted,
      averageCompletion,
      totalWorkload,
      byType
    };
  }, [courses]);

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

        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total de Cursos */}
          <div className="card p-6 hover:shadow-large transition-all duration-300 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total de Cursos</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.total}</p>
              </div>
              <div className="p-3 bg-primary-100 rounded-xl">
                <BookOpen className="text-primary-600" size={32} />
              </div>
            </div>
          </div>

          {/* Cursos Concluídos */}
          <div className="card p-6 hover:shadow-large transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Concluídos</p>
                <p className="text-3xl font-bold text-green-600">{metrics.completed}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.total > 0 ? Math.round((metrics.completed / metrics.total) * 100) : 0}% do total
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle2 className="text-green-600" size={32} />
              </div>
            </div>
          </div>

          {/* Cursos em Andamento */}
          <div className="card p-6 hover:shadow-large transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Em Andamento</p>
                <p className="text-3xl font-bold text-blue-600">{metrics.inProgress}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.total > 0 ? Math.round((metrics.inProgress / metrics.total) * 100) : 0}% do total
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="text-blue-600" size={32} />
              </div>
            </div>
          </div>

          {/* Cursos Atrasados */}
          <div className="card p-6 hover:shadow-large transition-all duration-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Atrasados</p>
                <p className="text-3xl font-bold text-red-600">{metrics.delayed}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Requer atenção urgente
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertCircle className="text-red-600" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Adicionais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Média de Conclusão */}
          <div className="card p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Média de Conclusão</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progresso Geral</span>
                  <span className="font-bold text-gray-900">{metrics.averageCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${metrics.averageCompletion}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Não Iniciados</span>
                  <span className="font-medium text-gray-700">{metrics.notStarted}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carga Horária Total */}
          <div className="card p-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock size={24} className="text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Carga Horária</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalWorkload}h</p>
                <p className="text-sm text-gray-600 mt-1">Total de todos os cursos</p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Média por curso</span>
                  <span className="font-medium text-gray-700">
                    {metrics.total > 0 ? Math.round(metrics.totalWorkload / metrics.total) : 0}h
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Distribuição por Tipo */}
          <div className="card p-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <BarChart3 size={24} className="text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Por Tipo de Treinamento</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(metrics.byType)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([type, count], index) => (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{type}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(count / metrics.total) * 100}%`,
                            transitionDelay: `${700 + index * 50}ms`
                          }}
                        ></div>
                      </div>
                      <span className="font-medium text-gray-900 w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              {Object.keys(metrics.byType).length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">Nenhum curso cadastrado</p>
              )}
            </div>
          </div>
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
          {filteredCourses.length === 0 ? (
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
                  {filteredCourses.map((course: Course, index: number) => (
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
        {filteredCourses.length > 0 && (
          <div className="mt-6 text-sm text-gray-600">
            Mostrando <span className="font-semibold text-gray-900">{filteredCourses.length}</span> de{' '}
            <span className="font-semibold text-gray-900">{courses.length}</span>{' '}
            {courses.length === 1 ? 'curso' : 'cursos'}
          </div>
        )}
      </main>

      {/* Modal de Criação */}
      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCourse={handleCreateCourse}
        isLoading={false}
      />

      {/* Modal de Detalhes do Curso */}
      {isViewModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col animate-scale-in">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2.5 bg-primary-100 rounded-xl">
                    <BookOpen className="text-primary-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                        {selectedCourse.trainingType}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Barra de Progresso */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Progresso de Conclusão</span>
                  <span className={`text-lg font-bold ${
                    completionPercentage === 100
                      ? 'text-green-600'
                      : completionPercentage >= 50
                        ? 'text-blue-600'
                        : 'text-orange-600'
                  }`}>
                    {completionPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      completionPercentage === 100
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : completionPercentage >= 50
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600'
                    }`}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Object.values(generalActivities).filter(Boolean).length} de {Object.keys(generalActivities).length} atividades gerais • {linkedLibraryItems.length} de {mockLibraryItems.length} recursos vinculados
                </p>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-gray-50 border-b border-gray-200 px-6">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
                    activeTab === 'info'
                      ? 'border-primary-600 text-primary-700 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} />
                    <span>Informações Principais</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('library')}
                  className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
                    activeTab === 'library'
                      ? 'border-primary-600 text-primary-700 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Link2 size={18} />
                    <span>Links da Biblioteca</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('recent')}
                  className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
                    activeTab === 'recent'
                      ? 'border-primary-600 text-primary-700 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <History size={18} />
                    <span>Atividades Recentes</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('general')}
                  className={`px-4 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
                    activeTab === 'general'
                      ? 'border-primary-600 text-primary-700 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ListTodo size={18} />
                    <span>Atividades Gerais</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Aba: Informações Principais */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Informações Básicas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="card p-4 bg-gradient-to-br from-blue-50 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="text-blue-600" size={20} />
                        <h3 className="font-semibold text-gray-900">Carga Horária</h3>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">{selectedCourse.workload || 0}h</p>
                    </div>

                    <div className="card p-4 bg-gradient-to-br from-purple-50 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="text-purple-600" size={20} />
                        <h3 className="font-semibold text-gray-900">Data de Expiração</h3>
                      </div>
                      <p className="text-sm font-medium text-purple-700">
                        {formatDate(selectedCourse.expirationDate || new Date())}
                      </p>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="text-primary-600" size={20} />
                      <h3 className="font-bold text-gray-900">Descrição</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{selectedCourse.description}</p>
                  </div>

                  {/* Ementa */}
                  {selectedCourse.syllabus && (
                    <div className="card p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="text-green-600" size={20} />
                        <h3 className="font-bold text-gray-900">Ementa</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{selectedCourse.syllabus}</p>
                    </div>
                  )}

                  {/* Responsável e Módulos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCourse.responsible && (
                      <div className="card p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Responsável</h3>
                        <p className="text-gray-900 font-medium">{selectedCourse.responsible}</p>
                      </div>
                    )}
                    {selectedCourse.modules && (
                      <div className="card p-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Módulos</h3>
                        <p className="text-gray-900 font-medium">{selectedCourse.modules} módulos</p>
                      </div>
                    )}
                  </div>

                  {/* Notas do Projeto */}
                  {selectedCourse.projectNotes && (
                    <div className="card p-5 bg-yellow-50 border-yellow-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="text-yellow-600" size={20} />
                        <h3 className="font-bold text-gray-900">Notas do Projeto</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{selectedCourse.projectNotes}</p>
                    </div>
                  )}

                  {/* Datas */}
                  <div className="card p-5 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Criado em:</p>
                        <p className="text-gray-900 font-semibold">
                          {formatDate(selectedCourse.createdAt || new Date())}
                        </p>
                      </div>
                      {selectedCourse.deliveryDate && (
                        <div>
                          <p className="text-gray-600 font-medium">Data de Entrega:</p>
                          <p className="text-gray-900 font-semibold">
                            {formatDate(selectedCourse.deliveryDate)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Aba: Links da Biblioteca */}
              {activeTab === 'library' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Vincular Recursos da Biblioteca</h3>
                    <span className="text-sm text-gray-600">
                      {linkedLibraryItems.length} itens vinculados
                    </span>
                  </div>

                  <div className="space-y-3">
                    {mockLibraryItems.map((item) => {
                      const isLinked = linkedLibraryItems.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`card p-4 transition-all duration-200 ${
                            isLinked ? 'bg-primary-50 border-2 border-primary-300' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={isLinked}
                              onChange={() => toggleLibraryItem(item.id)}
                              className="mt-1 w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{item.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                      {item.category}
                                    </span>
                                    {item.tags.slice(0, 2).map(tag => (
                                      <span key={tag} className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 hover:bg-primary-100 rounded-lg transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <ExternalLink size={18} className="text-gray-600" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Aba: Atividades Recentes */}
              {activeTab === 'recent' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Histórico de Atividades</h3>

                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="card p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary-100 rounded-lg">
                            <History className="text-primary-600" size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">{activity.action}</h4>
                                {activity.details && (
                                  <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                                )}
                                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                  <span className="font-medium text-primary-600">{activity.user}</span>
                                  <span>•</span>
                                  <span>
                                    {new Date(activity.timestamp).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Aba: Atividades Gerais */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Atividades Gerais do Curso</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Atividades comuns a todos os cursos. Marque as que se aplicam a este curso.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(generalActivities).map(([activity, checked]) => (
                      <label
                        key={activity}
                        className="card p-4 flex items-center gap-3 cursor-pointer hover:bg-primary-50 transition-all duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleGeneralActivity(activity)}
                          className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{activity}</span>
                        </div>
                        {checked && (
                          <CheckCircle2 className="text-primary-600" size={20} />
                        )}
                      </label>
                    ))}
                  </div>

                  <div className="card p-4 bg-blue-50 border-blue-200 mt-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="text-blue-600 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-semibold text-blue-900">Dica</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Estas atividades gerais são padronizadas e aplicáveis a todos os cursos.
                          Selecione apenas aquelas que fazem sentido para este curso específico.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <button
                onClick={handleCloseDetails}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-large transition-all duration-200 hover:scale-105"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      <EditCourseModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCourse(null);
        }}
        onUpdateCourse={handleUpdateCourse}
        course={selectedCourse}
        isLoading={false}
      />
    </div>
  );
}
