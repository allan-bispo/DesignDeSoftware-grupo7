import { apiClient } from '../api';
import { ThematicArea } from '../../types';

export interface ThematicAreaFilters {
  search?: string;
  coordinatorId?: string;
  isActive?: boolean;
}

export interface CreateThematicAreaDto {
  name: string;
  description?: string;
  coordinatorId?: string;
  isActive?: boolean;
}

export interface UpdateThematicAreaDto extends Partial<CreateThematicAreaDto> {}

export const thematicAreaService = {
  getAll: async (filters?: ThematicAreaFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/thematic-areas?${queryString}` : '/thematic-areas';
    return apiClient.get<{ data: ThematicArea[] }>(endpoint);
  },

  getById: async (id: string) => {
    return apiClient.get<ThematicArea>(`/thematic-areas/${id}`);
  },

  create: async (data: CreateThematicAreaDto) => {
    return apiClient.post<ThematicArea>('/thematic-areas', data);
  },

  update: async (id: string, data: UpdateThematicAreaDto) => {
    return apiClient.put<ThematicArea>(`/thematic-areas/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/thematic-areas/${id}`);
  },
};
