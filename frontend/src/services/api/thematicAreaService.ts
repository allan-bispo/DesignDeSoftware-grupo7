import { apiClient } from '../api';
import { ThematicArea } from '../../types';
import { PaginatedResponse, SingleResponse } from '../../types/api';

export const thematicAreaService = {
  getAll: async (): Promise<PaginatedResponse<ThematicArea>> => {
    return apiClient.get<PaginatedResponse<ThematicArea>>('/thematic-areas');
  },

  getById: async (id: string): Promise<SingleResponse<ThematicArea>> => {
    return apiClient.get<SingleResponse<ThematicArea>>(`/thematic-areas/${id}`);
  },

  create: async (thematicArea: Partial<ThematicArea>): Promise<SingleResponse<ThematicArea>> => {
    return apiClient.post<SingleResponse<ThematicArea>>('/thematic-areas', thematicArea);
  },

  update: async (id: string, thematicArea: Partial<ThematicArea>): Promise<SingleResponse<ThematicArea>> => {
    return apiClient.put<SingleResponse<ThematicArea>>(`/thematic-areas/${id}`, thematicArea);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/thematic-areas/${id}`);
  },
};
