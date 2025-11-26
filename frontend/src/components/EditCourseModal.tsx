import { useState, useEffect } from 'react';
import { X, BookOpen, Save } from 'lucide-react';
import { Course } from '../types';
import { UpdateCourseDto } from '../types/api';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateCourse: (data: UpdateCourseDto) => Promise<void>;
  course: Course | null;
  isLoading?: boolean;
}

export default function EditCourseModal({
  isOpen,
  onClose,
  onUpdateCourse,
  course,
  isLoading = false,
}: EditCourseModalProps) {
  const [formData, setFormData] = useState<UpdateCourseDto>({
    name: '',
    description: '',
    syllabus: '',
    workload: 0,
    expirationDate: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UpdateCourseDto, string>>>({});

  // Atualiza o form quando o curso muda
  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        description: course.description,
        syllabus: course.syllabus,
        workload: course.workload,
        expirationDate: typeof course.expirationDate === 'string'
          ? course.expirationDate.split('T')[0]
          : new Date(course.expirationDate).toISOString().split('T')[0],
      });
    }
  }, [course]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'workload' ? parseInt(value) || 0 : value,
    }));
    // Limpa erro do campo ao editar
    if (errors[name as keyof UpdateCourseDto]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateCourseDto, string>> = {};

    if (formData.name && !formData.name.trim()) {
      newErrors.name = 'Nome não pode ser vazio';
    }
    if (formData.description && !formData.description.trim()) {
      newErrors.description = 'Descrição não pode ser vazia';
    }
    if (formData.syllabus && !formData.syllabus.trim()) {
      newErrors.syllabus = 'Ementa não pode ser vazia';
    }
    if (formData.workload && formData.workload <= 0) {
      newErrors.workload = 'Carga horária deve ser maior que 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      // Envia apenas os campos que foram modificados
      const updateData: UpdateCourseDto = {};
      if (formData.name !== course?.name) updateData.name = formData.name;
      if (formData.description !== course?.description) updateData.description = formData.description;
      if (formData.syllabus !== course?.syllabus) updateData.syllabus = formData.syllabus;
      if (formData.workload !== course?.workload) updateData.workload = formData.workload;

      const courseDate = typeof course?.expirationDate === 'string'
        ? course.expirationDate.split('T')[0]
        : new Date(course?.expirationDate || '').toISOString().split('T')[0];

      if (formData.expirationDate !== courseDate) {
        updateData.expirationDate = formData.expirationDate;
      }

      await onUpdateCourse(updateData);
      handleClose();
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-large max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <BookOpen className="text-primary-600" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Editar Curso</h2>
              <p className="text-sm text-gray-600 mt-1">{course.name}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Curso <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Ex: Introdução à Programação"
                disabled={isLoading}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Descrição */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                placeholder="Descreva o objetivo e conteúdo do curso"
                disabled={isLoading}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Ementa */}
            <div>
              <label htmlFor="syllabus" className="block text-sm font-medium text-gray-700 mb-2">
                Ementa <span className="text-red-500">*</span>
              </label>
              <textarea
                id="syllabus"
                name="syllabus"
                value={formData.syllabus}
                onChange={handleChange}
                rows={4}
                className={`input-field ${errors.syllabus ? 'border-red-500' : ''}`}
                placeholder="Conteúdo programático do curso"
                disabled={isLoading}
              />
              {errors.syllabus && <p className="mt-1 text-sm text-red-600">{errors.syllabus}</p>}
            </div>

            {/* Carga Horária e Data de Expiração */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="workload" className="block text-sm font-medium text-gray-700 mb-2">
                  Carga Horária (horas) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="workload"
                  name="workload"
                  value={formData.workload}
                  onChange={handleChange}
                  min="1"
                  className={`input-field ${errors.workload ? 'border-red-500' : ''}`}
                  placeholder="Ex: 40"
                  disabled={isLoading}
                />
                {errors.workload && <p className="mt-1 text-sm text-red-600">{errors.workload}</p>}
              </div>

              <div>
                <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Expiração <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  className={`input-field ${errors.expirationDate ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
                {errors.expirationDate && <p className="mt-1 text-sm text-red-600">{errors.expirationDate}</p>}
              </div>
            </div>

            {/* Informação de Progresso (somente leitura) */}
            <div className="card p-4 bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">Progresso Atual</p>
                <span className="text-sm font-bold text-primary-700">{course.completion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    course.completion >= 80 ? 'bg-green-500' :
                    course.completion >= 50 ? 'bg-blue-500' :
                    course.completion >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${course.completion}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">O progresso é calculado automaticamente com base nas atividades concluídas</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
