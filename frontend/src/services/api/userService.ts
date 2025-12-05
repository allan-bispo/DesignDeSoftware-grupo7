import { apiClient } from '../api';
import { User, UserRole } from '../../types/user';
import { SingleResponse, PaginatedResponse } from '../../types/api';

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  department?: string;
  bio?: string;
  specializations?: string[];
  avatar?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  department?: string;
  bio?: string;
  specializations?: string[];
  avatar?: string;
}

export const userService = {
  create: async (data: CreateUserData): Promise<SingleResponse<User>> => {
    return apiClient.post<SingleResponse<User>>('/users', data);
  },

  getProfile: async (): Promise<SingleResponse<User>> => {
    return apiClient.get<SingleResponse<User>>('/users/profile');
  },

  updateProfile: async (data: UpdateProfileData): Promise<SingleResponse<User>> => {
    return apiClient.put<SingleResponse<User>>('/users/profile', data);
  },

  getAllUsers: async (): Promise<PaginatedResponse<User>> => {
    return apiClient.get<PaginatedResponse<User>>('/users');
  },
};
