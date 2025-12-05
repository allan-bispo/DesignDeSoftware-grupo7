import { apiClient } from './api';
import { LoginRequest, LoginResponse } from '../types/api';

/**
 * Serviço de autenticação
 * Gerencia todas as operações relacionadas à autenticação de usuários
 */
class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user';

  /**
   * Realiza login do usuário
   * @param email - Email do usuário
   * @param password - Senha do usuário
   * @returns Resposta da API com token e dados do usuário
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const payload: LoginRequest = { email, password };
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);

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
