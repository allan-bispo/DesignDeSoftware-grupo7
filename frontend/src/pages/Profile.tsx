import { useState, useEffect } from 'react';
import { User, UserRoleLabels } from '../types/user';
import { userService } from '../services/api/userService';
import { useUserStore } from '../store/useUserStore';

export default function Profile() {
  const { user: storeUser, setUser } = useUserStore();
  const [user, setUserData] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    department: '',
    bio: '',
    specializations: [] as string[],
    avatar: '',
  });

  const [newSpecialization, setNewSpecialization] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userService.getProfile();
      setUserData(response.data);

      // Populate form data
      setFormData({
        name: response.data.name || '',
        phone: response.data.phone || '',
        department: response.data.department || '',
        bio: response.data.bio || '',
        specializations: response.data.specializations || [],
        avatar: response.data.avatar || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      const response = await userService.updateProfile(formData);
      setUserData(response.data);

      // Update store user if name or avatar changed
      if (storeUser) {
        setUser({
          ...storeUser,
          name: response.data.name,
          avatar: response.data.avatar,
        });
      }

      setIsEditing(false);
      setSuccessMessage('Perfil atualizado com sucesso!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        department: user.department || '',
        bio: user.bio || '',
        specializations: user.specializations || [],
        avatar: user.avatar || '',
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const addSpecialization = () => {
    if (newSpecialization.trim()) {
      setFormData({
        ...formData,
        specializations: [...formData.specializations, newSpecialization.trim()],
      });
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (index: number) => {
    setFormData({
      ...formData,
      specializations: formData.specializations.filter((_, i) => i !== index),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Carregando perfil...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Erro ao carregar perfil</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-3xl text-gray-500">
                      {formData.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL do Avatar
                  </label>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://exemplo.com/avatar.jpg"
                  />
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              ) : (
                <p className="text-gray-900">{user.name}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>

            {/* Role (read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Função
              </label>
              <p className="text-gray-900">{UserRoleLabels[user.role]}</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(00) 00000-0000"
                />
              ) : (
                <p className="text-gray-900">{user.phone || 'Não informado'}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento/Setor
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Departamento de Computação"
                />
              ) : (
                <p className="text-gray-900">{user.department || 'Não informado'}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biografia
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Conte um pouco sobre você..."
                />
              ) : (
                <p className="text-gray-900">{user.bio || 'Não informado'}</p>
              )}
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Áreas de Especialização
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.specializations.length > 0 ? (
                  formData.specializations.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {spec}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeSpecialization(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Nenhuma especialização cadastrada</p>
                )}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSpecialization();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Adicionar especialização..."
                  />
                  <button
                    type="button"
                    onClick={addSpecialization}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Adicionar
                  </button>
                </div>
              )}
            </div>

            {/* Metadata (read-only) */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-gray-500 mb-1">Conta criada em</label>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="block text-gray-500 mb-1">Última atualização</label>
                  <p className="text-gray-900">
                    {new Date(user.updatedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="mt-6 flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
