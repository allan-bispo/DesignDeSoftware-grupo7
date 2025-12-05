import { useState } from 'react';
import { X, UserPlus, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../types/user';
import { userService } from '../services/api/userService';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  department: string;
}

interface FormErrors {
  [key: string]: string;
}

const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.GENERAL_COORDINATOR]: 'Coordenador Geral',
  [UserRole.PEDAGOGICAL_COORDINATOR]: 'Coordenador Pedagógico',
  [UserRole.THEMATIC_AREA_COORDINATOR]: 'Coordenador de Área Temática',
  [UserRole.CONTENT_CREATOR]: 'Professor Conteudista',
  [UserRole.ADVISOR]: 'Professor Orientador',
  [UserRole.TUTOR]: 'Tutor',
  [UserRole.INSTRUCTIONAL_DESIGNER]: 'Designer Instrucional',
  [UserRole.GRAPHIC_DESIGNER]: 'Designer Gráfico',
  [UserRole.VIDEO_EDITOR]: 'Editor de Vídeo',
  [UserRole.DEVELOPER]: 'Desenvolvedor',
  [UserRole.ILLUSTRATOR]: 'Ilustrador',
  [UserRole.REVIEWER]: 'Revisor',
  [UserRole.STUDENT]: 'Estudante',
};

export default function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: UserRole.STUDENT,
    phone: '',
    department: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
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
      await userService.create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        phone: formData.phone.trim() || undefined,
        department: formData.department.trim() || undefined,
      });

      handleClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      setErrors({
        submit: error.response?.data?.message || 'Erro ao criar usuário. Tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: UserRole.STUDENT,
      phone: '',
      department: '',
    });
    setErrors({});
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-large max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <UserPlus className="text-primary-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Adicionar Novo Usuário</h2>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`input-field ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Ex: João Silva"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`input-field ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Ex: joao@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`input-field pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Perfil/Função <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="input-field"
            >
              {Object.entries(UserRoleLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Campos Opcionais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Departamento
              </label>
              <input
                type="text"
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="input-field"
                placeholder="Ex: TI"
              />
            </div>
          </div>

          {/* Erro de submissão */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}
        </form>

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
            onClick={handleSubmit}
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
                <UserPlus size={18} />
                <span>Criar Usuário</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
