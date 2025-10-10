import { ChevronDown, ChevronUp, User, Clock, BookOpen, ExternalLink } from 'lucide-react';
import { Course } from '../types';
import { format } from 'date-fns';

interface CourseCardProps {
  course: Course;
  onToggleExpand: (id: string) => void;
  onOpenDetails: (course: Course) => void;
}

export default function CourseCard({ course, onToggleExpand, onOpenDetails }: CourseCardProps) {
  const getTrainingTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Frontend: 'bg-blue-100 text-blue-700',
      Backend: 'bg-green-100 text-green-700',
      Fullstack: 'bg-purple-100 text-purple-700',
      DevOps: 'bg-orange-100 text-orange-700',
      Mobile: 'bg-pink-100 text-pink-700',
      'Data Science': 'bg-cyan-100 text-cyan-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return 'bg-green-500';
    if (completion >= 50) return 'bg-blue-500';
    if (completion >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => onToggleExpand(course.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                {course.expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <h3 className="text-lg font-semibold text-gray-900">{course.name}</h3>
            </div>
            <p className="text-sm text-gray-500 ml-8">{course.description}</p>
          </div>
          
          <button 
            onClick={() => onOpenDetails(course)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Ver detalhes"
          >
            <ExternalLink size={18} className="text-gray-400" />
          </button>
        </div>

        <div className="mt-4 ml-8 grid grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <User size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Responsible</p>
              <p className="text-sm font-medium text-gray-900">{course.responsible}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-sm font-medium text-gray-900">{course.duration}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Modules</p>
              <p className="text-sm font-medium text-gray-900">{course.modules} modules</p>
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-1">Training Type</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTrainingTypeColor(course.trainingType)}`}>
              {course.trainingType}
            </span>
          </div>
        </div>

        <div className="mt-4 ml-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Completion</span>
            <span className="text-sm font-semibold text-gray-900">{course.completion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getCompletionColor(course.completion)}`}
              style={{ width: `${course.completion}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-4 ml-8 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Delivery Date: <span className="font-medium text-gray-900">{format(course.deliveryDate, 'MMM dd, yyyy')}</span>
          </p>
        </div>

        {course.expanded && (
          <div className="mt-6 ml-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Production Checklist</h4>
            <div className="grid grid-cols-2 gap-3">
              {course.checklist.map((item) => (
                <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    readOnly
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className={`text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
            
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h5 className="text-sm font-semibold text-amber-900 mb-1">Project Notes</h5>
              <p className="text-sm text-amber-800">{course.projectNotes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
