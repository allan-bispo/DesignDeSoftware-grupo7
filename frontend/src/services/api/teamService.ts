import { apiClient } from '../api';
import { Team, TaskAssignment } from '../../types';

export interface TeamFilters {
  search?: string;
  microcourseId?: string;
  leaderId?: string;
  isActive?: boolean;
}

export const teamService = {
  // Teams
  getAll: async (filters?: TeamFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/teams?${queryString}` : '/teams';
    return apiClient.get<{ data: Team[] }>(endpoint);
  },

  getAllTeams: async () => {
    return apiClient.get('/teams');
  },

  getTeamById: async (id: string) => {
    return apiClient.get<Team>(`/teams/${id}`);
  },

  createTeam: async (team: Partial<Team>) => {
    return apiClient.post<Team>('/teams', team);
  },

  updateTeam: async (id: string, team: Partial<Team>) => {
    return apiClient.put<Team>(`/teams/${id}`, team);
  },

  deleteTeam: async (id: string) => {
    return apiClient.delete(`/teams/${id}`);
  },

  // Tasks
  getAllTasks: async (filters?: { status?: string; assignedToId?: string }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const queryString = params.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return apiClient.get(endpoint);
  },

  getTaskById: async (id: string) => {
    return apiClient.get<TaskAssignment>(`/tasks/${id}`);
  },

  createTask: async (task: Partial<TaskAssignment>) => {
    return apiClient.post<TaskAssignment>('/tasks', task);
  },

  updateTask: async (id: string, task: Partial<TaskAssignment>) => {
    return apiClient.put<TaskAssignment>(`/tasks/${id}`, task);
  },

  deleteTask: async (id: string) => {
    return apiClient.delete(`/tasks/${id}`);
  },

  updateTaskProgress: async (id: string, progress: number) => {
    return apiClient.patch(`/tasks/${id}/progress`, { progress });
  },
};
