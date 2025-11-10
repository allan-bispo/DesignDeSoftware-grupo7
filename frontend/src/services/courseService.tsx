import { Course } from '../types';
import {
  CourseFilters,
  CoursesResponse,
  SingleResponse,
  CreateCourseDto,
  UpdateCourseDto,
  CourseStats,
} from '../types/api';
import { mockCourses } from '../data/mockData';
import { delay } from './api';

class CourseService {
  async getCourses(filters?: CourseFilters): Promise<CoursesResponse> {
    await delay(800);

    if (Math.random() < 0.1) {
      throw new Error('Erro simulado ao buscar cursos');
    }

    let filteredCourses = [...mockCourses];

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.name.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.responsible && filters.responsible !== 'All') {
      filteredCourses = filteredCourses.filter(
        (course) => course.responsible === filters.responsible
      );
    }

    if (filters?.trainingType) {
      filteredCourses = filteredCourses.filter(
        (course) => course.trainingType === filters.trainingType
      );
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);

    return {
      data: paginatedCourses,
      pagination: {
        page,
        limit,
        total: filteredCourses.length,
        totalPages: Math.ceil(filteredCourses.length / limit),
      },
    };
  }

  async getCourseById(id: string): Promise<SingleResponse<Course>> {
    await delay(500);

    const course = mockCourses.find((c) => c.id === id);

    if (!course) {
      throw new Error(`Curso com ID ${id} não encontrado`);
    }

    return {
      data: course,
    };
  }

  async createCourse(data: CreateCourseDto): Promise<SingleResponse<Course>> {
    await delay(1000);

    const newCourse: Course = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      completion: 0,
      deliveryDate: new Date(data.deliveryDate),
      checklist: [
        { id: 'c-1', label: 'Folder/card do AVA', completed: false },
        { id: 'c-2', label: 'Escrita do Ebook/Data', completed: false },
        { id: 'c-3', label: 'Ilustrações Ebook', completed: false },
      ],
    };

    return {
      data: newCourse,
    };
  }

  async updateCourse(
    id: string,
    data: UpdateCourseDto
  ): Promise<SingleResponse<Course>> {
    await delay(800);

    const course = mockCourses.find((c) => c.id === id);

    if (!course) {
      throw new Error(`Curso com ID ${id} não encontrado`);
    }

    const updatedCourse: Course = {
      ...course,
      ...data,
      deliveryDate: data.deliveryDate
        ? new Date(data.deliveryDate)
        : course.deliveryDate,
    };

    return {
      data: updatedCourse,
    };
  }

  async deleteCourse(id: string): Promise<void> {
    await delay(500);

    const courseIndex = mockCourses.findIndex((c) => c.id === id);

    if (courseIndex === -1) {
      throw new Error(`Curso com ID ${id} não encontrado`);
    }

    console.log(`Curso ${id} deletado com sucesso`);
  }

  async getCourseStats(): Promise<CourseStats> {
    await delay(600);

    const total = mockCourses.length;
    const completed = mockCourses.filter((c) => c.completion === 100).length;
    const inProgress = mockCourses.filter(
      (c) => c.completion > 0 && c.completion < 100
    ).length;
    const delayed = mockCourses.filter(
      (c) => new Date(c.deliveryDate) < new Date() && c.completion < 100
    ).length;

    const averageCompletion =
      mockCourses.reduce((sum, c) => sum + c.completion, 0) / total;

    return {
      total,
      completed,
      inProgress,
      delayed,
      averageCompletion: Math.round(averageCompletion),
    };
  }
}

export const courseService = new CourseService();