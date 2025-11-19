import { create } from 'zustand';
import { UserStore, User } from './types';
import { authService } from '../services/authService';
import { ApiError } from '../services/api';

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

      // Validação básica
      if (!email || !password) {
        throw new Error('Email e senha são obrigatórios');
      }

      // Chamada real ao backend
      const response = await authService.login(email, password);

      // Converter dados do usuário do backend para o formato interno
      const user: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        avatar: response.user.avatar,
        createdAt: new Date(), // Backend pode retornar esta data também se disponível
      };

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      let errorMessage = 'Erro ao fazer login';

      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
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
  const savedUser = authService.getUser();
  const hasToken = authService.hasToken();

  if (savedUser && hasToken) {
    try {
      // Converte a data de string para Date se necessário
      const user: User = {
        ...savedUser,
        createdAt: new Date(savedUser.createdAt || new Date()),
      };

      useUserStore.setState({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Erro ao recuperar usuário do localStorage:', error);
      authService.logout();
    }
  } else {
    // Se não tiver token ou usuário, limpa tudo
    authService.logout();
  }
};
