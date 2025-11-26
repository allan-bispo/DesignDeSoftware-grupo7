import { Course } from '../types';
import {
  CourseFilters,
  CoursesResponse,
  SingleResponse,
  CreateCourseDto,
  UpdateCourseDto,
  CourseStats,
} from '../types/api';
import { apiClient } from './api';

// Flag para usar mock ou API real
const USE_MOCK = import.meta.env.VITE_USE_MOCK_COURSES === 'true';

class CourseService {
  async getCourses(filters?: CourseFilters): Promise<CoursesResponse> {
    // Constrói query params
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.responsible && filters.responsible !== 'All') {
      params.append('responsible', filters.responsible);
    }
    if (filters?.trainingType) params.append('trainingType', filters.trainingType);
    if (filters?.period) params.append('period', filters.period);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = `/courses${queryString ? `?${queryString}` : ''}`;

    return await apiClient.get<CoursesResponse>(url);
  }

  async getCourseById(id: string): Promise<SingleResponse<Course>> {
    return await apiClient.get<SingleResponse<Course>>(`/courses/${id}`);
  }

  async createCourse(data: CreateCourseDto): Promise<SingleResponse<Course>> {
    return await apiClient.post<SingleResponse<Course>>('/courses', data);
  }

  async updateCourse(
    id: string,
    data: UpdateCourseDto
  ): Promise<SingleResponse<Course>> {
    return await apiClient.put<SingleResponse<Course>>(`/courses/${id}`, data);
  }

  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete<void>(`/courses/${id}`);
  }

  async getCourseStats(): Promise<CourseStats> {
    return await apiClient.get<CourseStats>('/courses/stats');
  }

  async updateChecklistItem(
    courseId: string,
    itemId: string,
    completed: boolean
  ): Promise<SingleResponse<Course>> {
    return await apiClient.put<SingleResponse<Course>>(
      `/courses/${courseId}/checklist/${itemId}`,
      { completed }
    );
  }
}

export const courseService = new CourseService();