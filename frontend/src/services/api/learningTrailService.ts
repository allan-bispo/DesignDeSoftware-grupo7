import { apiClient } from '../api';
import { LearningTrail } from '../../types';

export interface LearningTrailFilters {
  search?: string;
  thematicAreaId?: string;
  isActive?: boolean;
}

export interface CreateLearningTrailDto {
  name: string;
  description?: string;
  thematicAreaId?: string;
  microcourseIds?: string[];
  expectedDuration?: string;
  certificateTemplate?: string;
  isActive?: boolean;
}

export interface UpdateLearningTrailDto extends Partial<CreateLearningTrailDto> {}

export const learningTrailService = {
  getAll: async (filters?: LearningTrailFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/learning-trails?${queryString}` : '/learning-trails';
    return apiClient.get<{ data: LearningTrail[] }>(endpoint);
  },

  getById: async (id: string) => {
    return apiClient.get<LearningTrail>(`/learning-trails/${id}`);
  },

  create: async (data: CreateLearningTrailDto) => {
    return apiClient.post<LearningTrail>('/learning-trails', data);
  },

  update: async (id: string, data: UpdateLearningTrailDto) => {
    return apiClient.put<LearningTrail>(`/learning-trails/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/learning-trails/${id}`);
  },

  addMicrocourse: async (trailId: string, microcourseId: string) => {
    return apiClient.post(`/learning-trails/${trailId}/microcourses/${microcourseId}`, {});
  },

  removeMicrocourse: async (trailId: string, microcourseId: string) => {
    return apiClient.delete(`/learning-trails/${trailId}/microcourses/${microcourseId}`);
  },

  reorderMicrocourses: async (trailId: string, microcourseIds: string[]) => {
    return apiClient.put(`/learning-trails/${trailId}/microcourses/reorder`, { microcourseIds });
  },
};
