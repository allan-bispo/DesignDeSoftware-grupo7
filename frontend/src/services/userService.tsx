import { PaginatedResponse } from '../types/api';
import { apiClient } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
}

class UserService {
  async getUsers(): Promise<PaginatedResponse<User>> {
    return await apiClient.get<PaginatedResponse<User>>('/users');
  }
}

export const userService = new UserService();
