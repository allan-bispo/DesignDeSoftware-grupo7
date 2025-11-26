import { useState } from 'react';
import { X, GraduationCap } from 'lucide-react';
import { PedagogicalApproach, PedagogicalApproachLabels } from '../types';
import { microcourseService } from '../services/api/microcourseService';

interface CreateMicrocourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  description: string;
  syllabus: string;
  expectedCompetencies: string;
  graduateProfile: string;
  bibliography: string;
  workload: string;
  pedagogicalApproach: PedagogicalApproach;
  programContent: string;
  evaluationMethods: string;
  teachingStrategies: string;
  learningTrailId: string;
  thematicAreaId: string;
  coordinatorId: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CreateMicrocourseModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateMicrocourseModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    syllabus: '',
    expectedCompetencies: '',
    graduateProfile: '',
    bibliography: '',
    workload: '',
    pedagogicalApproach: PedagogicalApproach.SELF_INSTRUCTIONAL,
    programContent: '',
    evaluationMethods: '',
    teachingStrategies: '',
    learningTrailId: '',
    thematicAreaId: '',
    coordinatorId: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.syllabus.trim()) {
      newErrors.syllabus = 'Ementa é obrigatória';
    }

    if (!formData.workload.trim()) {
      newErrors.workload = 'Carga horária é obrigatória';
    } else {
      const workloadNum = parseInt(formData.workload);
      if (isNaN(workloadNum) || workloadNum <= 0) {
        newErrors.workload = 'Carga horária deve ser um número positivo';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      const payload: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        syllabus: formData.syllabus.trim(),
        workload: parseInt(formData.workload),
        pedagogicalApproach: formData.pedagogicalApproach,
      };

      // Campos opcionais
      if (formData.expectedCompetencies.trim()) {
        payload.expectedCompetencies = formData.expectedCompetencies.trim();
      }
      if (formData.graduateProfile.trim()) {
        payload.graduateProfile = formData.graduateProfile.trim();
      }
      if (formData.bibliography.trim()) {
        payload.bibliography = formData.bibliography.trim();
      }
      if (formData.programContent.trim()) {
        payload.programContent = formData.programContent.trim();
      }
      if (formData.evaluationMethods.trim()) {
        payload.evaluationMethods = formData.evaluationMethods.trim();
      }
      if (formData.teachingStrategies.trim()) {
        payload.teachingStrategies = formData.teachingStrategies.trim();
      }
      if (formData.learningTrailId.trim()) {
        payload.learningTrailId = formData.learningTrailId.trim();
      }
      if (formData.thematicAreaId.trim()) {
        payload.thematicAreaId = formData.thematicAreaId.trim();
      }
      if (formData.coordinatorId.trim()) {
        payload.coordinatorId = formData.coordinatorId.trim();
      }

      await microcourseService.create(payload);
      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao criar microcurso:', error);
      setErrors({ submit: 'Erro ao criar microcurso. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      syllabus: '',
      expectedCompetencies: '',
      graduateProfile: '',
      bibliography: '',
      workload: '',
      pedagogicalApproach: PedagogicalApproach.SELF_INSTRUCTIONAL,
      programContent: '',
      evaluationMethods: '',
      teachingStrategies: '',
      learningTrailId: '',
      thematicAreaId: '',
      coordinatorId: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-large max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <GraduationCap className="text-primary-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Criar Novo Microcurso</h2>
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
            {/* Campos Obrigatórios */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informações Básicas
              </h3>

              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Microcurso <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Ex: Introdução à Programação"
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
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className={`input-field ${errors.description ? 'border-red-500' : ''}`}
                  placeholder="Descreva o objetivo e conteúdo do microcurso"
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
                  value={formData.syllabus}
                  onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
                  rows={4}
                  className={`input-field ${errors.syllabus ? 'border-red-500' : ''}`}
                  placeholder="Conteúdo programático do microcurso"
                />
                {errors.syllabus && <p className="mt-1 text-sm text-red-600">{errors.syllabus}</p>}
              </div>

              {/* Carga Horária e Abordagem Pedagógica */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="workload" className="block text-sm font-medium text-gray-700 mb-2">
                    Carga Horária (horas) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="workload"
                    value={formData.workload}
                    onChange={(e) => setFormData({ ...formData, workload: e.target.value })}
                    min="1"
                    className={`input-field ${errors.workload ? 'border-red-500' : ''}`}
                    placeholder="Ex: 40"
                  />
                  {errors.workload && <p className="mt-1 text-sm text-red-600">{errors.workload}</p>}
                </div>

                <div>
                  <label htmlFor="pedagogicalApproach" className="block text-sm font-medium text-gray-700 mb-2">
                    Abordagem Pedagógica <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="pedagogicalApproach"
                    value={formData.pedagogicalApproach}
                    onChange={(e) => setFormData({ ...formData, pedagogicalApproach: e.target.value as PedagogicalApproach })}
                    className="input-field"
                  >
                    {Object.entries(PedagogicalApproachLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Campos Opcionais - Conteúdo Pedagógico */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Conteúdo Pedagógico (Opcional)
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expectedCompetencies" className="block text-sm font-medium text-gray-700 mb-2">
                    Competências Esperadas
                  </label>
                  <textarea
                    id="expectedCompetencies"
                    value={formData.expectedCompetencies}
                    onChange={(e) => setFormData({ ...formData, expectedCompetencies: e.target.value })}
                    rows={3}
                    className="input-field"
                    placeholder="Competências que o aluno desenvolverá"
                  />
                </div>

                <div>
                  <label htmlFor="graduateProfile" className="block text-sm font-medium text-gray-700 mb-2">
                    Perfil do Egresso
                  </label>
                  <textarea
                    id="graduateProfile"
                    value={formData.graduateProfile}
                    onChange={(e) => setFormData({ ...formData, graduateProfile: e.target.value })}
                    rows={3}
                    className="input-field"
                    placeholder="Perfil esperado do aluno ao concluir"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="programContent" className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo Programático
                </label>
                <textarea
                  id="programContent"
                  value={formData.programContent}
                  onChange={(e) => setFormData({ ...formData, programContent: e.target.value })}
                  rows={4}
                  className="input-field"
                  placeholder="Detalhamento do conteúdo programático"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="evaluationMethods" className="block text-sm font-medium text-gray-700 mb-2">
                    Métodos de Avaliação
                  </label>
                  <textarea
                    id="evaluationMethods"
                    value={formData.evaluationMethods}
                    onChange={(e) => setFormData({ ...formData, evaluationMethods: e.target.value })}
                    rows={3}
                    className="input-field"
                    placeholder="Como será avaliado o aprendizado"
                  />
                </div>

                <div>
                  <label htmlFor="teachingStrategies" className="block text-sm font-medium text-gray-700 mb-2">
                    Estratégias de Ensino
                  </label>
                  <textarea
                    id="teachingStrategies"
                    value={formData.teachingStrategies}
                    onChange={(e) => setFormData({ ...formData, teachingStrategies: e.target.value })}
                    rows={3}
                    className="input-field"
                    placeholder="Estratégias pedagógicas utilizadas"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bibliography" className="block text-sm font-medium text-gray-700 mb-2">
                  Referências Bibliográficas
                </label>
                <textarea
                  id="bibliography"
                  value={formData.bibliography}
                  onChange={(e) => setFormData({ ...formData, bibliography: e.target.value })}
                  rows={3}
                  className="input-field"
                  placeholder="Livros, artigos e outras referências"
                />
              </div>
            </div>

            {/* Relacionamentos (Opcional) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Relacionamentos (Opcional)
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="thematicAreaId" className="block text-sm font-medium text-gray-700 mb-2">
                    Área Temática (ID)
                  </label>
                  <input
                    type="text"
                    id="thematicAreaId"
                    value={formData.thematicAreaId}
                    onChange={(e) => setFormData({ ...formData, thematicAreaId: e.target.value })}
                    className="input-field"
                    placeholder="UUID da área temática"
                  />
                </div>

                <div>
                  <label htmlFor="learningTrailId" className="block text-sm font-medium text-gray-700 mb-2">
                    Trilha de Aprendizagem (ID)
                  </label>
                  <input
                    type="text"
                    id="learningTrailId"
                    value={formData.learningTrailId}
                    onChange={(e) => setFormData({ ...formData, learningTrailId: e.target.value })}
                    className="input-field"
                    placeholder="UUID da trilha"
                  />
                </div>

                <div>
                  <label htmlFor="coordinatorId" className="block text-sm font-medium text-gray-700 mb-2">
                    Coordenador (ID)
                  </label>
                  <input
                    type="text"
                    id="coordinatorId"
                    value={formData.coordinatorId}
                    onChange={(e) => setFormData({ ...formData, coordinatorId: e.target.value })}
                    className="input-field"
                    placeholder="UUID do coordenador"
                  />
                </div>
              </div>
            </div>

            {/* Erro de submissão */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}
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
                  <span>Criando...</span>
                </>
              ) : (
                <>
                  <GraduationCap size={18} />
                  <span>Criar Microcurso</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

