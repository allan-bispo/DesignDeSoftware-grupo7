import { ChevronDown, ChevronUp, User, Clock, BookOpen, ExternalLink } from 'lucide-react';
import { Course } from '../types';
import { format } from 'date-fns';
import Tag, { TagVariant } from './Tag';

interface CourseCardProps {
  course: Course;
  onToggleExpand: (id: string) => void;
  onOpenDetails: (course: Course) => void;
  onToggleChecklistItem?: (courseId: string, itemId: string, completed: boolean) => void;
}

export default function CourseCard({ course, onToggleExpand, onOpenDetails, onToggleChecklistItem }: CourseCardProps) {
  const getTrainingTypeVariant = (type: string): TagVariant => {
    const variants: Record<string, TagVariant> = {
      Frontend: 'info',
      Backend: 'success',
      Fullstack: 'purple',
      DevOps: 'orange',
      Mobile: 'pink',
      'Data Science': 'primary',
    };
    return variants[type] || 'default';
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return 'bg-green-500';
    if (completion >= 50) return 'bg-blue-500';
    if (completion >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="card group overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={() => onToggleExpand(course.id)}
                className="text-gray-400 hover:text-primary-600 transition-colors p-1 rounded-lg hover:bg-primary-50"
              >
                {course.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-700 transition-colors">
                {course.name}
              </h3>
            </div>
            <p className="text-sm text-gray-600 ml-11 leading-relaxed">{course.description}</p>
          </div>
          
          <button 
            onClick={() => onOpenDetails(course)}
            className="p-2.5 hover:bg-primary-50 rounded-xl transition-all duration-200 hover:scale-110 group/btn"
            title="Ver detalhes"
          >
            <ExternalLink size={18} className="text-gray-400 group-hover/btn:text-primary-600 transition-colors" />
          </button>
        </div>

        <div className="mt-5 ml-11 grid grid-cols-4 gap-4">
          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-1.5 bg-primary-100 rounded-lg">
              <User size={16} className="text-primary-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Responsável</p>
              <p className="text-sm font-semibold text-gray-900">{course.responsible}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Clock size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Duração</p>
              <p className="text-sm font-semibold text-gray-900">{course.duration}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <BookOpen size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Módulos</p>
              <p className="text-sm font-semibold text-gray-900">{course.modules} módulos</p>
            </div>
          </div>

          <div className="p-2">
            <p className="text-xs text-gray-500 font-medium mb-1.5">Tipo de Treinamento</p>
            <Tag variant={getTrainingTypeVariant(course.trainingType)} size="sm" className="shadow-sm">
              {course.trainingType}
            </Tag>
          </div>
        </div>

        <div className="mt-5 ml-11">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm font-semibold text-gray-700">Progresso</span>
            <span className="text-sm font-bold text-gray-900">{course.completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 shadow-sm ${getCompletionColor(course.completion)}`}
              style={{ width: `${course.completion}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-5 ml-11 flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-lg">
          <p className="text-sm text-gray-600">
            Data de Entrega: <span className="font-bold text-gray-900">{format(course.deliveryDate, 'dd/MM/yyyy')}</span>
          </p>
        </div>

        {course.expanded && (
          <div className="mt-6 ml-11 pt-6 border-t border-gray-200 animate-slide-down">
            <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-primary-600 rounded-full"></div>
              Checklist de Produção
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {course.checklist.map((item) => (
                <label key={item.id} className="flex items-center gap-3 cursor-pointer group/item p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => {
                      if (onToggleChecklistItem) {
                        onToggleChecklistItem(course.id, item.id, e.target.checked);
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer transition-all"
                  />
                  <span className={`text-sm font-medium transition-all ${
                    item.completed 
                      ? 'text-gray-400 line-through' 
                      : 'text-gray-700 group-hover/item:text-gray-900'
                  }`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl shadow-soft">
              <h5 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                Notas do Projeto
              </h5>
              <p className="text-sm text-amber-800 leading-relaxed">{course.projectNotes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
