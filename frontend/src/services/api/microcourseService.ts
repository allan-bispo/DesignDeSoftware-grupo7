import { apiClient } from '../api';
import { Microcourse } from '../../types';

export interface MicrocourseFilters {
  search?: string;
  status?: string;
  thematicAreaId?: string;
  learningTrailId?: string;
  page?: number;
  limit?: number;
}

export const microcourseService = {
  getAll: async (filters?: MicrocourseFilters) => {
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
    return apiClient.get(endpoint);
  },

  getById: async (id: string) => {
    return apiClient.get<Microcourse>(`/microcourses/${id}`);
  },

  create: async (microcourse: Partial<Microcourse>) => {
    return apiClient.post<Microcourse>('/microcourses', microcourse);
  },

  update: async (id: string, microcourse: Partial<Microcourse>) => {
    return apiClient.put<Microcourse>(`/microcourses/${id}`, microcourse);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/microcourses/${id}`);
  },

  startValidation: async (id: string, stage: string) => {
    return apiClient.post(`/microcourses/${id}/validation/${stage}`);
  },
};
