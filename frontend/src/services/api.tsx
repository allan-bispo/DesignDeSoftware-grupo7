const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Retorna os headers para a requisição, incluindo o token JWT se disponível
   */
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    // Adiciona o token JWT se existir
    const token = localStorage.getItem('auth_token');
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers = this.getHeaders(options?.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // Tratamento específico para erro 401 (não autorizado)
        if (response.status === 401) {
          // Limpa o token inválido
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');

          // Redireciona para login se não estiver na página de login
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }

          throw new ApiError(
            response.status,
            response.statusText,
            'Sessão expirada. Por favor, faça login novamente.'
          );
        }

        // Tenta extrair mensagem de erro do corpo da resposta
        let errorMessage = `Erro na requisição: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Se não conseguir parsear o JSON, usa a mensagem padrão
        }

        throw new ApiError(
          response.status,
          response.statusText,
          errorMessage
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        0,
        'Network Error',
        error instanceof Error ? error.message : 'Erro desconhecido'
      );
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new HttpClient(API_BASE_URL);

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));