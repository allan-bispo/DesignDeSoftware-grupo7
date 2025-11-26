import { Course } from './index';

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleResponse<T> {
  data: T;
}

export interface ErrorResponse {
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}

export interface CourseFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export type CoursesResponse = PaginatedResponse<Course>;

export interface CreateCourseDto {
  name: string;
  description: string;
  syllabus: string;
  workload: number;
  expirationDate: string;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {}

export interface CourseStats {
  total: number;
  inProgress: number;
  completed: number;
  delayed: number;
  averageCompletion: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'instructor' | 'student';
    avatar?: string;
    createdAt?: string | Date;
  };
}

export interface AuthError {
  message: string;
  statusCode: number;
}