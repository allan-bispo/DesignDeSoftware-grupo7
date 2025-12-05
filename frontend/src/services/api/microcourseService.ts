import { apiClient } from '../api';
import { Microcourse } from '../../types';
import { PaginatedResponse, SingleResponse } from '../../types/api';

export interface MicrocourseFilters {
  search?: string;
  status?: string;
  thematicAreaId?: string;
  learningTrailId?: string;
  page?: number;
  limit?: number;
}

export const microcourseService = {
  getAll: async (filters?: MicrocourseFilters): Promise<PaginatedResponse<Microcourse>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/microcourses?${queryString}` : '/microcourses';
    return apiClient.get<PaginatedResponse<Microcourse>>(endpoint);
  },

  getById: async (id: string): Promise<SingleResponse<Microcourse>> => {
    return apiClient.get<SingleResponse<Microcourse>>(`/microcourses/${id}`);
  },

  create: async (microcourse: Partial<Microcourse>): Promise<SingleResponse<Microcourse>> => {
    return apiClient.post<SingleResponse<Microcourse>>('/microcourses', microcourse);
  },

  update: async (id: string, microcourse: Partial<Microcourse>): Promise<SingleResponse<Microcourse>> => {
    return apiClient.put<SingleResponse<Microcourse>>(`/microcourses/${id}`, microcourse);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/microcourses/${id}`);
  },

  startValidation: async (id: string, stage: string) => {
    return apiClient.post(`/microcourses/${id}/validation/${stage}`);
  },
};
