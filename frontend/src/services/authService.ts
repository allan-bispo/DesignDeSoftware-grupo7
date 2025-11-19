import { apiClient } from './api';
import { LoginRequest, LoginResponse } from '../types/api';

// Flag para usar mock ou API real
const USE_MOCK = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

/**
 * Serviço de autenticação
 * Gerencia todas as operações relacionadas à autenticação de usuários
 */
class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user';

  /**
   * Simula uma chamada ao backend (MOCK)
   * Remove esta função quando o backend estiver pronto
   */
  private async loginMock(email: string, password: string): Promise<LoginResponse> {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validação básica
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }

    // Simula erro de credenciais inválidas
    if (password.length < 3) {
      throw new Error('Credenciais inválidas');
    }

    // Gera um token JWT mockado
    const mockToken = `mock.jwt.token.${Date.now()}`;

    // Determina o role baseado no email (apenas para fins de demonstração)
    let role: 'Admin' | 'Produtor' = 'Produtor';
    if (email.includes('admin')) {
      role = 'Admin';
    }

    // Cria resposta mockada no formato esperado
    const mockResponse: LoginResponse = {
      token: mockToken,
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        role: role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`,
      }
    };

    return mockResponse;
  }

  /**
   * Realiza login do usuário
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Resposta da API com token e dados do usuário
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    let response: LoginResponse;

    if (USE_MOCK) {
      // Usa versão mockada
      console.log('🔧 Usando autenticação MOCKADA');
      response = await this.loginMock(email, password);
    } else {
      // Usa API real
      const payload: LoginRequest = { email, password };
      response = await apiClient.post<LoginResponse>('/auth/login', payload);
    }

    // Armazena o token e dados do usuário
    this.setToken(response.token);
    this.setUser(response.user);

    return response;
  }

  /**
   * Realiza logout do usuário
   */
  logout(): void {
    this.clearToken();
    this.clearUser();
  }

  /**
   * Armazena o token JWT no localStorage
   * @param token - Token JWT
   */
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Recupera o token JWT do localStorage
   * @returns Token JWT ou null se não existir
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Remove o token JWT do localStorage
   */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Verifica se existe um token válido
   * @returns true se o token existe, false caso contrário
   */
  hasToken(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Armazena os dados do usuário no localStorage
   * @param user - Dados do usuário
   */
  setUser(user: LoginResponse['user']): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Recupera os dados do usuário do localStorage
   * @returns Dados do usuário ou null se não existir
   */
  getUser(): LoginResponse['user'] | null {
    const user = localStorage.getItem(this.USER_KEY);
    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Erro ao recuperar usuário do localStorage:', error);
      this.clearUser();
      return null;
    }
  }

  /**
   * Remove os dados do usuário do localStorage
   */
  clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }
}

export const authService = new AuthService();
