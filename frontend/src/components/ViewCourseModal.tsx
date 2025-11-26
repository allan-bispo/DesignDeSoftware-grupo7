import { X, BookOpen, Calendar, Clock, BarChart } from 'lucide-react';
import { Course } from '../types';

interface ViewCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}

export default function ViewCourseModal({
  isOpen,
  onClose,
  course,
}: ViewCourseModalProps) {
  if (!isOpen || !course) return null;

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getProgressColor = (completion: number) => {
    if (completion >= 80) return 'bg-green-500';
    if (completion >= 50) return 'bg-blue-500';
    if (completion >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgressLabel = (completion: number) => {
    if (completion >= 80) return 'Quase Completo';
    if (completion >= 50) return 'Em Andamento';
    if (completion >= 30) return 'Iniciado';
    return 'Pouco Progresso';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-large max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BookOpen className="text-primary-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{course.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Detalhes do Curso</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Carga Horária */}
              <div className="card p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-200 rounded-lg">
                    <Clock className="text-blue-700" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-700 mb-1">Carga Horária</p>
                    <p className="text-2xl font-bold text-blue-900">{course.workload}h</p>
                  </div>
                </div>
              </div>

              {/* Progresso */}
              <div className="card p-4 bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-200 rounded-lg">
                    <BarChart className="text-green-700" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-700 mb-1">Progresso</p>
                    <p className="text-2xl font-bold text-green-900">{course.completion}%</p>
                  </div>
                </div>
              </div>

              {/* Data de Expiração */}
              <div className="card p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-200 rounded-lg">
                    <Calendar className="text-purple-700" size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-purple-700 mb-1">Expiração</p>
                    <p className="text-sm font-bold text-purple-900">{formatDate(course.expirationDate)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progresso Visual */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Status de Progresso</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  course.completion >= 80 ? 'bg-green-100 text-green-700' :
                  course.completion >= 50 ? 'bg-blue-100 text-blue-700' :
                  course.completion >= 30 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {getProgressLabel(course.completion)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${getProgressColor(course.completion)}`}
                  style={{ width: `${course.completion}%` }}
                ></div>
              </div>
            </div>

            {/* Descrição */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-primary-600" />
                Descrição
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                {course.description || 'Sem descrição disponível'}
              </p>
            </div>

            {/* Ementa */}
            <div className="card p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen size={16} className="text-primary-600" />
                Ementa
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {course.syllabus || 'Sem ementa disponível'}
              </p>
            </div>

            {/* Checklist (se existir) */}
            {course.checklist && course.checklist.length > 0 && (
              <div className="card p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart size={16} className="text-primary-600" />
                  Checklist de Atividades
                  <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {course.checklist.filter(item => item.completed).length} / {course.checklist.length} completas
                  </span>
                </h3>
                <div className="space-y-2">
                  {course.checklist.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        item.completed ? 'bg-primary-600 border-primary-600' : 'border-gray-300'
                      }`}>
                        {item.completed && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Informações de Data */}
            <div className="card p-5 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Data de Criação</p>
                  <p className="font-semibold text-gray-900">
                    {course.createdAt ? formatDate(course.createdAt) : 'Não disponível'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Data de Expiração</p>
                  <p className="font-semibold text-gray-900">{formatDate(course.expirationDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
