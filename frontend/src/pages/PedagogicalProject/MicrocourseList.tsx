import { useState, useEffect } from 'react';
import { Plus, Search, GraduationCap, X, Clock, BookOpen, Target, Award, Lightbulb, CheckCircle2, Link2, History, ListTodo, ExternalLink, Loader2, Trash2, Edit } from 'lucide-react';
import { Microcourse, MicrocourseStatus, PedagogicalApproach } from '../../types';
import CreateMicrocourseModal from '../../components/CreateMicrocourseModal';
import { mockLibraryItems } from '../../data/mockData';
import { microcourseService } from '../../services/api/microcourseService';
import { useUserStore } from '../../store/useUserStore';

type ModalTab = 'info' | 'library' | 'recent' | 'general';

export default function MicrocourseList() {
  const user = useUserStore((state) => state.user);
  const userRole = user?.role || 'student';

  // Verificar permissões
  const canCreate = userRole === 'admin' || userRole === 'instructor';
  const canEdit = userRole === 'admin' || userRole === 'instructor';
  const canDelete = userRole === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedMicrocourse, setSelectedMicrocourse] = useState<Microcourse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
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
  const [microcourses, setMicrocourses] = useState<Microcourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [microcourseToEdit, setMicrocourseToEdit] = useState<Microcourse | null>(null);

  // Carregar microcursos da API
  const loadMicrocourses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await microcourseService.getAll({ search: searchTerm });
      setMicrocourses(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar microcursos');
      console.error('Erro ao carregar microcursos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar microcursos ao montar o componente
  useEffect(() => {
    loadMicrocourses();
  }, []);

  // Recarregar quando o termo de busca mudar (com debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadMicrocourses();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Como a busca já é feita na API, não precisa filtrar localmente
  const filteredMicrocourses = microcourses;

  const handleOpenDetails = (microcourse: Microcourse) => {
    setSelectedMicrocourse(microcourse);
    setIsDetailsModalOpen(true);
    setActiveTab('info');
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedMicrocourse(null);
    setActiveTab('info');
  };

  const handleDelete = async (microcourseId: string) => {
    if (!confirm('Tem certeza que deseja excluir este microcurso? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await microcourseService.delete(microcourseId);
      handleCloseDetails();
      loadMicrocourses(); // Recarregar lista
    } catch (err) {
      alert('Erro ao excluir microcurso. Tente novamente.');
      console.error('Erro ao excluir:', err);
    }
  };

  const handleEdit = () => {
    if (selectedMicrocourse) {
      setMicrocourseToEdit(selectedMicrocourse);
      setIsDetailsModalOpen(false); // Fechar modal de detalhes
      setIsCreateModalOpen(true); // Abrir modal de edição
    }
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
  const recentActivities = [
    { id: '1', action: 'Microcurso criado', user: 'Ana Silva', timestamp: new Date('2025-01-10T10:00:00'), details: 'Microcurso inicial criado no sistema' },
    { id: '2', action: 'Ementa atualizada', user: 'Carlos Santos', timestamp: new Date('2025-01-15T14:30:00'), details: 'Conteúdo programático revisado e atualizado' },
    { id: '3', action: 'Status alterado', user: 'Sistema', timestamp: new Date('2025-01-20T16:00:00'), details: 'Status alterado para: Em Validação Interna' },
  ];

  // Calcula a porcentagem de conclusão baseada apenas nas atividades gerais
  const calculateCompletionPercentage = () => {
    const totalGeneralActivities = Object.keys(generalActivities).length;
    const completedGeneralActivities = Object.values(generalActivities).filter(Boolean).length;

    return totalGeneralActivities > 0 ? Math.round((completedGeneralActivities / totalGeneralActivities) * 100) : 0;
  };

  const completionPercentage = calculateCompletionPercentage();

  const getStatusBadge = (status: MicrocourseStatus) => {
    const statusConfig = {
      [MicrocourseStatus.DRAFT]: { label: 'Rascunho', color: 'bg-gray-100 text-gray-700' },
      [MicrocourseStatus.IN_INTERNAL_VALIDATION]: { label: 'Em Validação Interna', color: 'bg-blue-100 text-blue-700' },
      [MicrocourseStatus.APPROVED]: { label: 'Aprovado', color: 'bg-green-100 text-green-700' },
      [MicrocourseStatus.PUBLISHED]: { label: 'Publicado', color: 'bg-purple-100 text-purple-700' },
      [MicrocourseStatus.IN_EXTERNAL_VALIDATION]: { label: 'Em Validação Externa', color: 'bg-yellow-100 text-yellow-700' },
      [MicrocourseStatus.REJECTED]: { label: 'Rejeitado', color: 'bg-red-100 text-red-700' },
    };
    return statusConfig[status] || statusConfig[MicrocourseStatus.DRAFT];
  };

  const getApproachLabel = (approach: PedagogicalApproach) => {
    const labels = {
      [PedagogicalApproach.SELF_INSTRUCTIONAL]: 'Auto-instrucional',
      [PedagogicalApproach.TUTOR_SUPPORTED]: 'Com Suporte de Tutor',
      [PedagogicalApproach.ADVISOR_SUPPORTED]: 'Com Suporte de Orientador',
    };
    return labels[approach];
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Microcursos</h1>
          <p className="text-gray-600">Gestão do Projeto Pedagógico</p>
        </div>
        {canCreate && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center gap-2 group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Novo Microcurso</span>
          </button>
        )}
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
        {error && (
          <div className="p-6 bg-red-50 border-b border-red-200">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando microcursos...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMicrocourses.length > 0 ? (
              filteredMicrocourses.map((microcourse: Microcourse, index: number) => (
                <button
                  key={microcourse.id}
                  onClick={() => handleOpenDetails(microcourse)}
                  className="w-full text-left p-6 hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 group animate-fade-in"
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
                </button>
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

      {/* Modal de Criação/Edição */}
      <CreateMicrocourseModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setMicrocourseToEdit(null);
        }}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          setMicrocourseToEdit(null);
          loadMicrocourses(); // Recarregar lista após criar/editar
        }}
        microcourse={microcourseToEdit}
      />

      {/* Modal de Detalhes do Microcurso */}
      {isDetailsModalOpen && selectedMicrocourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col animate-scale-in">
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2.5 bg-primary-100 rounded-xl">
                    <GraduationCap className="text-primary-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedMicrocourse.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedMicrocourse.status).color}`}>
                        {getStatusBadge(selectedMicrocourse.status).label}
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
                      <p className="text-2xl font-bold text-blue-700">{selectedMicrocourse.workload}h</p>
                    </div>

                    <div className="card p-4 bg-gradient-to-br from-purple-50 to-transparent">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="text-purple-600" size={20} />
                        <h3 className="font-semibold text-gray-900">Abordagem Pedagógica</h3>
                      </div>
                      <p className="text-sm font-medium text-purple-700">
                        {getApproachLabel(selectedMicrocourse.pedagogicalApproach)}
                      </p>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="text-primary-600" size={20} />
                      <h3 className="font-bold text-gray-900">Descrição</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{selectedMicrocourse.description}</p>
                  </div>

                  {/* Ementa */}
                  <div className="card p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="text-green-600" size={20} />
                      <h3 className="font-bold text-gray-900">Ementa</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{selectedMicrocourse.syllabus}</p>
                  </div>

                  {/* Competências Esperadas */}
                  {selectedMicrocourse.expectedCompetencies && (
                    <div className="card p-5 bg-gradient-to-br from-green-50 to-transparent">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="text-green-600" size={20} />
                        <h3 className="font-bold text-gray-900">Competências Esperadas</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{selectedMicrocourse.expectedCompetencies}</p>
                    </div>
                  )}

                  {/* Perfil do Egresso */}
                  {selectedMicrocourse.graduateProfile && (
                    <div className="card p-5 bg-gradient-to-br from-orange-50 to-transparent">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="text-orange-600" size={20} />
                        <h3 className="font-bold text-gray-900">Perfil do Egresso</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{selectedMicrocourse.graduateProfile}</p>
                    </div>
                  )}

                  {/* Bibliografia */}
                  {selectedMicrocourse.bibliography && (
                    <div className="card p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="text-indigo-600" size={20} />
                        <h3 className="font-bold text-gray-900">Bibliografia</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedMicrocourse.bibliography}</p>
                    </div>
                  )}

                  {/* Conteúdo Programático */}
                  {selectedMicrocourse.programContent && (
                    <div className="card p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="text-teal-600" size={20} />
                        <h3 className="font-bold text-gray-900">Conteúdo Programático</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedMicrocourse.programContent}</p>
                    </div>
                  )}

                  {/* Métodos de Avaliação */}
                  {selectedMicrocourse.evaluationMethods && (
                    <div className="card p-5 bg-gradient-to-br from-pink-50 to-transparent">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="text-pink-600" size={20} />
                        <h3 className="font-bold text-gray-900">Métodos de Avaliação</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{selectedMicrocourse.evaluationMethods}</p>
                    </div>
                  )}

                  {/* Estratégias de Ensino */}
                  {selectedMicrocourse.teachingStrategies && (
                    <div className="card p-5 bg-gradient-to-br from-cyan-50 to-transparent">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="text-cyan-600" size={20} />
                        <h3 className="font-bold text-gray-900">Estratégias de Ensino</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{selectedMicrocourse.teachingStrategies}</p>
                    </div>
                  )}

                  {/* Datas */}
                  <div className="card p-5 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 font-medium">Criado em:</p>
                        <p className="text-gray-900 font-semibold">
                          {new Date(selectedMicrocourse.createdAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-medium">Última atualização:</p>
                        <p className="text-gray-900 font-semibold">
                          {new Date(selectedMicrocourse.updatedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
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
                                <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
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
                      Atividades comuns a todos os microcursos. Marque as que se aplicam a este curso.
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
                          Estas atividades gerais são padronizadas e aplicáveis a todos os microcursos.
                          Selecione apenas aquelas que fazem sentido para este curso específico.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-2xl">
              <div className="flex gap-3">
                {canDelete && (
                  <button
                    onClick={() => selectedMicrocourse && handleDelete(selectedMicrocourse.id)}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                    <span>Excluir</span>
                  </button>
                )}
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <Edit size={18} className="group-hover:scale-110 transition-transform" />
                    <span>Editar</span>
                  </button>
                )}
                <button
                  onClick={handleCloseDetails}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-large transition-all duration-200 hover:scale-105"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
