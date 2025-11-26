import { apiClient } from '../api';
import { Ebook } from '../../types';

export interface EbookFilters {
  search?: string;
  microcourseId?: string;
  status?: string;
  authorId?: string;
}

export interface CreateEbookDto {
  microcourseId: string;
  title: string;
  description?: string;
  authorId?: string;
  illustratorId?: string;
  reviewerId?: string;
  designerId?: string;
}

export interface UpdateEbookDto extends Partial<CreateEbookDto> {
  status?: string;
  contentUrl?: string;
  webVersionUrl?: string;
  pdfVersionUrl?: string;
}

export const ebookService = {
  getAll: async (filters?: EbookFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/ebooks?${queryString}` : '/ebooks';
    return apiClient.get<{ data: Ebook[] }>(endpoint);
  },

  getById: async (id: string) => {
    return apiClient.get<Ebook>(`/ebooks/${id}`);
  },

  create: async (data: CreateEbookDto) => {
    return apiClient.post<Ebook>('/ebooks', data);
  },

  update: async (id: string, data: UpdateEbookDto) => {
    return apiClient.put<Ebook>(`/ebooks/${id}`, data);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/ebooks/${id}`);
  },

  updateStatus: async (id: string, status: string) => {
    return apiClient.patch<Ebook>(`/ebooks/${id}/status`, { status });
  },
};
