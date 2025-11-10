import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { courseService } from '../services/courseService';
import {
  CourseFilters,
  CoursesResponse,
  SingleResponse,
  CreateCourseDto,
  UpdateCourseDto,
  CourseStats,
} from '../types/api';
import { Course } from '../types';

export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters?: CourseFilters) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  stats: () => [...courseKeys.all, 'stats'] as const,
};

export function useCourses(
  filters?: CourseFilters,
  options?: Omit<
    UseQueryOptions<CoursesResponse, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<CoursesResponse, Error>({
    queryKey: courseKeys.list(filters),
    queryFn: () => courseService.getCourses(filters),
    ...options,
  });
}

export function useCourse(
  id: string,
  options?: Omit<
    UseQueryOptions<SingleResponse<Course>, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<SingleResponse<Course>, Error>({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id, 
    ...options,
  });
}

export function useCourseStats(
  options?: Omit<
    UseQueryOptions<CourseStats, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery<CourseStats, Error>({
    queryKey: courseKeys.stats(),
    queryFn: () => courseService.getCourseStats(),
    ...options,
  });
}

export function useCreateCourse(
  options?: UseMutationOptions<
    SingleResponse<Course>,
    Error,
    CreateCourseDto
  >
) {
  const queryClient = useQueryClient();

  return useMutation<SingleResponse<Course>, Error, CreateCourseDto>({
    mutationFn: (data) => courseService.createCourse(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.stats() });
    },
    ...options,
  });
}

export function useUpdateCourse(
  options?: UseMutationOptions<
    SingleResponse<Course>,
    Error,
    { id: string; data: UpdateCourseDto }
  >
) {
  const queryClient = useQueryClient();

  return useMutation<
    SingleResponse<Course>,
    Error,
    { id: string; data: UpdateCourseDto }
  >({
    mutationFn: ({ id, data }) => courseService.updateCourse(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: courseKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.stats() });
    },
    ...options,
  });
}

export function useDeleteCourse(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) => courseService.deleteCourse(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: courseKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.stats() });
    },
    ...options,
  });
}