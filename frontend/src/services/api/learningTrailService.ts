import { apiClient } from '../api';
import { LearningTrail } from '../../types';
import { PaginatedResponse, SingleResponse } from '../../types/api';

export const learningTrailService = {
  getAll: async (): Promise<PaginatedResponse<LearningTrail>> => {
    return apiClient.get<PaginatedResponse<LearningTrail>>('/learning-trails');
  },

  getById: async (id: string): Promise<SingleResponse<LearningTrail>> => {
    return apiClient.get<SingleResponse<LearningTrail>>(`/learning-trails/${id}`);
  },

  create: async (learningTrail: Partial<LearningTrail>): Promise<SingleResponse<LearningTrail>> => {
    return apiClient.post<SingleResponse<LearningTrail>>('/learning-trails', learningTrail);
  },

  update: async (id: string, learningTrail: Partial<LearningTrail>): Promise<SingleResponse<LearningTrail>> => {
    return apiClient.put<SingleResponse<LearningTrail>>(`/learning-trails/${id}`, learningTrail);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/learning-trails/${id}`);
  },
};
