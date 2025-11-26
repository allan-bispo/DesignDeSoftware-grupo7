import { apiClient } from '../api';
import { Ebook, VideoLesson, DidacticMaterial } from '../../types';

export const contentService = {
  // Ebooks
  getAllEbooks: async () => {
    return apiClient.get('/ebooks');
  },

  getEbookById: async (id: string) => {
    return apiClient.get<Ebook>(`/ebooks/${id}`);
  },

  createEbook: async (ebook: Partial<Ebook>) => {
    return apiClient.post<Ebook>('/ebooks', ebook);
  },

  updateEbook: async (id: string, ebook: Partial<Ebook>) => {
    return apiClient.put<Ebook>(`/ebooks/${id}`, ebook);
  },

  // VideoLessons
  getAllVideos: async () => {
    return apiClient.get('/videos');
  },

  getVideoById: async (id: string) => {
    return apiClient.get<VideoLesson>(`/videos/${id}`);
  },

  createVideo: async (video: Partial<VideoLesson>) => {
    return apiClient.post<VideoLesson>('/videos', video);
  },

  updateVideo: async (id: string, video: Partial<VideoLesson>) => {
    return apiClient.put<VideoLesson>(`/videos/${id}`, video);
  },

  // Didactic Materials
  getAllMaterials: async () => {
    return apiClient.get('/materials');
  },

  getMaterialById: async (id: string) => {
    return apiClient.get<DidacticMaterial>(`/materials/${id}`);
  },

  createMaterial: async (material: Partial<DidacticMaterial>) => {
    return apiClient.post<DidacticMaterial>('/materials', material);
  },

  updateMaterial: async (id: string, material: Partial<DidacticMaterial>) => {
    return apiClient.put<DidacticMaterial>(`/materials/${id}`, material);
  },
};
