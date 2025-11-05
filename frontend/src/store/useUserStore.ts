import { create } from 'zustand';
import { UserStore, User } from './types';

/**
 * Store global de usuário e autenticação
 * Gerencia o estado de autenticação e dados do usuário em toda a aplicação
 */
export const useUserStore = create<UserStore>((set) => ({
  // Estado inicial
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Ações
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });

      // Simulação de chamada à API
      // Em produção, seria uma chamada real ao backend
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validar credenciais (simulado)
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      // Criar usuário simulado
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0],
        email: email,
        role: 'student',
        avatar: `https://ui-avatars.com/api/?name=${email}&background=random`,
        createdAt: new Date(),
      };

      set({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Salvar no localStorage para persistência
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
    localStorage.removeItem('user');
  },

  register: async (name: string, email: string, password: string, role: string) => {
    try {
      set({ isLoading: true, error: null });

      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validar campos
      if (!name || !email || !password || !role) {
        throw new Error('Todos os campos são obrigatórios');
      }

      // Criar novo usuário
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role: role as 'admin' | 'instructor' | 'student',
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
        createdAt: new Date(),
      };

      set({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  setUser: (user: User) => {
    set({
      user,
      isAuthenticated: true,
      error: null,
    });
    localStorage.setItem('user', JSON.stringify(user));
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));

/**
 * Hook para recuperar usuário do localStorage ao inicializar a aplicação
 * Deve ser chamado uma vez no componente raiz
 */
export const initializeUserStore = () => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser) as User;
      useUserStore.setState({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Erro ao recuperar usuário do localStorage:', error);
      localStorage.removeItem('user');
    }
  }
};
